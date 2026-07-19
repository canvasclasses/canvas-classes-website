// Practice — NCERT Exercises: Class 11 Chemistry, Live Book Ch.5 "Thermodynamics"
// Source: NCERT Unit 5 "Thermodynamics", exercises 5.1–5.22 (all 22, verbatim prompts).
// Authored per scripts/chem11-book/_practice/CONTRACT.md — do NOT insert into any database.

module.exports = {
  slug: 'ch5-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 22 NCERT textbook exercises for the chapter, grouped into 4 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: 'f8c741a8-0e7e-46ad-9afc-77dc390be071',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A hand-drawn illustration of thermodynamics ideas — a heat engine, a beaker giving off heat, and rising entropy shown as scattering dots',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'A wide hand-drawn coloured illustration on a deep-charcoal near-black background, muted earthy palette (ochre, terracotta, teal, sage green, indigo, cream), no glow, no neon, no orange haze, no 3D-render look — flat textured illustration style like gouache on dark paper. Scene: a cutaway of a simple thermodynamic "system" — a round-bottomed flask sitting inside a dashed-line boundary representing the system, with small wavy ochre arrows labelled "q" flowing heat in from a small flame beneath it, and a terracotta arrow labelled "w" showing a piston doing work on a gas. To the right, a loose scatter of small sage-green dots inside a box gradually spreading out and becoming more disordered left to right, suggesting rising entropy. A simple hand-lettered curve in cream chalk-like strokes in the background suggesting a Gibbs free energy dip toward a spontaneous, more stable state. Clean, warm, textbook-illustration mood, minimal clutter, no photorealism, no glossy 3D, no bright saturated colours — everything muted and hand-drawn.',
    },
    {
      id: '4daa3e3a-13f8-401b-9bc9-892d24ecdb52',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are all 22 NCERT exercises for this unit, regrouped into four themes so you practise one idea at a time instead of jumping around the textbook's order: first-law basics, enthalpy vs internal energy, Hess's law arithmetic, and spontaneity (entropy + Gibbs energy). Try each question yourself first — cover the solution, work it out on paper, then check. The full working is there so that if you get stuck (or get it wrong), you can see exactly where your reasoning needs to catch up, not just what the final number was.",
    },
    {
      id: 'ca94b4f0-caf8-4054-820a-5dd15f87a912',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 5.1–5.22',
      intro:
        "Every exercise from Unit 5 \"Thermodynamics\", grouped by the idea it's really testing, with a full worked solution for each.",
      sections: [
        {
          id: 'c7ac85ea-d5c8-496f-a38d-5d3c005b6bcc',
          title: 'State functions & the first law',
          blurb: 'What counts as a state function, the sign convention for q and w, and ΔU = q + w.',
          items: [
            {
              kind: 'mcq',
              id: '1f1437d2-94cd-46a0-85ce-a2ab4d681c2f',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.1',
              prompt:
                'Choose the correct answer. A thermodynamic state function is a quantity\n(i) used to determine heat changes\n(ii) whose value is independent of path\n(iii) used to determine pressure volume work\n(iv) whose value depends on temperature only.',
              options: [
                'used to determine heat changes',
                'whose value is independent of path',
                'used to determine pressure volume work',
                'whose value depends on temperature only',
              ],
              correct_index: 1,
              explanation:
                "A **state function** depends only on where the system *is* right now — its current state (temperature, pressure, composition) — never on how it got there. Internal energy $U$, enthalpy $H$, entropy $S$ and Gibbs energy $G$ are all state functions: whether you go straight from state A to state B, or wander through ten intermediate steps, $\\Delta U$, $\\Delta H$, $\\Delta S$ and $\\Delta G$ come out the same. That's exactly option (ii) — 'independent of path.' Heat ($q$) and work ($w$) are the opposite kind of quantity, called path functions: the *same* overall change in a gas can absorb different amounts of heat and do different amounts of work depending on the route you take (think of the free-expansion vs reversible-expansion cases from the chapter), even though $\\Delta U$ is identical either way. So (i) and (iii) describe path functions, not state functions, and (iv) is wrong because a state function's value depends on the *whole* state (T, p, composition), not temperature alone.",
            },
            {
              kind: 'mcq',
              id: '4d71c8cc-af91-419e-a1ce-fcf88a83e7a5',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.2',
              prompt:
                'For the process to occur under adiabatic conditions, the correct condition is:\n(i) ΔT = 0 (ii) Δp = 0 (iii) q = 0 (iv) w = 0',
              options: ['ΔT = 0', 'Δp = 0', 'q = 0', 'w = 0'],
              correct_index: 2,
              explanation:
                "'Adiabatic' literally means *no heat is allowed to pass through the boundary* — the system is thermally insulated from its surroundings. That's a statement about heat transfer, so it translates directly into $q = 0$, option (iii). It says nothing about temperature staying fixed (in fact, in an adiabatic compression the temperature usually *rises*, because all the work done on the gas has nowhere to go except into raising the internal energy), nothing about pressure staying fixed, and nothing about work being zero — an adiabatic process can absolutely involve work (a piston compressing a gas with no heat exchange is the textbook example). Don't confuse adiabatic ($q=0$) with isochoric ($w=0$, constant volume) or isothermal ($\\Delta T = 0$) — three different conditions, three different symbols set to zero.",
            },
            {
              kind: 'numerical',
              id: '0f6e53cb-2661-470a-85b8-ac3e3e3439d0',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.7',
              prompt:
                'In a process, 701 J of heat is absorbed by a system and 394 J of work is done by the system. What is the change in internal energy for the process?',
              answer: 'ΔU = +307 J',
              solution:
                "This is a direct application of the first law, but the whole question is really about getting the *signs* right using the NCERT/IUPAC convention: $q$ is positive when heat is **absorbed by** the system, and $w$ is positive when work is done **on** the system (negative when the system does work on the surroundings).\n\n**Assign signs.**\n- Heat *absorbed by* the system → $q = +701$ J.\n- Work *done by* the system (on the surroundings) → $w = -394$ J.\n\n**Apply the first law.**\n$$\\Delta U = q + w = 701 + (-394) = +307 \\text{ J}$$\n\nThe internal energy increases by $307$ J — makes sense: the system took in $701$ J of heat, spent $394$ J of that pushing on its surroundings, and kept the remaining $307$ J as increased internal energy. **The single most common error on this question type** is writing $w = +394$ J because the number '394' is given as positive in the question — always translate the *English description* ('done by the system') into the *sign convention* first, before plugging into the formula.",
            },
            {
              kind: 'numerical',
              id: 'a9fda0da-1f1c-4dec-98ef-0189f20d3def',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.9',
              prompt:
                'Calculate the number of kJ of heat necessary to raise the temperature of 60.0 g of aluminium from 35°C to 55°C. Molar heat capacity of Al is 24 J mol-1 K-1.',
              answer: 'q ≈ 1.067 kJ',
              solution:
                "Use $q = n C_p \\Delta T$ — molar heat capacity times moles times the temperature change.\n\n**Step 1 — moles of aluminium.** Molar mass of \\ce{Al} $\\approx 27$ g/mol.\n$$n = \\frac{60.0}{27} = 2.222 \\text{ mol}$$\n\n**Step 2 — temperature change.** $\\Delta T = 55 - 35 = 20$ °C $= 20$ K (a *change* in temperature is the same size in °C and K, since the two scales differ only by an additive constant).\n\n**Step 3 — apply the formula.**\n$$q = n C_p \\Delta T = 2.222 \\times 24 \\times 20 = 1066.7 \\text{ J} \\approx 1.067 \\text{ kJ}$$\n\nHeat has to be *supplied* to raise the temperature, so $q$ is positive — consistent with the physical picture (raising temperature always requires absorbing heat, no sign confusion needed here since there's no work term).",
            },
          ],
        },
        {
          id: '82e46861-6d55-4c3c-b326-90f9652d11cb',
          title: 'Enthalpy vs internal energy, phase changes & heat capacity',
          blurb: 'Standard enthalpies of elements, ΔH = ΔU + ΔnRT, and using heat capacities across a phase change.',
          items: [
            {
              kind: 'mcq',
              id: '6b1bf339-09c7-4a91-9236-46146f112595',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.3',
              prompt:
                'The enthalpies of all elements in their standard states are:\n(i) unity (ii) zero (iii) < 0 (iv) different for each element',
              options: ['unity', 'zero', '< 0', 'different for each element'],
              correct_index: 1,
              explanation:
                "This is a *convention*, not a law of nature — chemists needed a common zero point to be able to compare enthalpies of different compounds, so by definition the standard enthalpy of formation of every element in its most stable form at 298 K and 1 bar is taken as **zero**. That's why you'll see $\\Delta_f H^\\circ[\\ce{O2(g)}] = 0$, $\\Delta_f H^\\circ[\\ce{C(graphite)}] = 0$ (graphite, not diamond, since graphite is the more stable allotrope), $\\Delta_f H^\\circ[\\ce{H2(g)}] = 0$, and so on. Every compound's enthalpy of formation is then measured *relative to* this zero baseline — which is exactly why Hess's-law questions like 5.12 and 5.14 later in this set work: you're always taking differences relative to the same reference point, so the absolute zero-point choice cancels out.",
            },
            {
              kind: 'mcq',
              id: '7f2bf374-72b4-457c-be0c-edd2cb76babb',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.4',
              prompt: 'ΔU° of combustion of methane is – X kJ mol-1. The value of ΔH° is\n(i) = ΔU° (ii) > ΔU° (iii) < ΔU° (iv) = 0',
              options: ['= ΔU°', '> ΔU°', '< ΔU°', '= 0'],
              correct_index: 2,
              explanation:
                "Start from $\\Delta H = \\Delta U + \\Delta n_g RT$, where $\\Delta n_g$ is the change in moles of *gas* going from reactants to products. Combustion of methane is $\\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)}$. Count gas moles: reactants have $1 + 2 = 3$ mol of gas, products have only $1$ mol of gas (\\ce{CO2}) since water is liquid. So $\\Delta n_g = 1 - 3 = -2$, a negative number. Since $R$ and $T$ are both positive, $\\Delta n_g RT$ is negative — so $\\Delta H^\\circ = \\Delta U^\\circ + (\\text{a negative number})$, which makes $\\Delta H^\\circ$ *more negative* than $\\Delta U^\\circ$. Given $\\Delta U^\\circ = -X$ kJ/mol, $\\Delta H^\\circ$ is even more negative, i.e. $\\Delta H^\\circ < \\Delta U^\\circ$. That's option (iii). The general rule worth remembering: whenever a reaction *reduces* the number of gas moles (as combustion reactions producing liquid water always do), $\\Delta H$ comes out more negative than $\\Delta U$.",
            },
            {
              kind: 'numerical',
              id: '23bc170f-232c-4ad9-8f70-dc2418c69686',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.8',
              prompt:
                'The reaction of cyanamide, NH2CN(s), with dioxygen was carried out in a bomb calorimeter, and ΔU was found to be –742.7 kJ mol-1 at 298 K. Calculate enthalpy change for the reaction at 298 K.\nNH2CN(g) + 3/2 O2(g) → N2(g) + CO2(g) + H2O(l)',
              answer: 'ΔH° = −743.939 kJ/mol',
              solution:
                "A bomb calorimeter is a constant-*volume* device, so what it directly measures is $\\Delta U$, not $\\Delta H$. To get $\\Delta H$ we need the bridge formula $\\Delta H = \\Delta U + \\Delta n_g RT$.\n\n**Step 1 — find $\\Delta n_g$.** The reaction as given is $\\ce{NH2CN(g) + 3/2 O2(g) -> N2(g) + CO2(g) + H2O(l)}$ — note cyanamide is written as a gas *in this equation* (even though it's a solid at room temperature outside the calorimeter, the equation is what we work from).\nGaseous reactants: $1$ mol \\ce{NH2CN} $+ \\tfrac{3}{2}$ mol \\ce{O2} $= 2.5$ mol. Gaseous products: $1$ mol \\ce{N2} $+ 1$ mol \\ce{CO2} $= 2$ mol (\\ce{H2O} is liquid, so it doesn't count).\n$$\\Delta n_g = 2 - 2.5 = -0.5$$\n\n**Step 2 — apply the formula.** With $R = 8.314 \\times 10^{-3}$ kJ mol⁻¹ K⁻¹ and $T = 298$ K:\n$$\\Delta n_g RT = -0.5 \\times 8.314\\times10^{-3} \\times 298 = -1.239 \\text{ kJ}$$\n$$\\Delta H^\\circ = \\Delta U^\\circ + \\Delta n_g RT = -742.7 + (-1.239) = -743.939 \\text{ kJ mol}^{-1}$$\n\nSo $\\Delta H^\\circ = -743.939$ kJ/mol — very close to $\\Delta U^\\circ$ because $\\Delta n_g$ is small (only half a mole of gas changes), which is typical: the $\\Delta n_g RT$ correction term is usually a small nudge on top of $\\Delta U$, not a big swing. **Watch the sign of $\\Delta n_g$ carefully** — it's gas moles in products *minus* gas moles in reactants; getting that subtraction backwards is the single most common mistake on this kind of question, and it flips the correction from $-1.24$ kJ to $+1.24$ kJ, which would give the wrong final answer.",
            },
            {
              kind: 'numerical',
              id: 'df622f71-ba27-4086-9ad3-d05bb2cf7cf3',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.10',
              prompt:
                'Calculate the enthalpy change on freezing of 1.0 mol of water at10.0°C to ice at –10.0°C. ΔfusH = 6.03 kJ mol-1 at 0°C.\nCp[H2O(l)] = 75.3 J mol-1 K-1\nCp[H2O(s)] = 36.8 J mol-1 K-1',
              answer: 'ΔH ≈ −7.15 kJ/mol',
              solution:
                "Going from liquid water at $10.0°C$ to ice at $-10.0°C$ isn't one step — it's three, and since $H$ is a state function we can add the three enthalpy changes along whatever path is convenient (this is the same Hess's-law logic used everywhere in this chapter).\n\n**Step 1 — cool the liquid from $10.0°C$ to $0°C$.**\n$$\\Delta H_1 = C_p[\\ce{H2O(l)}] \\times \\Delta T = 75.3 \\times (0 - 10.0) = -753 \\text{ J}$$\n\n**Step 2 — freeze the water at $0°C$.** Freezing is the *reverse* of fusion, so it releases exactly what fusion absorbs:\n$$\\Delta H_2 = -\\Delta_{fus}H = -6.03 \\text{ kJ} = -6030 \\text{ J}$$\n\n**Step 3 — cool the ice from $0°C$ to $-10.0°C$.**\n$$\\Delta H_3 = C_p[\\ce{H2O(s)}] \\times \\Delta T = 36.8 \\times (-10.0 - 0) = -368 \\text{ J}$$\n\n**Step 4 — add them up.**\n$$\\Delta H = \\Delta H_1 + \\Delta H_2 + \\Delta H_3 = -753 - 6030 - 368 = -7151 \\text{ J} \\approx -7.15 \\text{ kJ mol}^{-1}$$\n\nEvery term comes out negative, which makes physical sense — cooling releases heat, and freezing releases heat, so the whole trip from warm liquid to cold solid is exothermic overall. **Don't skip the two heat-capacity legs** and just use $\\Delta_{fus}H$ alone — that's the most common shortcut mistake here, and it misses about 16% of the true answer.",
            },
          ],
        },
        {
          id: 'e706aa75-4cc7-4c37-ac95-488401bb8caf',
          title: "Hess's law: formation, combustion & bond enthalpies",
          blurb: 'Building unknown enthalpies out of known ones by adding/reversing reactions — and reading stability off ΔH.',
          items: [
            {
              kind: 'mcq',
              id: '68f68946-b1d5-4bcc-a43e-2d787a8b3a5b',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.5',
              prompt:
                'The enthalpy of combustion of methane, graphite and dihydrogen at 298 K are, –890.3 kJ mol-1 –393.5 kJ mol-1, and –285.8 kJ mol-1 respectively. Enthalpy of formation of CH4(g) will be\n(i) –74.8 kJ mol-1 (ii) –52.27 kJ mol-1 (iii) +74.8 kJ mol-1 (iv) +52.26 kJ mol-1.',
              options: ['–74.8 kJ mol-1', '–52.27 kJ mol-1', '+74.8 kJ mol-1', '+52.26 kJ mol-1'],
              correct_index: 0,
              explanation:
                "We want $\\Delta_f H^\\circ$ for $\\ce{C(graphite) + 2H2(g) -> CH4(g)}$, and we're given three *combustion* enthalpies:\n(1) $\\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)}$, $\\Delta_c H^\\circ = -890.3$ kJ/mol\n(2) $\\ce{C(graphite) + O2(g) -> CO2(g)}$, $\\Delta_c H^\\circ = -393.5$ kJ/mol\n(3) $\\ce{H2(g) + 1/2 O2(g) -> H2O(l)}$, $\\Delta_c H^\\circ = -285.8$ kJ/mol\n\nBuild the target by combining (2) $+ 2\\times$(3) $-$ (1): adding (2) and twice (3) gives $\\ce{C + 2H2 + 2O2 -> CO2 + 2H2O}$; subtracting (reversing) (1) removes the \\ce{CO2} and \\ce{H2O} and the extra $2$ mol $\\ce{O2}$ used for combustion, and adds back $\\ce{CH4}$. Net result is exactly $\\ce{C(graphite) + 2H2(g) -> CH4(g)}$.\n$$\\Delta_f H^\\circ[\\ce{CH4}] = \\Delta_c H^\\circ(2) + 2\\Delta_c H^\\circ(3) - \\Delta_c H^\\circ(1)$$\n$$= -393.5 + 2(-285.8) - (-890.3) = -393.5 - 571.6 + 890.3 = -74.8 \\text{ kJ mol}^{-1}$$\nThat's option (i). This combine-known-combustions-to-get-an-unknown-formation-enthalpy pattern is the exact same trick used in 5.14 later in this set.",
            },
            {
              kind: 'numerical',
              id: 'a4cc6d7e-ac46-4ba9-8048-a6dd9485f77c',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.11',
              prompt:
                'Enthalpy of combustion of carbon to CO2 is –393.5 kJ mol-1. Calculate the heat released upon formation of 35.2 g of CO2 from carbon and dioxygen gas.',
              answer: 'Heat released ≈ 314.8 kJ',
              solution:
                "The enthalpy of combustion, $-393.5$ kJ/mol, is defined *per mole of \\ce{CO2} formed* (one mole of carbon burns to give exactly one mole of \\ce{CO2}), so the calculation is just a mole conversion followed by scaling.\n\n**Step 1 — moles of \\ce{CO2}.** Molar mass of \\ce{CO2} $= 12 + 2(16) = 44$ g/mol.\n$$n(\\ce{CO2}) = \\frac{35.2}{44} = 0.8 \\text{ mol}$$\n\n**Step 2 — scale the enthalpy.**\n$$\\Delta H = 0.8 \\times (-393.5) = -314.8 \\text{ kJ}$$\n\nThe negative sign tells you the reaction releases energy (it's a combustion, so that's expected); the *heat released* is therefore **314.8 kJ**. Always check the mole ratio in the combustion equation before scaling — here it's 1:1 between carbon burned and \\ce{CO2} formed, which is what makes the scaling this direct.",
            },
            {
              kind: 'numerical',
              id: 'bbf9d87c-9cf5-4b98-a5c9-53d5b2d18b7e',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.12',
              prompt:
                'Enthalpies of formation of CO(g), CO2(g), N2O(g) and N2O4(g) are –110, –393, 81 and 9.7 kJ mol-1 respectively. Find the value of ΔrH for the reaction:\nN2O4(g) + 3CO(g) → N2O(g) + 3CO2(g)',
              answer: 'ΔrH ≈ −777.7 kJ',
              solution:
                "When you're given formation enthalpies for every species in a reaction, you never need to hunt for a clever combination of equations — Hess's law collapses to one formula:\n$$\\Delta_r H^\\circ = \\sum \\Delta_f H^\\circ(\\text{products}) - \\sum \\Delta_f H^\\circ(\\text{reactants})$$\n\n**Products:** $1$ mol \\ce{N2O} ($81$ kJ/mol) $+ 3$ mol \\ce{CO2} ($-393$ kJ/mol each)\n$$= 81 + 3(-393) = 81 - 1179 = -1098 \\text{ kJ}$$\n\n**Reactants:** $1$ mol \\ce{N2O4} ($9.7$ kJ/mol) $+ 3$ mol \\ce{CO} ($-110$ kJ/mol each)\n$$= 9.7 + 3(-110) = 9.7 - 330 = -320.3 \\text{ kJ}$$\n\n**Combine:**\n$$\\Delta_r H^\\circ = -1098 - (-320.3) = -1098 + 320.3 = -777.7 \\text{ kJ} \\approx -778 \\text{ kJ}$$\n\nThe reaction is strongly exothermic. Notice that \\ce{N2} and \\ce{O2} themselves never appear — you don't need them, because the formation-enthalpy formula already has every element's reference enthalpy baked in as zero (that's exactly what 5.3 was testing).",
            },
            {
              kind: 'numerical',
              id: '82921279-21c0-44eb-8f0d-1fd2c8774b44',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.13',
              prompt:
                'Given\nN2(g) + 3H2(g) → 2NH3(g); ΔrH° = –92.4 kJ mol-1\nWhat is the standard enthalpy of formation of NH3 gas?',
              answer: 'ΔfH°[NH3] = −46.2 kJ/mol',
              solution:
                "$\\Delta_r H^\\circ = -92.4$ kJ/mol is the enthalpy change for the reaction *as written* — producing **2 mol** of \\ce{NH3}. But 'enthalpy of formation' is always defined *per mole of the compound formed from its elements*, so we simply divide by 2 to get the per-mole value.\n$$\\Delta_f H^\\circ[\\ce{NH3}] = \\frac{\\Delta_r H^\\circ}{2} = \\frac{-92.4}{2} = -46.2 \\text{ kJ mol}^{-1}$$\nThe reaction as given already matches the formation-reaction template exactly — $\\ce{N2(g)}$ and $\\ce{H2(g)}$ are elements in their standard states combining to give the compound — so all that was needed was scaling to 'per mole of product,' not any Hess's-law combining. This is the mistake to watch for: students often forget the reaction makes *two* moles of ammonia and quote $-92.4$ kJ/mol as the formation enthalpy directly.",
            },
            {
              kind: 'numerical',
              id: '5547da8d-ee97-42d4-a2bd-66e93422fd72',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.14',
              prompt:
                'Calculate the standard enthalpy of formation of CH3OH(l) from the following data:\nCH3OH(l) + 3/2 O2(g) → CO2(g) + 2H2O(l); ΔrH° = –726 kJ mol-1\nC(graphite) + O2(g) → CO2(g); ΔcH° = –393 kJ mol-1\nH2(g) + 1/2 O2(g) → H2O(l); ΔfH° = –286 kJ mol-1.',
              answer: 'ΔfH°[CH3OH(l)] = −239 kJ/mol',
              solution:
                "The target reaction we want is the formation of methanol from its elements: $\\ce{C(graphite) + 2H2(g) + 1/2 O2(g) -> CH3OH(l)}$. Label the three given equations (1), (2), (3) in the order given.\n\n**Build the target** as (2) $+\\ 2\\times$(3) $-$ (1):\n- (2) gives $\\ce{C + O2 -> CO2}$\n- $2\\times$(3) gives $\\ce{2H2 + O2 -> 2H2O}$\n- Adding those two: $\\ce{C + 2H2 + 2O2 -> CO2 + 2H2O}$\n- Now reverse (1) (flip products and reactants, flip the sign of $\\Delta H$): $\\ce{CO2 + 2H2O -> CH3OH + 3/2 O2}$\n- Adding that in cancels the \\ce{CO2} and \\ce{2H2O} on both sides and removes $\\tfrac{3}{2}$ mol of the $2$ mol \\ce{O2}, leaving exactly $\\ce{C + 2H2 + 1/2 O2 -> CH3OH}$ — the target.\n\n**Add the enthalpies with the same signs:**\n$$\\Delta_f H^\\circ[\\ce{CH3OH}] = \\Delta H(2) + 2\\Delta H(3) - \\Delta H(1)$$\n$$= (-393) + 2(-286) - (-726) = -393 - 572 + 726 = -239 \\text{ kJ mol}^{-1}$$\n\n**A different angle — spot the pattern instead of formally solving equations:** methanol combustion (1) *consumes* the very \\ce{CO2} and \\ce{H2O} that carbon-combustion (2) and hydrogen-combustion (3) *produce*. So reversing (1) and adding it to (2)+2×(3) is really just 'undoing' the combustion of methanol using the combustion data for its elements — a pattern you'll meet again in 5.5 and any Hess's-law question that gives you combustion data to find a formation enthalpy.",
            },
            {
              kind: 'numerical',
              id: 'd6b3ac6d-701d-4e5c-aba8-1fc29cd73386',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.15',
              prompt:
                'Calculate the enthalpy change for the process\nCCl4(g) → C(g) + 4 Cl(g)\nand calculate bond enthalpy of C–Cl in CCl4(g).\nΔvapH°(CCl4) = 30.5 kJ mol-1.\nΔfH°(CCl4) = –135.5 kJ mol-1.\nΔaH°(C) = 715.0 kJ mol-1, where ΔaH° is enthalpy of atomisation\nΔaH°(Cl2) = 242 kJ mol-1',
              answer: 'ΔH ≈ +1304 kJ/mol; bond enthalpy of C–Cl ≈ 326 kJ/mol',
              solution:
                "We need to atomise \\ce{CCl4(g)} completely into gaseous atoms: $\\ce{CCl4(g) -> C(g) + 4Cl(g)}$. Build this as a Hess's-law cycle out of the four given pieces of data.\n\n**Set up the cycle.** Starting from the elements (graphite + \\ce{Cl2} gas), there are two routes to $\\ce{C(g) + 4Cl(g)}$:\n- **Route A (direct atomisation):** $\\ce{C(graphite) -> C(g)}$, $\\Delta_a H^\\circ(\\ce{C}) = 715.0$ kJ/mol, plus $\\ce{2Cl2(g) -> 4Cl(g)}$, which needs *two* lots of $\\Delta_a H^\\circ(\\ce{Cl2}) = 242$ kJ/mol.\n- **Route B (via \\ce{CCl4}):** first form liquid \\ce{CCl4} from the elements, $\\ce{C(graphite) + 2Cl2(g) -> CCl4(l)}$, $\\Delta_f H^\\circ = -135.5$ kJ/mol; then vaporise it, $\\ce{CCl4(l) -> CCl4(g)}$, $\\Delta_{vap} H^\\circ = 30.5$ kJ/mol; then atomise the gas, $\\ce{CCl4(g) -> C(g) + 4Cl(g)}$, which is the $\\Delta H$ we want.\n\nBoth routes start and end at the same place, so they're equal:\n$$\\Delta_a H^\\circ(\\ce{C}) + 2\\Delta_a H^\\circ(\\ce{Cl2}) = \\Delta_f H^\\circ(\\ce{CCl4}) + \\Delta_{vap}H^\\circ(\\ce{CCl4}) + \\Delta H(\\ce{CCl4(g)->C(g)+4Cl(g)})$$\n\n**Solve for the unknown:**\n$$\\Delta H = \\Delta_a H^\\circ(\\ce{C}) + 2\\Delta_a H^\\circ(\\ce{Cl2}) - \\Delta_f H^\\circ(\\ce{CCl4}) - \\Delta_{vap}H^\\circ(\\ce{CCl4})$$\n$$= 715.0 + 2(242) - (-135.5) - 30.5 = 715.0 + 484 + 135.5 - 30.5 = 1304 \\text{ kJ mol}^{-1}$$\n\n**Get the bond enthalpy.** This $1304$ kJ is the energy to break *all four* C–Cl bonds in one mole of \\ce{CCl4(g)}, so the average bond enthalpy of a single C–Cl bond is\n$$\\text{Bond enthalpy (C–Cl)} = \\frac{1304}{4} = 326 \\text{ kJ mol}^{-1}$$\n\n**Where students get stuck:** forgetting the factor of $2$ on $\\Delta_a H^\\circ(\\ce{Cl2})$ (you need $4$ Cl atoms, and each \\ce{Cl2} atomises to only $2$), or forgetting to divide the final $1304$ kJ by $4$ to get the *per-bond* enthalpy — the question asks for both the reaction enthalpy (1304 kJ/mol) and the bond enthalpy (326 kJ/mol), and they're easy to mix up as 'the answer.'",
            },
            {
              kind: 'numerical',
              id: '9d2a7841-da30-47cd-8d57-57b7768d2381',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.21',
              prompt:
                'Comment on the thermodynamic stability of NO(g), given\n1/2 N2(g) + 1/2 O2(g) → NO(g); ΔrH° = 90 kJ mol-1\nNO(g) + 1/2 O2(g) → NO2(g): ΔrH° = –74 kJ mol-1',
              answer: 'NO is thermodynamically unstable relative to N2 + O2, and reacts further to the more stable NO2.',
              solution:
                "Read stability straight off the sign and size of the formation enthalpy.\n\n**Is \\ce{NO} itself stable?** The first equation *is* the formation reaction for \\ce{NO}: $\\Delta_f H^\\circ[\\ce{NO}] = +90$ kJ/mol. A **positive** formation enthalpy means forming \\ce{NO} from \\ce{N2} and \\ce{O2} *absorbs* a large amount of energy — \\ce{NO} sits at higher energy than the elements it came from. That makes \\ce{NO} thermodynamically **unstable** relative to \\ce{N2(g)} and \\ce{O2(g)}: given the chance, it would rather fall back apart (or react further) than stay as \\ce{NO}, because that releases energy.\n\n**What does it fall toward?** The second equation shows \\ce{NO} reacting further with more \\ce{O2} to give \\ce{NO2}, releasing $74$ kJ/mol — strongly exothermic and therefore energetically favourable. So \\ce{NO} doesn't just sit there being unstable; it has a real, energetically downhill path available (oxidation to \\ce{NO2}).\n\n**Combine to find $\\Delta_f H^\\circ[\\ce{NO2}]$** (by Hess's law, adding the two given equations):\n$$\\Delta_f H^\\circ[\\ce{NO2}] = 90 + (-74) = +16 \\text{ kJ mol}^{-1}$$\nStill positive — so \\ce{NO2} is *also* higher in energy than \\ce{N2} and \\ce{O2} and is not perfectly stable either — but $+16$ kJ/mol is much closer to zero than \\ce{NO}'s $+90$ kJ/mol, meaning \\ce{NO2} is considerably more stable than \\ce{NO}.\n\n**Bottom line, in your own words for the exam:** \\ce{NO(g)} is thermodynamically unstable — its formation from the elements is strongly endothermic — and it has a strongly exothermic pathway to \\ce{NO2}, which is itself only mildly endothermic to form and therefore much more stable than \\ce{NO}. This is *why* \\ce{NO} released into air converts to \\ce{NO2} readily (this exact pair of reactions is the classic story of vehicle-exhaust \\ce{NO} becoming the brown \\ce{NO2} you see in smog).",
            },
          ],
        },
        {
          id: '811522c6-0874-4eb9-a1ab-eff527b25926',
          title: 'Entropy, Gibbs energy & spontaneity',
          blurb: 'Reading spontaneity off ΔS and ΔG, the ΔG = ΔH − TΔS balance, and ΔG° = −RT ln K.',
          items: [
            {
              kind: 'mcq',
              id: '3aa5ed75-e3ee-4432-bc7e-9704d421ae12',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.6',
              prompt:
                'A reaction, A + B → C + D + q is found to have a positive entropy change. The reaction will be\n(i) possible at high temperature (ii) possible only at low temperature (iii) not possible at any temperature (iv) possible at any temperature',
              options: [
                'possible at high temperature',
                'possible only at low temperature',
                'not possible at any temperature',
                'possible at any temperature',
              ],
              correct_index: 3,
              explanation:
                "Read the reaction carefully: '$\\ce{A + B -> C + D} + q$' means heat $q$ is a *product* — the reaction releases heat, so it's **exothermic**, $\\Delta H < 0$. We're also told the entropy change is **positive**, $\\Delta S > 0$. Now check $\\Delta G = \\Delta H - T\\Delta S$: with $\\Delta H$ negative and $-T\\Delta S$ also negative (since $\\Delta S > 0$ and $T > 0$, so $T\\Delta S > 0$ and $-T\\Delta S < 0$), *every term* in $\\Delta G$ is negative, at *any* positive temperature $T$. So $\\Delta G < 0$ always — the reaction is spontaneous no matter how hot or cold the surroundings are. That's the one combination of signs (exothermic + entropy-increasing) where temperature can never flip the answer, which is exactly option (iv). Contrast this with 5.17, where $\\Delta H$ and $\\Delta S$ are both positive — there, spontaneity genuinely depends on temperature.",
            },
            {
              kind: 'numerical',
              id: '9121557f-d4ca-4761-8461-4616d955d44b',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.16',
              prompt: 'For an isolated system, ΔU = 0, what will be ΔS?',
              answer: 'ΔS > 0 (for any spontaneous change)',
              solution:
                "An **isolated system** exchanges neither matter nor energy with its surroundings — that's exactly why $\\Delta U = 0$ is given as a fact about it, not something we need to calculate. The question is really testing the second law of thermodynamics directly: for any spontaneous process happening *inside* an isolated system, the total entropy of the system must increase.\n$$\\Delta S > 0$$\nThis is essentially the modern statement of the second law: in an isolated system, natural (spontaneous) processes always move toward greater disorder, and entropy can never decrease. It's worth noticing this connects to the Gibbs-energy criterion you use for non-isolated systems — $\\Delta G < 0$ for spontaneity at constant $T$, $p$ — because $\\Delta G = \\Delta H - T\\Delta S$ is really just the isolated-system entropy criterion rewritten for the more common lab situation where the system *can* exchange heat with surroundings at constant temperature and pressure.",
            },
            {
              kind: 'numerical',
              id: '1d1d80b6-20d4-420b-ada1-b5de0155a812',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.17',
              prompt:
                'For the reaction at 298 K,\n2A + B → C\nΔH = 400 kJ mol-1 and ΔS = 0.2 kJ K-1 mol-1\nAt what temperature will the reaction become spontaneous considering ΔH and ΔS to be constant over the temperature range.',
              answer: 'T > 2000 K',
              solution:
                "Both $\\Delta H$ and $\\Delta S$ are **positive** here — an endothermic reaction that increases disorder. That's the one case (opposite of 5.6) where the outcome genuinely depends on temperature: at low $T$ the $\\Delta H$ term dominates and $\\Delta G$ is positive (non-spontaneous), but at high enough $T$ the $-T\\Delta S$ term takes over and $\\Delta G$ turns negative.\n\n**Find the crossover temperature.** The reaction becomes spontaneous exactly when $\\Delta G = 0$ — the boundary between non-spontaneous and spontaneous.\n$$\\Delta G = \\Delta H - T\\Delta S = 0 \\implies T = \\frac{\\Delta H}{\\Delta S}$$\n$$T = \\frac{400}{0.2} = 2000 \\text{ K}$$\n\n**Interpret it.** Below $2000$ K, $\\Delta G > 0$ and the reaction won't run on its own. Above $2000$ K, $T\\Delta S$ exceeds $\\Delta H$, so $\\Delta G < 0$ and the reaction becomes spontaneous. So the answer is: the reaction becomes spontaneous once $T > 2000$ K (assuming, as the question tells us to, that $\\Delta H$ and $\\Delta S$ don't themselves change with temperature — in reality they drift slightly, but NCERT wants you to treat them as constants here).",
            },
            {
              kind: 'numerical',
              id: 'bdeda917-5d2f-4527-9e71-8ae30e9b4356',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.18',
              prompt: 'For the reaction,\n2 Cl(g) → Cl2(g), what are the signs of ΔH and ΔS?',
              answer: 'ΔH is negative; ΔS is negative.',
              solution:
                "Think about what's physically happening rather than reaching for a formula.\n\n**Sign of $\\Delta H$.** Two separate chlorine *atoms* are combining to form a \\ce{Cl2} *molecule* — that means a new covalent bond (Cl–Cl) is forming. Forming a bond always **releases** energy (breaking a bond costs energy; forming one gives it back), so this process is exothermic: $\\Delta H < 0$.\n\n**Sign of $\\Delta S$.** On the left, you have $2$ mol of independent gas atoms, each free to move around on its own — lots of positional freedom, high disorder. On the right, those two atoms are now locked together as $1$ mol of \\ce{Cl2} molecules, moving as a single unit — fewer independent particles, less positional freedom. Going from $2$ mol of gas particles to $1$ mol of gas particles is a decrease in disorder, so $\\Delta S < 0$.\n\nSo both signs are negative — which, by the same $\\Delta G = \\Delta H - T\\Delta S$ logic as 5.17, means this reaction is spontaneous only at low enough temperature (favoured by $\\Delta H$, opposed by $-T\\Delta S$), which matches the everyday fact that \\ce{Cl2} exists as a stable diatomic gas at ordinary temperatures rather than spontaneously dissociating into atoms.",
            },
            {
              kind: 'numerical',
              id: '444bd636-eed9-46ac-9f76-0ca4ffa5dbda',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.19',
              prompt:
                'For the reaction\n2 A(g) + B(g) → 2D(g)\nΔU° = –10.5 kJ and ΔS° = –44.1 JK-1.\nCalculate ΔG° for the reaction, and predict whether the reaction may occur spontaneously.',
              answer: 'ΔG° ≈ +0.164 kJ; not spontaneous.',
              solution:
                "We're given $\\Delta U^\\circ$, not $\\Delta H^\\circ$, so this is a two-stage calculation: first convert $\\Delta U^\\circ \\to \\Delta H^\\circ$ (like in 5.8), then use $\\Delta G^\\circ = \\Delta H^\\circ - T\\Delta S^\\circ$ (assume standard conditions, $T = 298$ K, since none is stated).\n\n**Step 1 — find $\\Delta n_g$.** $\\ce{2A(g) + B(g) -> 2D(g)}$: gas moles go from $2+1=3$ (reactants) to $2$ (products).\n$$\\Delta n_g = 2 - 3 = -1$$\n\n**Step 2 — convert to $\\Delta H^\\circ$.**\n$$\\Delta H^\\circ = \\Delta U^\\circ + \\Delta n_g RT = -10.5 + (-1)(8.314\\times10^{-3})(298) = -10.5 - 2.478 = -12.978 \\text{ kJ}$$\n\n**Step 3 — apply $\\Delta G^\\circ = \\Delta H^\\circ - T\\Delta S^\\circ$.** Convert $\\Delta S^\\circ = -44.1$ J/K $= -0.0441$ kJ/K first.\n$$T\\Delta S^\\circ = 298 \\times (-0.0441) = -13.14 \\text{ kJ}$$\n$$\\Delta G^\\circ = -12.978 - (-13.14) = -12.978 + 13.14 = +0.164 \\text{ kJ}$$\n\n**Interpret.** $\\Delta G^\\circ$ comes out **positive** (barely — just $0.164$ kJ, a whisker above zero), so under standard conditions the reaction is **not spontaneous**. Notice how close the two competing terms are ($-12.978$ vs $+13.14$) — this reaction sits almost exactly on the spontaneous/non-spontaneous boundary, which is a good reminder that spontaneity isn't about how 'big' a driving force looks, only about which side of zero $\\Delta G$ lands on.",
            },
            {
              kind: 'numerical',
              id: '8a0cffc0-f000-4c2a-ade5-b37b14f97037',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.20',
              prompt: 'The equilibrium constant for a reaction is 10. What will be the value of ΔG°? R = 8.314 JK-1 mol-1, T = 300 K.',
              answer: 'ΔG° ≈ −5.74 kJ/mol',
              solution:
                "This is the direct link between thermodynamics and equilibrium: $\\Delta G^\\circ = -RT\\ln K$.\n\n**Plug in the values.**\n$$\\Delta G^\\circ = -(8.314)(300)\\ln(10)$$\n$$\\ln(10) = 2.3026$$\n$$\\Delta G^\\circ = -(8.314 \\times 300 \\times 2.3026) = -(2494.2 \\times 2.3026) = -5744.4 \\text{ J} \\approx -5.744 \\text{ kJ mol}^{-1}$$\n\n**Sanity check the sign without a calculator.** $K = 10 > 1$ means products are favoured at equilibrium, so the reaction should have $\\Delta G^\\circ < 0$ (spontaneous in the forward direction under standard conditions) — and indeed we got a negative number. This is a handy shortcut for exam MCQs: $K > 1 \\Rightarrow \\Delta G^\\circ < 0$; $K < 1 \\Rightarrow \\Delta G^\\circ > 0$; $K = 1 \\Rightarrow \\Delta G^\\circ = 0$ exactly — you can predict the sign before doing any arithmetic, then use the calculation just to get the magnitude.",
            },
            {
              kind: 'numerical',
              id: '4205fbca-b95b-4719-aae3-c9738932efc3',
              source: 'ncert_exercise',
              source_label: 'NCERT 5.22',
              prompt:
                'Calculate the entropy change in surroundings when 1.00 mol of H2O(l) is formed under standard conditions. ΔfH° = –286 kJ mol-1.',
              answer: 'ΔSsurr ≈ +959.7 J/K',
              solution:
                "This question is about the **surroundings**, not the system — a different entropy calculation from anything else in this set, so it needs its own formula: $\\Delta S_{surr} = \\dfrac{-\\Delta H_{sys}}{T}$ (heat lost by the system is heat gained by the surroundings, and gaining heat increases the surroundings' entropy).\n\n**Step 1 — heat released to the surroundings.** The system's enthalpy change is $\\Delta H_{sys} = -286$ kJ/mol (exothermic — formation of liquid water from \\ce{H2} and \\ce{O2} releases energy). By energy conservation, the surroundings *absorb* exactly that much heat:\n$$q_{surr} = -\\Delta H_{sys} = -(-286) = +286 \\text{ kJ mol}^{-1} = 286000 \\text{ J mol}^{-1}$$\n\n**Step 2 — convert heat gained into entropy gained.** Under standard conditions, $T = 298$ K:\n$$\\Delta S_{surr} = \\frac{q_{surr}}{T} = \\frac{286000}{298} = 959.7 \\text{ J K}^{-1} \\text{ mol}^{-1}$$\n\nThe surroundings' entropy increases substantially — which makes sense, since a large exothermic reaction dumps a lot of heat outward, and 'heat dumped into a large reservoir' is exactly what raises surroundings entropy. **Where this trips people up:** using $\\Delta H_{sys}$ directly instead of $-\\Delta H_{sys}$ — the system losing heat is the surroundings *gaining* heat, so the sign has to flip when you switch which side of the boundary you're describing.",
            },
          ],
        },
      ],
    },
  ],
};
