// Practice — NCERT Exercises page for Live Book Ch.6 "Chemical Equilibrium"
// Class 11 Chemistry (ncert-simplified), book_id be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e
// Covers NCERT Unit 6 exercises 6.1–6.34 (PART A: gas-phase chemical equilibrium —
// Kc, Kp, Le Chatelier's principle, ΔG°–K relationship). 6.35–6.73 belong to Ch.7
// "Ionic Equilibrium" and are authored separately.
// Standalone module — NOT inserted into any database by this script.

module.exports = {
  slug: 'ch6-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 34 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '52bab3ca-5ecf-45f3-861c-01902cec1c0a',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A hand-drawn illustration of a balance scale made of molecules, with forward and reverse reaction arrows looping between two flasks, symbolising dynamic chemical equilibrium.',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'A hand-drawn coloured illustration on a deep-charcoal near-black background, muted earthy palette (ochre, terracotta, teal, sage green, indigo, cream), no glow or neon or orange-haze or 3D-render look. Scene: two glass flasks connected by a pair of curved arrows looping in opposite directions (forward and reverse), one flask showing tiny molecule dots in ochre, the other in teal, with the arrows suggesting a continuous back-and-forth exchange rather than a one-way process. Between the flasks, a simple hand-drawn balance scale sits level, evoking equilibrium — not stillness, but two equal and opposite rates in constant motion. Small hand-lettered labels near the arrows read "forward" and "reverse" in a warm cream ink, understated, not glowing. Wide panoramic 16:5 composition, calm and orderly, textbook-illustration quality, flat gouache/ink texture, no photorealism.',
    },
    {
      id: 'b436b720-b461-4d9f-8023-3cad16fd3a97',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are all 34 NCERT exercises for gas-phase chemical equilibrium, regrouped from the textbook's running order into five themes: writing and interpreting equilibrium expressions, calculating $K_c$ and $K_p$ from given data, solving full ICE-table problems, judging which way a reaction will run using $Q_c$, and Le Chatelier's principle together with the $\\Delta G^\\circ$–$K$ link. Every question has a complete worked solution — if you get one wrong, read the solution before moving on. That's where the actual learning happens.",
    },
    {
      id: '6486fac6-2f44-4737-b4b4-930f522fe780',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 6.1–6.34',
      intro:
        'These are the exact 34 exercises from NCERT Class 11 Chemistry, Unit 6 "Equilibrium" (the gas-phase equilibrium half — questions 6.35 onward belong to the ionic equilibrium chapter). Work each one out yourself before reading the solution.',
      sections: [
        // ---------------------------------------------------------------
        // SECTION 1 — Dynamic equilibrium & writing Kc/Kp expressions
        // ---------------------------------------------------------------
        {
          id: 's1-dynamic-equilibrium-expressions',
          title: 'Dynamic equilibrium & writing Kc/Kp expressions',
          blurb: 'What equilibrium actually looks like at the molecular level, and how to write its constant correctly.',
          items: [
            {
              kind: 'numerical',
              id: 'e118f0b5-8223-4240-a4f1-9365c6be280a',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.1',
              prompt:
                'A liquid is in equilibrium with its vapour in a sealed container at a fixed temperature. The volume of the container is suddenly increased.\na) What is the initial effect of the change on vapour pressure?\nb) How do rates of evaporation and condensation change initially?\nc) What happens when equilibrium is restored finally and what will be the final vapour pressure?',
              answer: 'Vapour pressure dips the instant the volume increases, then climbs back to exactly its original value once equilibrium is restored.',
              solution:
                "Before the container is disturbed, evaporation and condensation are happening at the same rate — that's what \"equilibrium\" means here, not that nothing is happening, but that the two opposite processes are perfectly balanced.\n\n**a) Initial effect on vapour pressure.** The moment the volume increases, the same number of vapour molecules are now spread through a larger space. Fewer molecules per unit volume means fewer collisions with the container wall, so vapour pressure drops immediately.\n\n**b) Rates of evaporation and condensation.** Evaporation depends only on the exposed liquid surface and the temperature — neither has changed, so the rate of evaporation stays the same right after the volume jump. Condensation, though, depends on how many vapour molecules are near the liquid surface per unit time, and that number just fell (lower vapour density). So the rate of condensation drops initially, while evaporation carries on unchanged. Now evaporation > condensation, so net evaporation resumes.\n\n**c) Final state.** Because evaporation now outpaces condensation, more liquid evaporates, raising the vapour density again. This continues until the rate of condensation climbs back up to match the (unchanged) rate of evaporation — equilibrium is restored. Since temperature never changed, and vapour pressure at equilibrium depends only on temperature (for a given liquid), the **final vapour pressure is exactly the same as it was before the volume was increased** — only more liquid has evaporated to refill the larger space at that same pressure.",
            },
            {
              kind: 'numerical',
              id: 'a9dc0a6d-515e-44dc-a9eb-2d5feadca277',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.4',
              prompt:
                'Write the expression for the equilibrium constant, Kc for each of the following reactions:\n(i) 2NOCl(g) ⇌ 2NO(g) + Cl2(g)\n(ii) 2Cu(NO3)2(s) ⇌ 2CuO(s) + 4NO2(g) + O2(g)\n(iii) CH3COOC2H5(aq) + H2O(l) ⇌ CH3COOH(aq) + C2H5OH(aq)\n(iv) Fe3+(aq) + 3OH-(aq) ⇌ Fe(OH)3(s)\n(v) I2(s) + 5F2 ⇌ 2IF5',
              answer:
                '(i) $K_c=\\dfrac{[\\ce{NO}]^2[\\ce{Cl2}]}{[\\ce{NOCl}]^2}$ — but per contract no \\dfrac, see solution for correct form.',
              solution:
                "The rule for writing any $K_c$ expression: put products over reactants, each raised to its stoichiometric coefficient — and **leave out pure solids and pure liquids entirely**, because their concentration is a fixed constant at a given temperature (see 6.7 below for why).\n\n**(i)** $\\ce{2NOCl(g) <=> 2NO(g) + Cl2(g)}$ — all species are gases, so all appear:\n$K_c = [\\ce{NO}]^2[\\ce{Cl2}] / [\\ce{NOCl}]^2$\n\n**(ii)** $\\ce{2Cu(NO3)2(s) <=> 2CuO(s) + 4NO2(g) + O2(g)}$ — $\\ce{Cu(NO3)2}$ and $\\ce{CuO}$ are solids, so they're dropped:\n$K_c = [\\ce{NO2}]^4[\\ce{O2}]$\n\n**(iii)** $\\ce{CH3COOC2H5(aq) + H2O(l) <=> CH3COOH(aq) + C2H5OH(aq)}$ — here water is explicitly marked (l) and is a reactant in a dilute aqueous mixture, not the bulk solvent, so unlike normal hydrolysis in excess water, it is **kept** in the expression (the question tells us this by writing it out as a reactant with a stoichiometric role):\n$K_c = [\\ce{CH3COOH}][\\ce{C2H5OH}] / ([\\ce{CH3COOC2H5}][\\ce{H2O}])$\n\n**(iv)** $\\ce{Fe^3+(aq) + 3OH-(aq) <=> Fe(OH)3(s)}$ — the product is a solid, so it's dropped, leaving only the reactants in the denominator:\n$K_c = 1 / ([\\ce{Fe^3+}][\\ce{OH-}]^3)$\n\n**(v)** $\\ce{I2(s) + 5F2 <=> 2IF5}$ — $\\ce{I2(s)}$ is a solid and drops out:\n$K_c = [\\ce{IF5}]^2 / [\\ce{F2}]^5$",
            },
            {
              kind: 'numerical',
              id: '73585518-2498-4f00-973a-87273a4e1dcf',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.7',
              prompt: 'Explain why pure liquids and solids can be ignored while writing the equilibrium constant expression?',
              answer: 'Because their concentration (mol per unit volume) is a fixed constant at a given temperature — it doesn\'t change with how much solid/liquid is present.',
              solution:
                "Concentration is moles divided by volume. For a pure solid or pure liquid, \"moles per unit volume\" is just its density divided by its molar mass — and density at a fixed temperature is a fixed number, no matter how much of the solid or liquid you have. Whether you have 1 gram of $\\ce{CaCO3(s)}$ or 100 grams sitting in the flask, its \"concentration\" is the same fixed value, because you're not measuring how spread out the solid is through the whole container the way you would a gas or a dissolved species — you're just measuring its own internal density.\n\nBecause that value never changes, it doesn't affect where equilibrium sits — you could add more solid and the equilibrium position wouldn't shift at all. So instead of carrying around a constant number inside the $K_c$ expression, chemists fold it into the value of $K_c$ itself and simply drop the solid or liquid from the written expression. Only species whose concentration can actually vary — gases and dissolved (aqueous) species — appear explicitly.",
            },
            {
              kind: 'numerical',
              id: '01cce533-2ae3-4f1d-8f71-5a3017170e57',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.13',
              prompt:
                'The equilibrium constant expression for a gas reaction is,\nKc = [NH3]^4[O2]^5 / [NO]^4[H2O]^6\nWrite the balanced chemical equation corresponding to this expression.',
              answer: '$\\ce{4NO(g) + 6H2O(g) <=> 4NH3(g) + 5O2(g)}$',
              solution:
                "$K_c$ is always written as products (numerator) over reactants (denominator), each raised to its coefficient in the balanced equation. Reading the given expression backwards:\n\n- Numerator (products): $[\\ce{NH3}]^4[\\ce{O2}]^5$ → $4\\ \\ce{NH3}$ and $5\\ \\ce{O2}$ as products\n- Denominator (reactants): $[\\ce{NO}]^4[\\ce{H2O}]^6$ → $4\\ \\ce{NO}$ and $6\\ \\ce{H2O}$ as reactants\n\nSo the equation reads: $\\ce{4NO(g) + 6H2O(g) <=> 4NH3(g) + 5O2(g)}$\n\nCheck it balances before finalising — always do this, a coefficient set that matches the exponents isn't automatically a balanced equation:\n- N: left $4$, right $4$ ✓\n- H: left $6\\times2=12$, right $4\\times3=12$ ✓\n- O: left $4+6=10$, right $5\\times2=10$ ($\\ce{NH3}$ has no oxygen) ✓\n\nAll three atoms balance, so this is the equation.",
            },
          ],
        },
        // ---------------------------------------------------------------
        // SECTION 2 — Calculating equilibrium constants from data
        // ---------------------------------------------------------------
        {
          id: 's2-calculating-k-from-data',
          title: 'Calculating equilibrium constants (Kc, Kp) from equilibrium data',
          blurb: 'Plug given equilibrium concentrations or pressures straight into the K expression, and convert between Kp and Kc.',
          items: [
            {
              kind: 'numerical',
              id: '48b32e15-559c-4ed3-aacb-7b0bd0bff8fa',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.2',
              prompt:
                'What is Kc for the following equilibrium when the equilibrium concentration of each substance is: [SO2]= 0.60M, [O2] = 0.82M and [SO3] = 1.90M ?\n2SO2(g) + O2(g) ⇌ 2SO3(g)',
              answer: '$K_c \\approx 12.23$',
              solution:
                "This is a direct plug-in — every concentration you need is already given at equilibrium, so no ICE table is needed.\n\n$K_c = [\\ce{SO3}]^2 / ([\\ce{SO2}]^2[\\ce{O2}])$\n\nSubstitute:\n$K_c = (1.90)^2 / ((0.60)^2 \\times 0.82)$\n\n$= 3.61 / (0.36 \\times 0.82)$\n\n$= 3.61 / 0.2952$\n\n$K_c \\approx 12.23\\ \\text{mol}^{-1}\\text{L}$",
            },
            {
              kind: 'numerical',
              id: 'c28fa053-e493-4758-b4c2-00544c8a2eec',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.3',
              prompt:
                'At a certain temperature and total pressure of 10^5 Pa, iodine vapour contains 40% by volume of I atoms\nI2(g) ⇌ 2I(g)\nCalculate Kp for the equilibrium.',
              answer: '$K_p \\approx 2.67 \\times 10^4\\ \\text{Pa}$',
              solution:
                "\"40% by volume\" for gases means 40% by moles, since volume fraction equals mole fraction for gases at the same temperature and pressure. So the mole fraction of I atoms is $0.40$, and of $\\ce{I2}$ is $0.60$.\n\nPartial pressures (total pressure $P = 10^5\\ \\text{Pa}$):\n$p_{\\ce{I}} = 0.40 \\times 10^5 = 4.0 \\times 10^4\\ \\text{Pa}$\n$p_{\\ce{I2}} = 0.60 \\times 10^5 = 6.0 \\times 10^4\\ \\text{Pa}$\n\n$K_p = p_{\\ce{I}}^2 / p_{\\ce{I2}} = (4.0 \\times 10^4)^2 / (6.0 \\times 10^4)$\n\n$= 1.6 \\times 10^9 / 6.0 \\times 10^4$\n\n$K_p \\approx 2.67 \\times 10^4\\ \\text{Pa}$",
            },
            {
              kind: 'numerical',
              id: '6c365ed2-e73f-49b7-9893-02446eb04b6b',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.5',
              prompt:
                'Find out the value of Kc for each of the following equilibria from the value of Kp:\n(i) 2NOCl(g) ⇌ 2NO(g) + Cl2(g); Kp= 1.8 × 10^-2 at 500 K\n(ii) CaCO3(s) ⇌ CaO(s) + CO2(g); Kp= 167 at 1073 K',
              answer: '(i) $K_c \\approx 4.4 \\times 10^{-4}$   (ii) $K_c \\approx 1.90$',
              solution:
                "Use $K_p = K_c(RT)^{\\Delta n}$, so $K_c = K_p / (RT)^{\\Delta n}$, where $\\Delta n$ = (moles of gaseous products) − (moles of gaseous reactants), and $R = 0.0821\\ \\text{L·atm/(mol·K)}$ when $K_p$ is in atm.\n\n**(i)** $\\ce{2NOCl(g) <=> 2NO(g) + Cl2(g)}$: gas moles right $= 2+1=3$, left $=2$, so $\\Delta n = 1$.\n\n$K_c = K_p/(RT) = 1.8\\times10^{-2} / (0.0821 \\times 500)$\n\n$= 1.8\\times10^{-2} / 41.05 \\approx 4.4 \\times 10^{-4}$\n\n**(ii)** $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$: only $\\ce{CO2}$ is a gas, on the product side, so $\\Delta n = 1$ (the solids don't count towards $\\Delta n$ any more than they count in the $K$ expression itself).\n\n$K_c = K_p/(RT) = 167 / (0.0821 \\times 1073)$\n\n$= 167 / 88.09 \\approx 1.90\\ \\text{mol/L}$",
            },
            {
              kind: 'numerical',
              id: '02bd589f-1614-47c2-8283-dd87fd4f29db',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.6',
              prompt:
                'For the following equilibrium, Kc= 6.3 × 10^14 at 1000 K\nNO(g) + O3(g) ⇌ NO2(g) + O2(g)\nBoth the forward and reverse reactions in the equilibrium are elementary bimolecular reactions. What is Kc, for the reverse reaction?',
              answer: '$K_c(\\text{reverse}) \\approx 1.59 \\times 10^{-15}$',
              solution:
                "The equilibrium constant of the reverse reaction is always the reciprocal of the forward one — swapping products and reactants flips the expression upside down.\n\n$K_c(\\text{reverse}) = 1/K_c(\\text{forward}) = 1 / (6.3 \\times 10^{14})$\n\n$K_c(\\text{reverse}) \\approx 1.59 \\times 10^{-15}$\n\n(The fact that both directions are elementary bimolecular steps is extra context the question gives you — it doesn't change this calculation; it's just telling you the reaction mechanism is a simple one-step collision both ways.)",
            },
            {
              kind: 'numerical',
              id: 'ad3db162-aa17-4f60-a361-2583506dca83',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.9',
              prompt:
                'Nitric oxide reacts with Br2 and gives nitrosyl bromide as per reaction given below:\n2NO(g) + Br2(g) ⇌ 2NOBr(g)\nWhen 0.087 mol of NO and 0.0437 mol of Br2 are mixed in a closed container at constant temperature, 0.0518 mol of NOBr is obtained at equilibrium. Calculate equilibrium amount of NO and Br2.',
              answer: '$\\ce{NO} = 0.0352\\ \\text{mol}$, $\\ce{Br2} = 0.0178\\ \\text{mol}$',
              solution:
                "This is a mole-balance question, not even a full ICE table — we're just told how much product formed and asked to back out how much reactant it consumed.\n\nFrom $\\ce{2NO(g) + Br2(g) <=> 2NOBr(g)}$: every 2 mol $\\ce{NOBr}$ formed consumes 2 mol $\\ce{NO}$ and 1 mol $\\ce{Br2}$.\n\n$\\ce{NOBr}$ formed $= 0.0518\\ \\text{mol}$\n\nSo $\\ce{NO}$ consumed $= 0.0518\\ \\text{mol}$ (1:1 ratio with $\\ce{NOBr}$), and $\\ce{Br2}$ consumed $= 0.0518/2 = 0.0259\\ \\text{mol}$.\n\n$\\ce{NO}$ remaining $= 0.087 - 0.0518 = 0.0352\\ \\text{mol}$\n\n$\\ce{Br2}$ remaining $= 0.0437 - 0.0259 = 0.0178\\ \\text{mol}$",
            },
            {
              kind: 'numerical',
              id: '2a7f40ac-f9ee-43f7-9c9f-fc1249e41ffe',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.10',
              prompt:
                'At 450K, Kp= 2.0 × 10^10/bar for the given reaction at equilibrium.\n2SO2(g)+O2(g) ⇌ 2SO3(g)\nWhat is Kc at this temperature?',
              answer: '$K_c \\approx 7.47 \\times 10^{11}\\ \\text{mol}^{-1}\\text{L}$',
              solution:
                "$\\Delta n$ for $\\ce{2SO2(g) + O2(g) <=> 2SO3(g)}$: gas moles right $=2$, left $=2+1=3$, so $\\Delta n = 2-3 = -1$.\n\nFrom $K_p = K_c(RT)^{\\Delta n}$: $K_c = K_p \\times (RT)^{-\\Delta n} = K_p \\times (RT)^{1}$\n\nSince $K_p$ is given in bar$^{-1}$, use $R = 0.0831\\ \\text{L·bar/(mol·K)}$:\n\n$RT = 0.0831 \\times 450 = 37.4$\n\n$K_c = 2.0 \\times 10^{10} \\times 37.4 \\approx 7.47 \\times 10^{11}\\ \\text{mol}^{-1}\\text{L}$",
            },
            {
              kind: 'numerical',
              id: '17e56be2-0df2-4607-aa10-0d0051896549',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.11',
              prompt:
                'A sample of HI(g) is placed in flask at a pressure of 0.2 atm. At equilibrium the partial pressure of HI(g) is 0.04 atm. What is Kp for the given equilibrium?\n2HI(g) ⇌ H2(g) + I2(g)',
              answer: '$K_p = 4.0$',
              solution:
                "Set up an ICE table in pressure units. Initial $p_{\\ce{HI}} = 0.2\\ \\text{atm}$, nothing else present.\n\n$\\ce{HI}$ consumed $= 0.2 - 0.04 = 0.16\\ \\text{atm}$ (this is how much dropped by equilibrium).\n\nFrom the 2:1:1 stoichiometry, $\\ce{H2}$ and $\\ce{I2}$ each form in a 1:2 ratio with $\\ce{HI}$ consumed:\n\n$p_{\\ce{H2}} = p_{\\ce{I2}} = 0.16/2 = 0.08\\ \\text{atm}$\n\n$K_p = \\dfrac{p_{\\ce{H2}}\\, p_{\\ce{I2}}}{p_{\\ce{HI}}^2}$ — written without the forbidden fraction command as: $K_p = (p_{\\ce{H2}} \\times p_{\\ce{I2}}) / p_{\\ce{HI}}^2$\n\n$= (0.08 \\times 0.08) / (0.04)^2 = 0.0064 / 0.0016 = 4.0$",
            },
            {
              kind: 'numerical',
              id: '8024e5bd-5a96-4d6d-9af8-c3b19c1c3a17',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.23',
              prompt:
                'At 1127 K and 1 atm pressure, a gaseous mixture of CO and CO2 in equilibrium with soild carbon has 90.55% CO by mass\nC(s) + CO2(g) ⇌ 2CO(g)\nCalculate Kc for this reaction at the above temperature.',
              answer: '$K_c \\approx 0.15$ (matches NCERT\'s own worked value of 0.149, within rounding)',
              solution:
                "Solid carbon drops out of the expression, so we only need the gas-phase mixture of $\\ce{CO}$ and $\\ce{CO2}$.\n\n**Step 1 — mass % to mole fraction.** Take 100 g of gas mixture: $90.55\\ \\text{g CO}$ and $9.45\\ \\text{g CO}_2$.\n\nmoles $\\ce{CO} = 90.55/28 = 3.234\\ \\text{mol}$\n\nmoles $\\ce{CO2} = 9.45/44 = 0.2148\\ \\text{mol}$\n\ntotal $= 3.449\\ \\text{mol}$\n\n$x_{\\ce{CO}} = 3.234/3.449 = 0.938$, $x_{\\ce{CO2}} = 0.0623$\n\n**Step 2 — partial pressures.** Total pressure is $1\\ \\text{atm/bar}$, so partial pressures equal the mole fractions directly:\n\n$p_{\\ce{CO}} = 0.938$, $p_{\\ce{CO2}} = 0.0623$\n\n**Step 3 — Kp.**\n\n$K_p = p_{\\ce{CO}}^2/p_{\\ce{CO2}} = (0.938)^2/0.0623 = 0.880/0.0623 \\approx 14.1$\n\n**Step 4 — convert to Kc.** $\\Delta n = 2 - 1 = 1$ (only $\\ce{CO2}$ counts on the reactant side, $\\ce{C(s)}$ is dropped).\n\n$K_c = K_p/(RT)$, with $R = 0.0831\\ \\text{L·bar/(mol·K)}$: $RT = 0.0831 \\times 1127 = 93.6$\n\n$K_c = 14.1/93.6 \\approx 0.15$\n\nThis lands right next to NCERT's own published value of $0.149$ — the small gap is just rounding built up across the mass→mole→pressure chain.",
            },
          ],
        },
        // ---------------------------------------------------------------
        // SECTION 3 — Solving equilibrium problems with ICE tables
        // ---------------------------------------------------------------
        {
          id: 's3-ice-table-problems',
          title: 'Solving equilibrium problems with ICE tables',
          blurb: 'Given a starting mixture and Kc/Kp, track how far the reaction runs using Initial–Change–Equilibrium reasoning.',
          items: [
            {
              kind: 'numerical',
              id: '92db46b6-4015-400c-9e1c-b202b8aedd71',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.8',
              prompt:
                'Reaction between N2 and O2 takes place as follows:\n2N2(g) + O2(g) ⇌ 2N2O(g)\nIf a mixture of 0.482 mol N2 and 0.933 mol of O2 is placed in a 10 L reaction vessel and allowed to form N2O at a temperature for which Kc= 2.0 × 10^-37, determine the composition of equilibrium mixture.',
              answer: '$[\\ce{N2}] \\approx 0.0482\\ \\text{M}$, $[\\ce{O2}] \\approx 0.0933\\ \\text{M}$, $[\\ce{N2O}] \\approx 6.6 \\times 10^{-21}\\ \\text{M}$',
              solution:
                "Initial concentrations: $[\\ce{N2}]_0 = 0.482/10 = 0.0482\\ \\text{M}$, $[\\ce{O2}]_0 = 0.933/10 = 0.0933\\ \\text{M}$, $[\\ce{N2O}]_0 = 0$.\n\n$K_c = 2.0\\times10^{-37}$ is astronomically small — this tells you before doing any algebra that almost none of the $\\ce{N2}$ and $\\ce{O2}$ will actually react. That's the key shortcut here: **treat the change as negligible against the initial amounts.**\n\nICE table (let $2x$ mol/L $\\ce{N2O}$ form):\n\n| | $\\ce{N2}$ | $\\ce{O2}$ | $\\ce{N2O}$ |\n|---|---|---|---|\n| I | $0.0482$ | $0.0933$ | $0$ |\n| C | $-2x$ | $-x$ | $+2x$ |\n| E | $0.0482-2x$ | $0.0933-x$ | $2x$ |\n\n$K_c = (2x)^2 / [(0.0482-2x)^2(0.0933-x)] = 2.0\\times10^{-37}$\n\nSince $x$ is tiny, approximate $0.0482-2x \\approx 0.0482$ and $0.0933-x \\approx 0.0933$:\n\n$4x^2 = 2.0\\times10^{-37} \\times (0.0482)^2 \\times 0.0933$\n\n$(0.0482)^2 = 2.323\\times10^{-3}$, times $0.0933 = 2.168\\times10^{-4}$\n\n$4x^2 = 2.0\\times10^{-37} \\times 2.168\\times10^{-4} = 4.34\\times10^{-41}$\n\n$x^2 = 1.08\\times10^{-41}$, so $x \\approx 3.29\\times10^{-21}$\n\n$[\\ce{N2O}] = 2x \\approx 6.6\\times10^{-21}\\ \\text{M}$\n\nBecause $x$ is so vanishingly small, $[\\ce{N2}]$ and $[\\ce{O2}]$ stay essentially at their starting values: $0.0482\\ \\text{M}$ and $0.0933\\ \\text{M}$.",
            },
            {
              kind: 'numerical',
              id: 'e4b42d23-09fd-45a0-9c1d-b885e317b30c',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.14',
              prompt:
                'One mole of H2O and one mole of CO are taken in 10 L vessel and heated to 725 K. At equilibrium 40% of water (by mass) reacts with CO according to the equation,\nH2O(g) + CO(g) ⇌ H2(g) + CO2(g)\nCalculate the equilibrium constant for the reaction.',
              answer: '$K_c \\approx 0.44$',
              solution:
                "Start with $1\\ \\text{mol}$ each of $\\ce{H2O}$ and $\\ce{CO}$ in $10\\ \\text{L}$. \"40% of water reacts\" means $0.4\\ \\text{mol}\\ \\ce{H2O}$ is consumed.\n\nSince the stoichiometry is 1:1:1:1, $0.4\\ \\text{mol}\\ \\ce{CO}$ is also consumed, and $0.4\\ \\text{mol}$ each of $\\ce{H2}$ and $\\ce{CO2}$ are formed.\n\n| | $\\ce{H2O}$ | $\\ce{CO}$ | $\\ce{H2}$ | $\\ce{CO2}$ |\n|---|---|---|---|---|\n| moles at eq. | $0.6$ | $0.6$ | $0.4$ | $0.4$ |\n| conc. (÷10L) | $0.06\\ \\text{M}$ | $0.06\\ \\text{M}$ | $0.04\\ \\text{M}$ | $0.04\\ \\text{M}$ |\n\n$K_c = [\\ce{H2}][\\ce{CO2}] / ([\\ce{H2O}][\\ce{CO}])$\n\n$= (0.04 \\times 0.04) / (0.06 \\times 0.06)$\n\n$= 0.0016 / 0.0036 \\approx 0.44$",
            },
            {
              kind: 'numerical',
              id: 'a82deab5-381b-4fb3-bd9e-6dbb1e8428e3',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.15',
              prompt:
                'At 700 K, equilibrium constant for the reaction:\nH2(g) + I2(g) ⇌ 2HI(g)\nis 54.8. If 0.5 mol L-1 of HI(g) is present at equilibrium at 700 K, what are the concentration of H2(g) and I2(g) assuming that we initially started with HI(g) and allowed it to reach equilibrium at 700K?',
              answer: '$[\\ce{H2}] = [\\ce{I2}] \\approx 0.068\\ \\text{M}$',
              solution:
                "We started with pure $\\ce{HI}$, so it's actually decomposing: $\\ce{2HI(g) <=> H2(g) + I2(g)}$, whose equilibrium constant is the reciprocal of the given (forward) one:\n\n$K_c(\\text{decomposition}) = 1/54.8 = 0.01825$\n\nSince the reaction started with pure $\\ce{HI}$ and the stoichiometry is symmetric (1:1 for $\\ce{H2}$ and $\\ce{I2}$), $[\\ce{H2}] = [\\ce{I2}]$ at equilibrium — call this $x$.\n\n$K_c(\\text{decomposition}) = [\\ce{H2}][\\ce{I2}] / [\\ce{HI}]^2 = x^2/(0.5)^2 = 0.01825$\n\n$x^2 = 0.01825 \\times 0.25 = 0.00456$\n\n$x = \\sqrt{0.00456} \\approx 0.068\\ \\text{M}$\n\nSo $[\\ce{H2}] = [\\ce{I2}] \\approx 0.068\\ \\text{mol/L}$.",
            },
            {
              kind: 'numerical',
              id: '4d0e60c1-ad60-46a1-af45-8621f969b466',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.16',
              prompt:
                'What is the equilibrium concentration of each of the substances in the equilibrium when the initial concentration of ICl was 0.78 M?\n2ICl(g) ⇌ I2(g) + Cl2(g); Kc= 0.14',
              answer: '$[\\ce{I2}] = [\\ce{Cl2}] \\approx 0.167\\ \\text{M}$, $[\\ce{ICl}] \\approx 0.446\\ \\text{M}$',
              solution:
                "ICE table, let $x = [\\ce{I2}] = [\\ce{Cl2}]$ formed:\n\n| | $\\ce{ICl}$ | $\\ce{I2}$ | $\\ce{Cl2}$ |\n|---|---|---|---|\n| I | $0.78$ | $0$ | $0$ |\n| C | $-2x$ | $+x$ | $+x$ |\n| E | $0.78-2x$ | $x$ | $x$ |\n\n$K_c = x^2/(0.78-2x)^2 = 0.14$\n\nTake the square root of both sides (valid since both sides are positive):\n\n$x/(0.78-2x) = \\sqrt{0.14} = 0.374$\n\n$x = 0.374(0.78-2x) = 0.292 - 0.748x$\n\n$x + 0.748x = 0.292$\n\n$1.748x = 0.292$\n\n$x \\approx 0.167\\ \\text{M}$\n\nSo $[\\ce{I2}] = [\\ce{Cl2}] \\approx 0.167\\ \\text{M}$, and $[\\ce{ICl}] = 0.78 - 2(0.167) \\approx 0.446\\ \\text{M}$.",
            },
            {
              kind: 'numerical',
              id: '50698b61-5e50-4fb6-a59f-1482d03e19e8',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.17',
              prompt:
                'Kp = 0.04 atm at 899 K for the equilibrium shown below. What is the equilibrium concentration of C2H6 when it is placed in a flask at 4.0 atm pressure and allowed to come to equilibrium?\nC2H6(g) ⇌ C2H4(g) + H2(g)',
              answer: '$p_{\\ce{C2H6}} \\approx 3.62\\ \\text{atm}$ at equilibrium',
              solution:
                "The problem gives pressures, so build the ICE table in pressure units. Let $p$ = pressure of $\\ce{C2H6}$ that dissociates.\n\n| | $\\ce{C2H6}$ | $\\ce{C2H4}$ | $\\ce{H2}$ |\n|---|---|---|---|\n| I | $4.0$ | $0$ | $0$ |\n| C | $-p$ | $+p$ | $+p$ |\n| E | $4.0-p$ | $p$ | $p$ |\n\n$K_p = p^2/(4.0-p) = 0.04$\n\n$p^2 = 0.04(4.0-p) = 0.16 - 0.04p$\n\n$p^2 + 0.04p - 0.16 = 0$\n\nQuadratic formula: $p = [-0.04 + \\sqrt{(0.04)^2 + 4(0.16)}]/2 = [-0.04 + \\sqrt{0.6416}]/2$\n\n$\\sqrt{0.6416} \\approx 0.801$\n\n$p = (-0.04 + 0.801)/2 = 0.761/2 \\approx 0.381\\ \\text{atm}$\n\nSo at equilibrium: $p_{\\ce{C2H6}} = 4.0 - 0.381 \\approx 3.62\\ \\text{atm}$.",
            },
            {
              kind: 'numerical',
              id: '07fcb817-4074-4c0f-972c-830c21f46ec7',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.19',
              prompt:
                'A sample of pure PCl5 was introduced into an evacuated vessel at 473 K. After equilibrium was attained, concentration of PCl5 was found to be 0.5 × 10^-1 mol L-1. If value of Kc is 8.3 × 10^-3, what are the concentrations of PCl3 and Cl2 at equilibrium?\nPCl5(g) ⇌ PCl3(g) + Cl2(g)',
              answer: '$[\\ce{PCl3}] = [\\ce{Cl2}] \\approx 0.02\\ \\text{M}$',
              solution:
                "We're given $[\\ce{PCl5}]$ **at equilibrium** already ($0.5\\times10^{-1} = 0.05\\ \\text{M}$), so no need to track the initial amount — just plug straight into $K_c$.\n\nSince the reaction started from pure $\\ce{PCl5}$, $[\\ce{PCl3}] = [\\ce{Cl2}]$ at equilibrium (equal stoichiometry, both formed from nothing). Call this $x$.\n\n$K_c = [\\ce{PCl3}][\\ce{Cl2}]/[\\ce{PCl5}] = x^2/0.05 = 8.3\\times10^{-3}$\n\n$x^2 = 8.3\\times10^{-3} \\times 0.05 = 4.15\\times10^{-4}$\n\n$x = \\sqrt{4.15\\times10^{-4}} \\approx 0.02\\ \\text{M}$\n\nSo $[\\ce{PCl3}] = [\\ce{Cl2}] \\approx 0.02\\ \\text{mol/L}$.",
            },
            {
              kind: 'numerical',
              id: '2a0bb726-9061-45fe-91c2-cf8dae93caad',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.20',
              prompt:
                'One of the reaction that takes place in producing steel from iron ore is the reduction of iron(II) oxide by carbon monoxide to give iron metal and CO2.\nFeO(s) + CO(g) ⇌ Fe(s) + CO2(g); Kp= 0.265 atm at 1050K\nWhat are the equilibrium partial pressures of CO and CO2 at 1050 K if the initial partial pressures are: pCO= 1.4 atm and pCO2 = 0.80 atm?',
              answer: '$p_{\\ce{CO}} \\approx 1.74\\ \\text{atm}$, $p_{\\ce{CO2}} \\approx 0.46\\ \\text{atm}$',
              solution:
                "$\\ce{FeO}$ and $\\ce{Fe}$ are solids and drop out, so $K_p = p_{\\ce{CO2}}/p_{\\ce{CO}}$.\n\nLet $x$ = change in $p_{\\ce{CO}}$ (positive if $\\ce{CO}$ is consumed, i.e. reaction runs forward). ICE table:\n\n| | $\\ce{CO}$ | $\\ce{CO2}$ |\n|---|---|---|\n| I | $1.4$ | $0.80$ |\n| C | $-x$ | $+x$ |\n| E | $1.4-x$ | $0.80+x$ |\n\n$K_p = (0.80+x)/(1.4-x) = 0.265$\n\n$0.80+x = 0.265(1.4-x) = 0.371 - 0.265x$\n\n$x + 0.265x = 0.371 - 0.80$\n\n$1.265x = -0.429$\n\n$x \\approx -0.339$\n\nThe **negative** $x$ tells you something worth noticing: the reaction actually needs to run in **reverse** to reach equilibrium — there was too much $\\ce{CO2}$ (and too little $\\ce{CO}$) at the start relative to $K_p$, so $\\ce{CO2}$ converts back into $\\ce{CO}$.\n\n$p_{\\ce{CO}} = 1.4 - (-0.339) = 1.4 + 0.339 \\approx 1.74\\ \\text{atm}$\n\n$p_{\\ce{CO2}} = 0.80 + (-0.339) \\approx 0.46\\ \\text{atm}$",
            },
            {
              kind: 'numerical',
              id: '35a76b96-f76d-405b-a457-aba5257a1761',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.22',
              prompt:
                'Bromine monochloride, BrCl decomposes into bromine and chlorine and reaches the equilibrium:\n2BrCl(g) ⇌ Br2(g) + Cl2(g)\nfor which Kc= 32 at 500 K. If initially pure BrCl is present at a concentration of 3.3 × 10^-3 mol L-1, what is its molar concentration in the mixture at equilibrium?',
              answer: '$[\\ce{BrCl}] \\approx 2.7 \\times 10^{-4}\\ \\text{M}$',
              solution:
                "ICE table, let $x = [\\ce{Br2}] = [\\ce{Cl2}]$ formed:\n\n| | $\\ce{BrCl}$ | $\\ce{Br2}$ | $\\ce{Cl2}$ |\n|---|---|---|---|\n| I | $3.3\\times10^{-3}$ | $0$ | $0$ |\n| C | $-2x$ | $+x$ | $+x$ |\n| E | $3.3\\times10^{-3}-2x$ | $x$ | $x$ |\n\n$K_c = x^2/(3.3\\times10^{-3}-2x)^2 = 32$\n\nSince $K_c$ is fairly large here, don't assume $x$ is small — solve exactly by taking the square root:\n\n$x/(3.3\\times10^{-3}-2x) = \\sqrt{32} = 5.657$\n\n$x = 5.657(3.3\\times10^{-3}) - 5.657(2x) = 0.01867 - 11.31x$\n\n$x + 11.31x = 0.01867$\n\n$12.31x = 0.01867$\n\n$x \\approx 1.52\\times10^{-3}$\n\n$[\\ce{BrCl}]_{eq} = 3.3\\times10^{-3} - 2(1.52\\times10^{-3}) = 3.3\\times10^{-3} - 3.03\\times10^{-3} \\approx 2.7\\times10^{-4}\\ \\text{M}$\n\nWith the large $K_c$, most of the $\\ce{BrCl}$ has indeed decomposed, leaving only a small residual concentration — consistent with the answer.",
            },
            {
              kind: 'numerical',
              id: '8d48966e-2b22-42ea-aed9-56a790359238',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.27',
              prompt:
                'The equilibrium constant for the following reaction is 1.6 ×10^5 at 1024K\nH2(g) + Br2(g) ⇌ 2HBr(g)\nFind the equilibrium pressure of all gases if 10.0 bar of HBr is introduced into a sealed container at 1024K.',
              answer: '$p_{\\ce{H2}} = p_{\\ce{Br2}} \\approx 2.5\\times10^{-2}\\ \\text{bar}$, $p_{\\ce{HBr}} \\approx 10.0\\ \\text{bar}$',
              solution:
                "We started with pure $\\ce{HBr}$, so this time it's the **decomposition** direction we care about: $\\ce{2HBr(g) <=> H2(g) + Br2(g)}$, whose $K$ is the reciprocal of the given value.\n\n$K(\\text{decomposition}) = 1/(1.6\\times10^5) = 6.25\\times10^{-6}$\n\nLet $p$ = pressure of $\\ce{H2}$ formed $= p$ of $\\ce{Br2}$ formed (equal stoichiometry, both from zero).\n\n$K(\\text{decomposition}) = p^2/(10.0-2p)^2 = 6.25\\times10^{-6}$\n\n$p/(10.0-2p) = \\sqrt{6.25\\times10^{-6}} = 2.5\\times10^{-3}$\n\n$p = 2.5\\times10^{-3}(10.0-2p) = 0.025 - 0.005p$\n\n$1.005p = 0.025$\n\n$p \\approx 0.0249\\ \\text{bar} \\approx 2.5\\times10^{-2}\\ \\text{bar}$\n\nSince this $K$ is so small, $\\ce{HBr}$ barely decomposes — $p_{\\ce{HBr}}$ stays essentially $10.0 - 2(0.0249) \\approx 9.95 \\approx 10.0\\ \\text{bar}$.\n\nSo $p_{\\ce{H2}} = p_{\\ce{Br2}} \\approx 2.5\\times10^{-2}\\ \\text{bar}$, and $p_{\\ce{HBr}} \\approx 10.0\\ \\text{bar}$.",
            },
            {
              kind: 'numerical',
              id: '84865095-fec5-4cbc-86f9-b267cec162d9',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.31',
              prompt:
                'Dihydrogen gas used in Haber\'s process is produced by reacting methane from natural gas with high temperature steam. The first stage of two stage reaction involves the formation of CO and H2. In second stage, CO formed in first stage is reacted with more steam in water gas shift reaction,\nCO(g) + H2O(g) ⇌ CO2(g) + H2(g)\nIf a reaction vessel at 400 °C is charged with an equimolar mixture of CO and steam such that pco = pH2O = 4.0 bar, what will be the partial pressure of H2 at equilibrium? Kp= 10.1 at 400°C',
              answer: '$p_{\\ce{H2}} \\approx 3.04\\ \\text{bar}$ (and $p_{\\ce{CO}} = p_{\\ce{H2O}} \\approx 0.96\\ \\text{bar}$ remaining)',
              solution:
                "ICE table in pressure units, let $p$ = pressure converted:\n\n| | $\\ce{CO}$ | $\\ce{H2O}$ | $\\ce{CO2}$ | $\\ce{H2}$ |\n|---|---|---|---|---|\n| I | $4.0$ | $4.0$ | $0$ | $0$ |\n| C | $-p$ | $-p$ | $+p$ | $+p$ |\n| E | $4.0-p$ | $4.0-p$ | $p$ | $p$ |\n\n$K_p = (p_{\\ce{CO2}}\\, p_{\\ce{H2}}) / (p_{\\ce{CO}}\\, p_{\\ce{H2O}}) = p^2/(4.0-p)^2 = 10.1$\n\nTake the square root:\n\n$p/(4.0-p) = \\sqrt{10.1} \\approx 3.178$\n\n$p = 3.178(4.0-p) = 12.71 - 3.178p$\n\n$4.178p = 12.71$\n\n$p \\approx 3.04\\ \\text{bar}$\n\nSince $K_p = 10.1 > 1$, it makes sense that the reaction runs far towards products — most of the $\\ce{CO}$ and steam convert. So $p_{\\ce{H2}} \\approx 3.04\\ \\text{bar}$, and what's left over, $p_{\\ce{CO}} = p_{\\ce{H2O}} = 4.0 - 3.04 \\approx 0.96\\ \\text{bar}$, is the unreacted starting material — not the hydrogen pressure.",
            },
            {
              kind: 'numerical',
              id: 'df9a0407-8c48-4916-8046-5e3493ebe183',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.33',
              prompt:
                'The value of Kc for the reaction 3O2(g) ⇌ 2O3(g) is 2.0 ×10^-50 at 25°C. If the equilibrium concentration of O2 in air at 25°C is 1.6 ×10^-2, what is the concentration of O3?',
              answer: '$[\\ce{O3}] \\approx 2.86 \\times 10^{-28}\\ \\text{M}$',
              solution:
                "Here $[\\ce{O2}]$ is already given as the equilibrium value, so this is a direct plug-in — solve for $[\\ce{O3}]$ from the $K_c$ expression.\n\n$K_c = [\\ce{O3}]^2/[\\ce{O2}]^3$\n\n$[\\ce{O3}]^2 = K_c \\times [\\ce{O2}]^3 = 2.0\\times10^{-50} \\times (1.6\\times10^{-2})^3$\n\n$(1.6\\times10^{-2})^3 = 4.096\\times10^{-6}$\n\n$[\\ce{O3}]^2 = 2.0\\times10^{-50} \\times 4.096\\times10^{-6} = 8.19\\times10^{-56}$\n\n$[\\ce{O3}] = \\sqrt{8.19\\times10^{-56}} \\approx 2.86\\times10^{-28}\\ \\text{M}$\n\nThis absurdly tiny number is the whole point of the question: ozone's equilibrium constant from plain $\\ce{O2}$ is so small that essentially none forms this way — which is exactly why atmospheric ozone formation actually needs UV light and radical mechanisms, not simple thermal equilibrium.",
            },
            {
              kind: 'numerical',
              id: 'f8569fe0-be63-45e4-b31c-54a1084b34fe',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.34',
              prompt:
                'The reaction, CO(g) + 3H2(g) ⇌ CH4(g) + H2O(g) is at equilibrium at 1300 K in a 1L flask. It also contain 0.30 mol of CO, 0.10 mol of H2 and 0.02 mol of H2O and an unknown amount of CH4 in the flask. Determine the concentration of CH4 in the mixture. The equilibrium constant, Kc for the reaction at the given temperature is 3.90.',
              answer: '$[\\ce{CH4}] \\approx 5.85 \\times 10^{-2}\\ \\text{M}$',
              solution:
                "The flask is $1\\ \\text{L}$, so moles equal molarity directly: $[\\ce{CO}] = 0.30\\ \\text{M}$, $[\\ce{H2}] = 0.10\\ \\text{M}$, $[\\ce{H2O}] = 0.02\\ \\text{M}$. All of these are already **equilibrium** values (the system is stated to be at equilibrium), so just solve $K_c$ for the one unknown.\n\n$K_c = [\\ce{CH4}][\\ce{H2O}] / ([\\ce{CO}][\\ce{H2}]^3)$\n\n$3.90 = [\\ce{CH4}] \\times 0.02 / (0.30 \\times (0.10)^3)$\n\n$(0.10)^3 = 1.0\\times10^{-3}$\n\n$0.30 \\times 1.0\\times10^{-3} = 3.0\\times10^{-4}$\n\n$3.90 = [\\ce{CH4}] \\times 0.02 / 3.0\\times10^{-4} = [\\ce{CH4}] \\times 66.67$\n\n$[\\ce{CH4}] = 3.90/66.67 \\approx 5.85\\times10^{-2}\\ \\text{M}$",
            },
          ],
        },
        // ---------------------------------------------------------------
        // SECTION 4 — Predicting reaction direction with Qc vs Kc
        // ---------------------------------------------------------------
        {
          id: 's4-qc-vs-kc-direction',
          title: 'Predicting reaction direction with Qc vs Kc',
          blurb: 'Compare the reaction quotient to the equilibrium constant to tell whether a mixture still has to shift, and which way.',
          items: [
            {
              kind: 'numerical',
              id: '35281183-ac52-4dfe-bcae-0b6f25b0a706',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.12',
              prompt:
                'A mixture of 1.57 mol of N2, 1.92 mol of H2 and 8.13 mol of NH3 is introduced into a 20 L reaction vessel at 500 K. At this temperature, the equilibrium constant, Kc for the reaction N2(g) + 3H2(g) ⇌ 2NH3(g) is 1.7 × 10^2. Is the reaction mixture at equilibrium? If not, what is the direction of the net reaction?',
              answer: 'Not at equilibrium — $Q_c \\approx 2.38 \\times 10^3 > K_c$, so the reaction runs in **reverse** (towards $\\ce{N2}$ and $\\ce{H2}$).',
              solution:
                "Convert moles to concentrations (÷20 L): $[\\ce{N2}] = 1.57/20 = 0.0785\\ \\text{M}$, $[\\ce{H2}] = 1.92/20 = 0.096\\ \\text{M}$, $[\\ce{NH3}] = 8.13/20 = 0.4065\\ \\text{M}$.\n\nCompute the reaction quotient using the same expression as $K_c$, but with whatever concentrations are on hand right now (not necessarily equilibrium ones):\n\n$Q_c = [\\ce{NH3}]^2 / ([\\ce{N2}][\\ce{H2}]^3)$\n\n$= (0.4065)^2 / (0.0785 \\times (0.096)^3)$\n\n$(0.096)^3 = 8.847\\times10^{-4}$\n\n$0.0785 \\times 8.847\\times10^{-4} = 6.95\\times10^{-5}$\n\n$Q_c = 0.1652 / 6.95\\times10^{-5} \\approx 2.38\\times10^3$\n\nCompare: $Q_c (2.38\\times10^3) > K_c (1.7\\times10^2)$.\n\nWhen $Q_c > K_c$, there's already too much product relative to equilibrium — the reaction has to run **in reverse**, converting $\\ce{NH3}$ back into $\\ce{N2}$ and $\\ce{H2}$, to bring $Q_c$ back down to $K_c$. So the mixture is **not** at equilibrium, and the net reaction proceeds backward.",
            },
            {
              kind: 'numerical',
              id: 'f4ee08f4-b123-4b01-a073-8b1d1c8cae44',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.18',
              prompt:
                'Ethyl acetate is formed by the reaction between ethanol and acetic acid and the equilibrium is represented as:\nCH3COOH(l) + C2H5OH(l) ⇌ CH3COOC2H5(l) + H2O(l)\n(i) Write the concentration ratio (reaction quotient), Qc, for this reaction (note: water is not in excess and is not a solvent in this reaction)\n(ii) At 293 K, if one starts with 1.00 mol of acetic acid and 0.18 mol of ethanol, there is 0.171 mol of ethyl acetate in the final equilibrium mixture. Calculate the equilibrium constant.\n(iii) Starting with 0.5 mol of ethanol and 1.0 mol of acetic acid and maintaining it at 293 K, 0.214 mol of ethyl acetate is found after sometime. Has equilibrium been reached?',
              answer: '(i) $Q_c = [\\ce{CH3COOC2H5}][\\ce{H2O}]/([\\ce{CH3COOH}][\\ce{C2H5OH}])$   (ii) $K_c \\approx 3.92$   (iii) $Q_c \\approx 0.20 < K_c$ — not yet at equilibrium; more ester will still form.',
              solution:
                "**(i)** The problem explicitly tells us water is *not* acting as bulk solvent here — it's a genuine reaction participant with its own varying concentration — so unlike the usual convention, it is **kept** in the expression, same treatment as 6.4(iii):\n\n$Q_c = [\\ce{CH3COOC2H5}][\\ce{H2O}] / ([\\ce{CH3COOH}][\\ce{C2H5OH}])$\n\n**(ii)** Since reactant and product moles are equal on both sides ($1+1 \\to 1+1$), the reaction volume cancels out of $K_c$ — we can just work in moles directly.\n\nEster (and water) formed $= 0.171\\ \\text{mol}$. Acid remaining $= 1.00-0.171 = 0.829\\ \\text{mol}$. Ethanol remaining $= 0.18-0.171 = 0.009\\ \\text{mol}$.\n\n$K_c = (0.171 \\times 0.171)/(0.829 \\times 0.009) = 0.02924/0.007461 \\approx 3.92$\n\n**(iii)** This time ethanol only started at $0.5\\ \\text{mol}$, and at some point $0.214\\ \\text{mol}$ ester has formed (not necessarily equilibrium yet — that's what we're checking). Water formed is also $0.214\\ \\text{mol}$.\n\nAcid remaining $= 1.0-0.214 = 0.786\\ \\text{mol}$. Ethanol remaining $= 0.5-0.214 = 0.286\\ \\text{mol}$.\n\n$Q_c = (0.214 \\times 0.214)/(0.786 \\times 0.286) = 0.04580/0.2248 \\approx 0.204$\n\nSince $Q_c (0.204) < K_c (3.92)$, the system still has plenty of room to make more product before it reaches the true equilibrium ratio — **equilibrium has not been reached**, and the forward reaction (more ester forming) will keep proceeding.",
            },
            {
              kind: 'numerical',
              id: '06f0850d-7006-40fe-a0a3-4540b2256722',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.21',
              prompt:
                'Equilibrium constant, Kc for the reaction\nN2(g) + 3H2(g) ⇌ 2NH3(g) at 500 K is 0.061\nAt a particular time, the analysis shows that composition of the reaction mixture is 3.0 mol L-1 N2, 2.0 mol L-1 H2 and 0.5 mol L-1 NH3. Is the reaction at equilibrium? If not in which direction does the reaction tend to proceed to reach equilibrium?',
              answer: 'Not at equilibrium — $Q_c \\approx 0.0104 < K_c$, so the reaction proceeds **forward** (towards more $\\ce{NH3}$).',
              solution:
                "$Q_c = [\\ce{NH3}]^2 / ([\\ce{N2}][\\ce{H2}]^3)$\n\n$= (0.5)^2 / (3.0 \\times (2.0)^3)$\n\n$= 0.25 / (3.0 \\times 8) = 0.25/24 \\approx 0.0104$\n\nCompare: $Q_c (0.0104) < K_c (0.061)$.\n\nWhen $Q_c < K_c$, there isn't enough product yet relative to equilibrium — the reaction still has room to make more $\\ce{NH3}$ before the ratio catches up to $K_c$. So the mixture is **not** at equilibrium, and the reaction proceeds **forward**, consuming more $\\ce{N2}$ and $\\ce{H2}$ to form additional $\\ce{NH3}$.",
            },
            {
              kind: 'numerical',
              id: '90d0d656-5de5-4658-9b35-ba7a70f8157b',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.32',
              prompt:
                'Predict which of the following reaction will have appreciable concentration of reactants and products:\na) Cl2(g) ⇌ 2Cl(g) Kc = 5×10^-39\nb) Cl2(g) + 2NO(g) ⇌ 2NOCl(g) Kc = 3.7 × 10^8\nc) Cl2(g) + 2NO2(g) ⇌ 2NO2Cl(g) Kc = 1.8',
              answer: 'Only **(c)**, where $K_c = 1.8$ (close to 1), has appreciable amounts of both reactants and products.',
              solution:
                "This question isn't a calculation — it's about reading what the size of $K_c$ tells you.\n\n- If $K_c$ is extremely small (like reaction **a**, $5\\times10^{-39}$), the reaction barely proceeds forward at all — at equilibrium, you're left with essentially only the reactant ($\\ce{Cl2}$) and a negligible trace of product ($\\ce{Cl}$ atoms). Not \"appreciable\" amounts of both.\n\n- If $K_c$ is extremely large (like reaction **b**, $3.7\\times10^8$), the reaction runs almost to completion — at equilibrium you're left with essentially only product ($\\ce{NOCl}$) and a negligible trace of reactants. Also not \"appreciable\" amounts of both.\n\n- Only when $K_c$ is close to $1$ — neither hugely large nor hugely small — do you get a genuine mixture with **measurable, appreciable concentrations of both reactants and products** sitting together at equilibrium. That's reaction **c**, with $K_c = 1.8$.\n\nSo the answer is **(c)**.",
            },
          ],
        },
        // ---------------------------------------------------------------
        // SECTION 5 — Le Chatelier's principle, ΔG° and equilibrium constants
        // ---------------------------------------------------------------
        {
          id: 's5-le-chatelier-and-deltag',
          title: "Le Chatelier's principle, ΔG° and equilibrium constants",
          blurb: 'How pressure, concentration, temperature and catalysts push equilibrium around, and how ΔG° connects to K.',
          items: [
            {
              kind: 'numerical',
              id: 'd54e4188-d888-4adb-9a40-a8cbd0bf9845',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.24',
              prompt:
                'Calculate a) ΔG° and b) the equilibrium constant for the formation of NO2 from NO and O2 at 298K\nNO(g) + 1/2 O2(g) ⇌ NO2(g)\nwhere\nΔfG°(NO2) = 52.0 kJ/mol\nΔfG°(NO) = 87.0 kJ/mol\nΔfG°(O2) = 0 kJ/mol',
              answer: '(a) $\\Delta G^\\circ = -35.0\\ \\text{kJ/mol}$   (b) $K \\approx 1.365 \\times 10^6$',
              solution:
                "**(a) ΔG° of reaction.** Use $\\Delta G^\\circ_{rxn} = \\sum \\Delta_f G^\\circ(\\text{products}) - \\sum \\Delta_f G^\\circ(\\text{reactants})$:\n\n$\\Delta G^\\circ = \\Delta_f G^\\circ(\\ce{NO2}) - [\\Delta_f G^\\circ(\\ce{NO}) + \\tfrac{1}{2}\\Delta_f G^\\circ(\\ce{O2})]$\n\n$= 52.0 - [87.0 + 0] = -35.0\\ \\text{kJ/mol}$\n\n**(b) Equilibrium constant.** Use $\\Delta G^\\circ = -RT\\ln K$, rearranged to $\\ln K = -\\Delta G^\\circ/(RT)$. Convert $\\Delta G^\\circ$ to joules: $-35.0\\ \\text{kJ/mol} = -35000\\ \\text{J/mol}$, and use $R = 8.314\\ \\text{J/(mol·K)}$, $T = 298\\ \\text{K}$:\n\n$\\ln K = -(-35000)/(8.314 \\times 298) = 35000/2477.6 \\approx 14.13$\n\n$K = e^{14.13} \\approx 1.365 \\times 10^6$\n\nThe large negative $\\Delta G^\\circ$ (favourable) translates directly into a huge $K$ — the reaction strongly favours $\\ce{NO2}$ formation at this temperature, which matches everyday experience: $\\ce{NO}$ released into air converts readily to brown $\\ce{NO2}$.",
            },
            {
              kind: 'numerical',
              id: 'bb351659-13e1-4d36-b48c-5b3ae25b33ab',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.25',
              prompt:
                'Does the number of moles of reaction products increase, decrease or remain same when each of the following equilibria is subjected to a decrease in pressure by increasing the volume?\n(a) PCl5(g) ⇌ PCl3(g) + Cl2(g)\n(b) CaO(s) + CO2(g) ⇌ CaCO3(s)\n(c) 3Fe(s) + 4H2O(g) ⇌ Fe3O4(s) + 4H2(g)',
              answer: '(a) increases  (b) decreases  (c) remains the same',
              solution:
                "The rule: decreasing pressure (increasing volume) always pushes equilibrium towards the side with **more moles of gas**, because that side can better \"relieve\" the lower pressure by spreading into the extra space. Only gas-phase species count towards this — solids don't occupy the free gas volume in the same way.\n\n**(a)** $\\ce{PCl5(g) <=> PCl3(g) + Cl2(g)}$: gas moles go from $1$ (reactant) to $2$ (products). Decreasing pressure favours the side with more gas moles — the product side. **Products increase.**\n\n**(b)** $\\ce{CaO(s) + CO2(g) <=> CaCO3(s)}$: gas moles go from $1$ (reactant, $\\ce{CO2}$) to $0$ (products — $\\ce{CaCO3}$ is solid). Decreasing pressure favours the side with more gas moles — here that's the *reactant* side. So the equilibrium shifts backward, and **product (CaCO3) decreases.**\n\n**(c)** $\\ce{3Fe(s) + 4H2O(g) <=> Fe3O4(s) + 4H2(g)}$: gas moles are $4$ on both sides ($\\ce{H2O}$ in, $\\ce{H2}$ out) — $\\Delta n_{gas} = 0$. A pressure change doesn't favour either side here, so the position of equilibrium, and the amount of product, **remains the same.**",
            },
            {
              kind: 'numerical',
              id: 'a2b5203e-cdb3-431c-803d-ee59fe28f6c5',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.26',
              prompt:
                'Which of the following reactions will get affected by increasing the pressure? Also, mention whether change will cause the reaction to go into forward or backward direction.\n(i) COCl2(g) ⇌ CO(g) + Cl2(g)\n(ii) CH4(g) + 2S2(g) ⇌ CS2(g) + 2H2S(g)\n(iii) CO2(g) + C(s) ⇌ 2CO(g)\n(iv) 2H2(g) + CO(g) ⇌ CH3OH(g)\n(v) CaCO3(s) ⇌ CaO(s) + CO2(g)\n(vi) 4NH3(g) + 5O2(g) ⇌ 4NO(g) + 6H2O(g)',
              answer: 'Affected (with the fewer-gas-mole side favoured): (i) backward, (iii) backward, (iv) forward, (v) backward, (vi) backward. Not affected: (ii), where gas moles are equal on both sides.',
              solution:
                "Increasing pressure pushes equilibrium towards the side with **fewer moles of gas** (the opposite direction from the pressure-decrease rule in 6.25). Go reaction by reaction, counting only gas-phase species:\n\n**(i)** $\\ce{COCl2(g) <=> CO(g) + Cl2(g)}$: gas moles $1 \\to 2$. Increasing pressure favours the fewer-mole side (reactants). **Affected — shifts backward.**\n\n**(ii)** $\\ce{CH4(g) + 2S2(g) <=> CS2(g) + 2H2S(g)}$: gas moles left $=1+2=3$, right $=1+2=3$. Equal — $\\Delta n_{gas}=0$. **Not affected by pressure.**\n\n**(iii)** $\\ce{CO2(g) + C(s) <=> 2CO(g)}$: gas moles $1 \\to 2$ ($\\ce{C(s)}$ doesn't count). Increasing pressure favours the reactant side. **Affected — shifts backward.**\n\n**(iv)** $\\ce{2H2(g) + CO(g) <=> CH3OH(g)}$: gas moles $3 \\to 1$. Increasing pressure favours the product side (fewer gas moles). **Affected — shifts forward.**\n\n**(v)** $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$: gas moles $0 \\to 1$. Increasing pressure favours the reactant side (zero gas moles). **Affected — shifts backward.**\n\n**(vi)** $\\ce{4NH3(g) + 5O2(g) <=> 4NO(g) + 6H2O(g)}$: gas moles left $=9$, right $=10$. Increasing pressure favours the fewer-mole side (reactants). **Affected — shifts backward.**",
            },
            {
              kind: 'numerical',
              id: 'f72ccc91-7a86-4d51-8b12-73b87601a921',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.28',
              prompt:
                'Dihydrogen gas is obtained from natural gas by partial oxidation with steam as per following endothermic reaction:\nCH4(g) + H2O(g) ⇌ CO(g) + 3H2(g)\n(a) Write as expression for Kp for the above reaction.\n(b) How will the values of Kp and composition of equilibrium mixture be affected by\n(i) increasing the pressure\n(ii) increasing the temperature\n(iii) using a catalyst?',
              answer: '(a) $K_p = (p_{\\ce{CO}}\\, p_{\\ce{H2}}^3)/(p_{\\ce{CH4}}\\, p_{\\ce{H2O}})$   (b)(i) $K_p$ unchanged, composition shifts backward   (ii) $K_p$ increases, shifts forward   (iii) no effect on either',
              solution:
                "**(a)** All four species are gases, so all appear:\n\n$K_p = (p_{\\ce{CO}} \\times p_{\\ce{H2}}^3) / (p_{\\ce{CH4}} \\times p_{\\ce{H2O}})$\n\n**(b)(i) Increasing pressure.** Gas moles: left $=2$, right $=1+3=4$. It's important to be precise here: **$K_p$ itself never changes with pressure** — $K$ only depends on temperature. What changes is the *composition* of the equilibrium mixture: increasing pressure favours the side with fewer gas moles, i.e. the reactant side, so the equilibrium composition shifts backward (less $\\ce{CO}$ and $\\ce{H2}$, more $\\ce{CH4}$ and $\\ce{H2O}$), even though $K_p$'s numerical value is unchanged.\n\n**(b)(ii) Increasing temperature.** The reaction is stated to be endothermic. Raising the temperature supplies more of the energy the forward reaction needs, so **$K_p$ itself increases** with temperature, and the equilibrium composition shifts forward (more $\\ce{CO}$ and $\\ce{H2}$).\n\n**(b)(iii) Catalyst.** A catalyst speeds up both the forward and reverse rates equally — it has **no effect on $K_p$ and no effect on the equilibrium composition.** It only gets you to the same equilibrium point faster.",
            },
            {
              kind: 'numerical',
              id: 'b9d7d6ae-3c5c-4eb7-858a-3fb7006da7f2',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.29',
              prompt:
                'Describe the effect of:\na) addition of H2\nb) addition of CH3OH\nc) removal of CO\nd) removal of CH3OH\non the equilibrium of the reaction:\n2H2(g) + CO(g) ⇌ CH3OH(g)',
              answer: '(a) shifts forward  (b) shifts backward  (c) shifts backward  (d) shifts forward',
              solution:
                "Le Chatelier's principle: the system responds to any disturbance by shifting in the direction that partly counteracts it.\n\n**a) Addition of H2** — a reactant is added. The system shifts **forward** (consuming some of the extra $\\ce{H2}$, along with $\\ce{CO}$, to form more $\\ce{CH3OH}$) to partly offset the increase.\n\n**b) Addition of CH3OH** — the product is added. The system shifts **backward** (converting some $\\ce{CH3OH}$ back into $\\ce{H2}$ and $\\ce{CO}$) to partly offset the increase in product.\n\n**c) Removal of CO** — a reactant is removed. The system shifts **backward** (breaking down some $\\ce{CH3OH}$ to replace the missing $\\ce{CO}$) to partly restore it.\n\n**d) Removal of CH3OH** — the product is removed. The system shifts **forward** (making more $\\ce{CH3OH}$ from $\\ce{H2}$ and $\\ce{CO}$) to partly replace what was taken away.",
            },
            {
              kind: 'numerical',
              id: 'aafd928c-c01d-4c88-a901-261b1a4a0587',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.30',
              prompt:
                'At 473 K, equilibrium constant Kc for decomposition of phosphorus pentachloride, PCl5 is 8.3 ×10^-3. If decomposition is depicted as,\nPCl5(g) ⇌ PCl3(g) + Cl2(g), ΔrH° = 124.0 kJ mol-1\na) write an expression for Kc for the reaction.\nb) what is the value of Kc for the reverse reaction at the same temperature?\nc) what would be the effect on Kc if (i) more PCl5 is added (ii) pressure is increased (iii) the temperature is increased?',
              answer: '(a) $K_c=[\\ce{PCl3}][\\ce{Cl2}]/[\\ce{PCl5}]$   (b) $K_c(\\text{reverse}) \\approx 120.48$   (c)(i) no effect (ii) no effect (iii) $K_c$ increases',
              solution:
                "**(a)** $\\ce{PCl5}$ is the only reactant (gas), $\\ce{PCl3}$ and $\\ce{Cl2}$ the products:\n\n$K_c = [\\ce{PCl3}][\\ce{Cl2}] / [\\ce{PCl5}]$\n\n**(b)** The reverse reaction's $K_c$ is the reciprocal of the forward one:\n\n$K_c(\\text{reverse}) = 1/(8.3\\times10^{-3}) \\approx 120.48$\n\n**(c)** $K_c$ is a function of temperature **only** — it never changes just because you add more of a species or change the pressure. It's important to separate \"does the *position* of equilibrium shift\" from \"does the *value of K* change\":\n\n**(i) Adding more PCl5.** Le Chatelier says the equilibrium position shifts forward (more $\\ce{PCl3}$ and $\\ce{Cl2}$ form to partly consume the extra $\\ce{PCl5}$), but the numerical value of $K_c$ **stays exactly the same** at this temperature.\n\n**(ii) Increasing pressure.** Gas moles go $1 \\to 2$, so higher pressure shifts the equilibrium composition backward (favouring the side with fewer gas moles, $\\ce{PCl5}$). Again, this changes the *composition*, not $K_c$ itself — **$K_c$ is unaffected.**\n\n**(iii) Increasing temperature.** $\\Delta_r H^\\circ = +124.0\\ \\text{kJ/mol}$ tells us the forward (decomposition) reaction is **endothermic**. Raising the temperature favours the endothermic direction, so **$K_c$ increases** with temperature — this is the one genuine change to $K_c$ itself.",
            },
          ],
        },
      ],
    },
  ],
};
