module.exports = {
  slug: 'ch1-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle: 'All 36 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: 'bc521306-9799-484d-8f34-61c5bc214c72',
      type: 'image',
      order: 0,
      src: '',
      alt: 'A hand-drawn illustration of a balance scale, a measuring cylinder, and a mole of particles swirling around a beaker, on a dark charcoal background',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'Hand-drawn coloured illustration, deep-charcoal near-black background, muted earthy palette (ochre, terracotta, teal, sage green, indigo, cream), no glow or neon or orange-haze, no 3D-render look, flat textured brush strokes like a chemistry teacher\'s notebook sketch. Scene: a simple two-pan balance scale on the left in ochre and cream, a graduated measuring cylinder with teal liquid in the centre, and on the right a loose cluster of small dots and hexagon-like molecule shapes (representing atoms/molecules) swirling out of an open beaker, connected by faint dotted lines suggesting counting and ratios. A few clean hand-lettered small labels like "mol", "g", "L" scattered subtly near the objects. Wide horizontal banner composition, calm and studious mood, no text/title, no glow effects.',
    },
    {
      id: 'eb321ad2-8ce6-45af-8859-988653942ddf',
      type: 'text',
      order: 1,
      markdown:
        "You've read the chapter — now drill it. Below are all 36 NCERT exercises for this unit, regrouped from the textbook's running order into five revision themes: measurement and significant figures, the mole concept, percentage composition and formulas, stoichiometry, and concentration units. Work through a theme at a time, try the question yourself before reading the solution, and use the one-line answer to check yourself fast.",
    },
    {
      id: '40b39d05-13e7-41b9-a5ae-551733d6911a',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 1.1–1.36',
      intro:
        "Same numbering as your textbook (Unit 1), just reorganised so related ideas sit together. Every solution is worked out in full — don't just read the final number, follow how it was reached.",
      sections: [
        {
          id: '84507e11-492c-4cc9-8bf3-81698332f894',
          title: 'Measurement, units & significant figures',
          blurb: 'SI units, scientific notation, rounding, and unit conversions — the language every calculation in this chapter is written in.',
          items: [
            {
              kind: 'numerical',
              id: '07383ad2-c4dd-4a9e-9343-27783ba1f155',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.13',
              prompt:
                'Pressure is determined as force per unit area of the surface. The SI unit of pressure, pascal is as shown below:\n1Pa = 1N m-2\nIf mass of air at sea level is 1034 g cm-2, calculate the pressure in pascal.',
              answer: 'P ≈ 1.01 × 10⁵ Pa',
              solution:
                "**Set up what 'mass per area' means physically.** We're told that a column of air pressing down on every $1\\ \\text{cm}^2$ of sea-level surface weighs $1034\\ \\text{g}$. Pressure is force per area, and force here is the weight of that air, $F = mg$. So first turn the given mass-per-area into SI units (kg and m²), then bring in $g$.\n\n**Convert the mass-per-area to kg/m².**\n$1034\\ \\text{g cm}^{-2} = 1034 \\times 10^{-3}\\ \\text{kg} \\ / \\ 10^{-4}\\ \\text{m}^2 = 1034 \\times 10\\ \\text{kg m}^{-2} = 1.034\\times 10^{4}\\ \\text{kg m}^{-2}$\n\n**Bring in gravity to turn mass-per-area into force-per-area (pressure).** Take $g = 9.8\\ \\text{m s}^{-2}$:\n$P = (1.034\\times 10^{4}\\ \\text{kg m}^{-2}) \\times (9.8\\ \\text{m s}^{-2}) = 1.013\\times 10^{5}\\ \\text{kg m}^{-1}\\text{s}^{-2}$\n\nAnd $1\\ \\text{kg m}^{-1}\\text{s}^{-2} = 1\\ \\text{N m}^{-2} = 1\\ \\text{Pa}$, so:\n$P \\approx 1.01\\times 10^{5}\\ \\text{Pa}$\n\n**Where students get stuck:** forgetting that 'mass per unit area' isn't pressure by itself — you still need to multiply by $g$ to get a force. Also watch the unit conversion: $1\\ \\text{cm}^2 = 10^{-4}\\ \\text{m}^2$, not $10^{-2}\\ \\text{m}^2$ — a very common slip.",
            },
            {
              kind: 'numerical',
              id: '574c2492-8df5-4057-8554-e2047d30f010',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.14',
              prompt: 'What is the SI unit of mass? How is it defined?',
              answer: 'Kilogram (kg)',
              solution:
                "**The SI unit of mass is the kilogram (kg).** For a long time it was defined as the mass of a specific platinum-iridium cylinder — the International Prototype of the Kilogram — kept at the International Bureau of Weights and Measures in Sèvres, France. Every other mass in the world was, in principle, compared back to this one physical object.\n\n**The modern definition (post-2019 redefinition):** the kilogram is now defined by fixing the numerical value of the Planck constant, $h$, to exactly $6.62607015\\times 10^{-34}\\ \\text{J s}$, and building the kilogram from that using an electrical measurement (a device called a Kibble balance). This removed the dependence on one physical object, which could gain or lose tiny amounts of mass over decades.\n\n**Why this matters for you at Class 11 level:** you mainly need to know that mass is measured in kilograms in the SI system, and that historically it was tied to a physical prototype, which is a nice contrast with how the metre and second are now defined using fundamental constants (speed of light, atomic transitions).",
            },
            {
              kind: 'numerical',
              id: 'f7066125-503c-4e32-b86a-84e03eaf235b',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.15',
              prompt:
                'Match the following prefixes with their multiples:\nPrefixes    Multiples\n(i) micro    10^6\n(ii) deca    10^9\n(iii) mega    10^-6\n(iv) giga    10^-15\n(v) femto    10',
              answer: 'micro→10⁻⁶, deca→10¹, mega→10⁶, giga→10⁹, femto→10⁻¹⁵',
              solution:
                "**This is a straight recall of the SI prefix table** — the multiples listed in the question are jumbled up, so match each prefix to its actual value, not to the position it's sitting next to.\n\n- **micro** ($\\mu$) $= 10^{-6}$ — a millionth.\n- **deca** (da) $= 10^{1} = 10$ — just ten times.\n- **mega** (M) $= 10^{6}$ — a million.\n- **giga** (G) $= 10^{9}$ — a billion.\n- **femto** (f) $= 10^{-15}$ — a thousandth of a trillionth, used for things like bond lengths in picometres' smaller cousin.\n\n**Where students get stuck:** micro and mega get swapped (both are '6', but one is positive, one negative), and femto (very small, $10^{-15}$) gets confused with giga (very large, $10^{9}$) just because both look like 'big scientific' prefixes. Anchor it by remembering: prefixes with Latin/Greek roots for 'small' (micro, femto, pico, nano) are always negative powers; 'large' ones (kilo, mega, giga, tera) are always positive powers.",
            },
            {
              kind: 'numerical',
              id: '2707ddd6-9f11-4c1e-b7c0-7c4bff231ab7',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.16',
              prompt: 'What do you mean by significant figures?',
              answer: 'Digits that carry real, meaningful precision in a measured value.',
              solution:
                "**Significant figures are the digits in a measured (or calculated) number that carry real meaning about how precisely it was measured** — every digit you're certain of, plus one final digit that's estimated/uncertain. They tell you how much you can trust a number, not just what the number is.\n\n**The rules you'll use constantly:**\n1. All non-zero digits are significant. $285$ has 3 sig figs.\n2. Zeros between non-zero digits are significant. $2005$ has 4 sig figs.\n3. Leading zeros (before the first non-zero digit) are never significant — they just locate the decimal point. $0.0025$ has 2 sig figs, not 4.\n4. Trailing zeros after a decimal point are significant. $500.0$ has 4 sig figs.\n5. Trailing zeros in a number with no decimal point are ambiguous ($126{,}000$ could be 3, 4, 5, or 6 sig figs) — scientific notation removes the ambiguity: $1.26\\times 10^{5}$ is unambiguously 3 sig figs.\n\n**Why this matters:** a measurement like $12.6\\ \\text{cm}$ isn't the same claim as $12.60\\ \\text{cm}$ — the second says your instrument could resolve to the hundredths place. Reporting more digits than your measurement justifies is a common exam-answer error (and a real-lab error too).",
            },
            {
              kind: 'numerical',
              id: '7509dc3d-c705-4b4a-80f4-f38d5f9f991d',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.18',
              prompt:
                'Express the following in the scientific notation:\n(i) 0.0048\n(ii) 234,000\n(iii) 8008\n(iv) 500.0\n(v) 6.0012',
              answer: '(i) 4.8×10⁻³ (ii) 2.34×10⁵ (iii) 8.008×10³ (iv) 5.000×10² (v) 6.0012×10⁰',
              solution:
                "**Scientific notation writes a number as $a \\times 10^{n}$, where $1 \\le a < 10$.** Move the decimal point until only one non-zero digit sits before it, and let $n$ be how many places you moved it (positive if the original number was $\\ge 10$, negative if it was $< 1$).\n\n(i) $0.0048$: move the decimal 3 places right → $4.8\\times 10^{-3}$\n\n(ii) $234{,}000$: move the decimal 5 places left → $2.34\\times 10^{5}$\n\n(iii) $8008$: move the decimal 3 places left → $8.008\\times 10^{3}$\n\n(iv) $500.0$: move the decimal 2 places left, keeping the trailing zero that was significant → $5.000\\times 10^{2}$ (4 sig figs preserved, since the original had a decimal point pinning them down)\n\n(v) $6.0012$: already between 1 and 10, so the exponent is just 0 → $6.0012\\times 10^{0}$\n\n**Where students get stuck:** in (iv), dropping a zero and writing $5.00\\times 10^2$ instead of $5.000\\times 10^2$ — that silently throws away a significant figure the original number had.",
            },
            {
              kind: 'numerical',
              id: '13c1fe81-7fc6-4d82-9296-25ae52d9835c',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.19',
              prompt:
                'How many significant figures are present in the following?\n(i) 0.0025\n(ii) 208\n(iii) 5005\n(iv) 126,000\n(v) 500.0\n(vi) 2.0034',
              answer: '(i) 2 (ii) 3 (iii) 4 (iv) 3 (v) 4 (vi) 5',
              solution:
                "**Apply the sig-fig rules from 1.16 one number at a time.**\n\n(i) $0.0025$ — the leading zeros just place the decimal; only $25$ counts → **2 sig figs**\n\n(ii) $208$ — all non-zero, plus a zero sandwiched between two non-zero digits (which counts) → **3 sig figs**\n\n(iii) $5005$ — same sandwiched-zero rule, both zeros are between non-zero digits → **4 sig figs**\n\n(iv) $126{,}000$ — no decimal point shown, so the trailing zeros are ambiguous and, by NCERT convention, treated as not significant here → **3 sig figs** (only $1,2,6$ count)\n\n(v) $500.0$ — the decimal point after the zeros makes them count → **4 sig figs**\n\n(vi) $2.0034$ — all digits count, including the zeros between non-zero digits → **5 sig figs**\n\n**Where students get stuck:** (iv) is the classic trap — without a decimal point or scientific notation, trailing zeros in a whole number are assumed not significant, purely by convention, even though in principle they could be exact.",
            },
            {
              kind: 'numerical',
              id: '92355851-c3b2-4940-816c-b6f84d00af7e',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.20',
              prompt:
                'Round up the following upto three significant figures:\n(i) 34.216\n(ii) 10.4107\n(iii) 0.04597\n(iv) 2808',
              answer: '(i) 34.2 (ii) 10.4 (iii) 0.0460 (iv) 2810',
              solution:
                "**To round to 3 sig figs, keep the first 3 significant digits and look at the next digit to decide whether to round up.**\n\n(i) $34.216$ → the 3 sig figs are $3,4,2$; the next digit is $1$ (round down) → **$34.2$**\n\n(ii) $10.4107$ → the 3 sig figs are $1,0,4$; the next digit is $1$ (round down) → **$10.4$**\n\n(iii) $0.04597$ → leading zeros don't count, so the 3 sig figs are $4,5,9$; the next digit is $7$ (round up, so $9 \\to 10$ carries over) → **$0.0460$** (note the trailing zero must stay to show 3 sig figs)\n\n(iv) $2808$ → the 3 sig figs are $2,8,0$; the next digit is $8$ (round up) → **$2810$**\n\n**Where students get stuck:** in (iii), writing $0.046$ instead of $0.0460$ — dropping the trailing zero quietly turns a 3-sig-fig answer into a 2-sig-fig one. In (iv), forgetting to carry the rounding through the zero (writing 2800 instead of 2810).",
            },
            {
              kind: 'numerical',
              id: '2b68247c-e6ba-4bb9-b297-1a76415f7227',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.21',
              prompt:
                'The following data are obtained when dinitrogen and dioxygen react together to form different compounds:\nMass of dinitrogen    Mass of dioxygen\n(i) 14 g    16 g\n(ii) 14 g    32 g\n(iii) 28 g    32 g\n(iv) 28 g    80 g\n(a) Which law of chemical combination is obeyed by the above experimental data? Give its statement.\n(b) Fill in the blanks in the following conversions:\n(i) 1 km = ...................... mm = ...................... pm\n(ii) 1 mg = ...................... kg = ...................... ng\n(iii) 1 mL = ...................... L = ...................... dm3',
              answer: '(a) Law of multiple proportions. (b)(i) 10⁶ mm, 10¹⁵ pm (ii) 10⁻⁶ kg, 10⁶ ng (iii) 10⁻³ L, 10⁻³ dm³',
              solution:
                "**Part (a) — spot the pattern first.** Fix the mass of dinitrogen and see how the mass of dioxygen it combines with changes:\n- At $14\\ \\text{g}\\ \\text{N}_2$: dioxygen is $16\\ \\text{g}$ or $32\\ \\text{g}$ — ratio $16:32 = 1:2$.\n- At $28\\ \\text{g}\\ \\text{N}_2$: dioxygen is $32\\ \\text{g}$ or $80\\ \\text{g}$ — ratio $32:80 = 2:5$, and note $28\\ \\text{g}$ is exactly double $14\\ \\text{g}$, so scaling (iii) down to $14\\ \\text{g}\\ \\text{N}_2$ gives $16\\ \\text{g}\\ \\text{O}_2$ — matching (i) exactly, and (iv) scaled down gives $40\\ \\text{g}\\ \\text{O}_2$ for $14\\ \\text{g}\\ \\text{N}_2$.\n\nSo for a fixed mass of dinitrogen, the different masses of dioxygen it combines with ($16, 32, 40\\ \\text{g}$, i.e. after scaling) are in the simple whole-number ratio $2:4:5$ (equivalently the raw pairs $16:32$ simplify to $1:2$). This is exactly the **Law of Multiple Proportions**: *when two elements combine to form two or more different compounds, the masses of one element that combine with a fixed mass of the other are in a ratio of small whole numbers.*\n\n**Part (b) — unit conversions, one step at a time.**\n\n(i) $1\\ \\text{km} = 10^{3}\\ \\text{m}$. Since $1\\ \\text{m} = 10^{3}\\ \\text{mm}$, $1\\ \\text{km} = 10^{3}\\times 10^{3} = 10^{6}\\ \\text{mm}$. Since $1\\ \\text{m} = 10^{12}\\ \\text{pm}$, $1\\ \\text{km} = 10^{3}\\times 10^{12} = 10^{15}\\ \\text{pm}$.\n\n(ii) $1\\ \\text{mg} = 10^{-3}\\ \\text{g} = 10^{-3}\\times 10^{-3}\\ \\text{kg} = 10^{-6}\\ \\text{kg}$. Since $1\\ \\text{g} = 10^{9}\\ \\text{ng}$, $1\\ \\text{mg} = 10^{-3}\\times 10^{9} = 10^{6}\\ \\text{ng}$.\n\n(iii) $1\\ \\text{mL} = 10^{-3}\\ \\text{L}$, and since $1\\ \\text{L} = 1\\ \\text{dm}^3$ exactly, $1\\ \\text{mL} = 10^{-3}\\ \\text{dm}^3$ too.\n\n**Where students get stuck:** treating (iv)'s ratio ($2:5$) as if it doesn't match (i)–(iii) — you have to scale to a *common* fixed mass of nitrogen first before comparing, not compare the raw numbers as given.",
            },
            {
              kind: 'numerical',
              id: 'f1ceadce-897b-4180-a4e6-a2dca8b5cf9a',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.22',
              prompt: 'If the speed of light is 3.0 × 10^8 m s-1, calculate the distance covered by light in 2.00 ns.',
              answer: 'Distance = 0.600 m',
              solution:
                "**This is a plain distance = speed × time problem — the only real work is unit conversion.** Nanoseconds need to become seconds first.\n\n$2.00\\ \\text{ns} = 2.00\\times 10^{-9}\\ \\text{s}$\n\n**Now multiply:**\n$\\text{distance} = v \\times t = (3.0\\times 10^{8}\\ \\text{m s}^{-1}) \\times (2.00\\times 10^{-9}\\ \\text{s})$\n$= 3.0 \\times 2.00 \\times 10^{8-9}\\ \\text{m} = 6.0\\times 10^{-1}\\ \\text{m} = 0.600\\ \\text{m}$\n\n**Sig figs:** the speed has 2 sig figs ($3.0$), so the answer is reported to 2 sig figs: $0.60\\ \\text{m}$ (written as $6.0\\times 10^{-1}\\ \\text{m}$ to be unambiguous).\n\n**Where students get stuck:** mixing up nano ($10^{-9}$) with micro ($10^{-6}$) or pico ($10^{-12}$) — always convert the prefix before plugging into the formula, not after.",
            },
            {
              kind: 'numerical',
              id: '2d5b1ec6-4d7c-4c67-9984-d3bb340255ef',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.27',
              prompt: 'Convert the following into basic units:\n(i) 28.7 pm\n(ii) 15.15 pm\n(iii) 25365 mg',
              answer: '(i) 2.87×10⁻¹¹ m (ii) 1.515×10⁻¹¹ m (iii) 2.5365×10⁻² kg',
              solution:
                "**'Basic units' here means SI base units — metre for length, kilogram for mass.**\n\n(i) $28.7\\ \\text{pm}$: since $1\\ \\text{pm} = 10^{-12}\\ \\text{m}$,\n$28.7\\ \\text{pm} = 28.7\\times 10^{-12}\\ \\text{m} = 2.87\\times 10^{-11}\\ \\text{m}$\n\n(ii) $15.15\\ \\text{pm} = 15.15\\times 10^{-12}\\ \\text{m} = 1.515\\times 10^{-11}\\ \\text{m}$\n\n(iii) $25365\\ \\text{mg}$: since $1\\ \\text{mg} = 10^{-3}\\ \\text{g} = 10^{-6}\\ \\text{kg}$,\n$25365\\ \\text{mg} = 25365\\times 10^{-6}\\ \\text{kg} = 2.5365\\times 10^{-2}\\ \\text{kg}$\n\n**Where students get stuck:** for mass, the SI base unit is the **kilogram**, not the gram — a very common slip is to stop the conversion at grams and call it done.",
            },
            {
              kind: 'numerical',
              id: '46690499-2a64-4dcb-a14a-6509e53f8a3d',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.31',
              prompt:
                'How many significant figures should be present in the answer of the following calculations?\n(i) (0.02856 × 298.15 × 0.112) / 0.5785\n(ii) 5 × 5.364\n(iii) 0.0125 + 0.7864 + 0.0215',
              answer: '(i) 3 (ii) 4 (iii) 4',
              solution:
                "**Two different rules apply here — multiplication/division vs addition — so sort each part first.**\n\n(i) $(0.02856 \\times 298.15 \\times 0.112) / 0.5785$ — pure multiplication and division. **Rule: the result can have no more sig figs than the least-precise number involved.** Count each: $0.02856$ (4 sf), $298.15$ (5 sf), $0.112$ (**3 sf**), $0.5785$ (4 sf). The smallest count is 3, from $0.112$. So the answer is reported to **3 significant figures**.\n\n(ii) $5 \\times 5.364$ — here the '$5$' is an exact/counting number (not a measurement with limited precision), so it doesn't restrict the sig figs. The precision is set entirely by $5.364$, which has **4 sig figs**. So the answer is reported to **4 significant figures**.\n\n(iii) $0.0125 + 0.7864 + 0.0215$ — pure addition. **Rule: the result can have no more decimal places than the least-precise term.** All three numbers here go to 4 decimal places, so the sum also goes to 4 decimal places: $0.0125+0.7864+0.0215 = 0.8204$, which happens to have **4 significant figures**.\n\n**Where students get stuck:** applying the multiplication rule (count sig figs) to an addition problem, or vice versa — the two rules genuinely are different, and mixing them up is the single most common error in this topic.",
            },
          ],
        },
        {
          id: '24483fbd-e63d-4a2c-acf8-0b3540acfe8b',
          title: 'Mole concept, Avogadro\'s number & atomic/molar mass',
          blurb: 'Counting particles, converting between moles/mass/number, and averaging isotopic masses.',
          items: [
            {
              kind: 'numerical',
              id: '7934e781-6888-4a4a-96e7-d32e2e3a921d',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.1',
              prompt: 'Calculate the molar mass of the following:\n(i) H2O (ii) CO2 (iii) CH4',
              answer: '(i) 18 g/mol (ii) 44 g/mol (iii) 16 g/mol',
              solution:
                "**Molar mass is just the sum of atomic masses of every atom in the formula, in grams per mole.** Use the standard atomic masses: $\\ce{H}=1$, $\\ce{C}=12$, $\\ce{O}=16$ (all in u, which numerically equals g/mol).\n\n(i) $\\ce{H2O}$: $2(1) + 16 = 18\\ \\text{g mol}^{-1}$\n\n(ii) $\\ce{CO2}$: $12 + 2(16) = 12 + 32 = 44\\ \\text{g mol}^{-1}$\n\n(iii) $\\ce{CH4}$: $12 + 4(1) = 16\\ \\text{g mol}^{-1}$\n\n**Where students get stuck:** forgetting to multiply by the subscript for every atom of that element — e.g. writing $\\ce{CO2}$ as $12+16=28$ instead of $12+2(16)=44$.",
            },
            {
              kind: 'numerical',
              id: '25ea87c7-f677-487a-8e69-0a60152e0ab1',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.9',
              prompt:
                'Calculate the atomic mass (average) of chlorine using the following data:\n% Natural Abundance     Molar Mass\n35Cl    75.77    34.9689\n37Cl    24.23    36.9659',
              answer: 'Average atomic mass ≈ 35.45 u',
              solution:
                "**Average atomic mass is a weighted average** — weight each isotope's mass by how common it actually is in nature (its fractional abundance), then add.\n\n$\\bar{M} = (0.7577 \\times 34.9689) + (0.2423 \\times 36.9659)$\n\nFirst term: $0.7577 \\times 34.9689 = 26.496$\n\nSecond term: $0.2423 \\times 36.9659 = 8.957$\n\n$\\bar{M} = 26.496 + 8.957 = 35.45\\ \\text{u}$\n\n**Why this matches the periodic table value:** chlorine's listed atomic mass, $35.5\\ \\text{u}$, isn't the mass of any single chlorine atom — no chlorine atom actually weighs $35.5\\ \\text{u}$. It's this abundance-weighted average across the two naturally occurring isotopes, $\\ce{^{35}Cl}$ and $\\ce{^{37}Cl}$.\n\n**Where students get stuck:** using a simple average of the two masses ($\\frac{34.9689+36.9659}{2}$) instead of weighting by abundance — that ignores that $\\ce{^{35}Cl}$ is roughly three times more common, which pulls the true average closer to 35.",
            },
            {
              kind: 'numerical',
              id: 'c34071fa-22cc-4bab-8670-e48c8281490a',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.10',
              prompt:
                'In three moles of ethane (C2H6), calculate the following:\n(i) Number of moles of carbon atoms.\n(ii) Number of moles of hydrogen atoms.\n(iii) Number of molecules of ethane.',
              answer: '(i) 6 mol C (ii) 18 mol H (iii) 1.807×10²⁴ molecules',
              solution:
                "**Each molecule of $\\ce{C2H6}$ contains 2 carbon atoms and 6 hydrogen atoms — scale that ratio up by the number of moles of ethane you have.**\n\n(i) Moles of C atoms $= 3\\ \\text{mol ethane} \\times 2 = 6\\ \\text{mol C}$\n\n(ii) Moles of H atoms $= 3\\ \\text{mol ethane} \\times 6 = 18\\ \\text{mol H}$\n\n(iii) Number of molecules $= 3\\ \\text{mol} \\times 6.022\\times 10^{23}\\ \\text{mol}^{-1} = 1.807\\times 10^{24}\\ \\text{molecules}$\n\n**Where students get stuck:** applying Avogadro's number directly to the *atoms* asked for in (i)/(ii) when the question only wants the mole count, not the actual number of atoms — read exactly what's being asked (moles vs. number of particles) before reaching for $N_A$.",
            },
            {
              kind: 'numerical',
              id: '95caa7a9-b5ff-489c-b494-9ef0d16f89cf',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.28',
              prompt: 'Which one of the following will have the largest number of atoms?\n(i) 1 g Au(s)\n(ii) 1 g Na(s)\n(iii) 1 g Li(s)\n(iv) 1 g of Cl2(g)',
              answer: '1 g of Li(s) has the largest number of atoms',
              solution:
                "**For the same mass, the element with the smallest molar mass per atom packs in the most atoms** — lighter atoms means more of them fit into 1 gram. So find moles of atoms for each and compare (no need to multiply through by $N_A$ since it's the same constant for all).\n\n(i) $\\ce{Au}$ ($M=197\\ \\text{g/mol}$): moles $= 1/197 = 0.00508\\ \\text{mol atoms}$\n\n(ii) $\\ce{Na}$ ($M=23\\ \\text{g/mol}$): moles $= 1/23 = 0.0435\\ \\text{mol atoms}$\n\n(iii) $\\ce{Li}$ ($M=7\\ \\text{g/mol}$): moles $= 1/7 = 0.1429\\ \\text{mol atoms}$\n\n(iv) $\\ce{Cl2}$ ($M=71\\ \\text{g/mol}$ for the molecule, $35.5$ per Cl atom): moles of molecules $=1/71=0.01408$, so moles of **atoms** $= 2\\times 0.01408 = 0.0282\\ \\text{mol atoms}$\n\nComparing: $0.1429 > 0.0435 > 0.0282 > 0.00508$. **Lithium wins**, because it has by far the smallest atomic mass among these four.\n\n**Where students get stuck:** forgetting that $\\ce{Cl2}$ is diatomic — you must double the moles of molecules to get moles of atoms, or you'll wrongly compare it as if it behaves like a single atom.",
            },
            {
              kind: 'numerical',
              id: 'b99e35b0-41fb-449b-b912-c6f8649a05e6',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.30',
              prompt: 'What will be the mass of one 12C atom in g?',
              answer: 'Mass of one ¹²C atom ≈ 1.9927 × 10⁻²³ g',
              solution:
                "**One mole of $\\ce{^{12}C}$ atoms has a mass of exactly $12\\ \\text{g}$ (that's the definition the whole mole concept is anchored to) and contains $N_A = 6.022\\times 10^{23}$ atoms.** So the mass of a single atom is just molar mass divided by Avogadro's number.\n\n$\\text{mass of one atom} = \\dfrac{12\\ \\text{g mol}^{-1}}{6.022\\times 10^{23}\\ \\text{mol}^{-1}} = 1.9927\\times 10^{-23}\\ \\text{g}$\n\n**Why this is worth sitting with:** this is the calculation that makes the mole concept concrete — it's the actual bridge between the everyday gram scale you weigh things on, and the impossibly tiny mass of a single atom. Every 'moles ↔ grams' conversion you'll ever do is built on exactly this division.",
            },
            {
              kind: 'numerical',
              id: '940aefd1-207a-4d6d-922d-5830841b8a81',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.32',
              prompt:
                'Use the data given in the following table to calculate the molar mass of naturally occuring argon isotopes:\nIsotope    Isotopic molar mass    Abundance\n36Ar    35.96755 g mol-1    0.337%\n38Ar    37.96272 g mol-1    0.063%\n40Ar    39.9624 g mol-1    99.600%',
              answer: 'Average molar mass of Ar ≈ 39.95 g/mol',
              solution:
                "**Same abundance-weighted average idea as chlorine in 1.9, just with three isotopes instead of two.** Convert each percentage to a fraction, multiply by that isotope's mass, and sum.\n\n$\\bar{M} = (0.00337\\times 35.96755) + (0.00063\\times 37.96272) + (0.99600\\times 39.9624)$\n\nFirst term: $0.00337\\times 35.96755 = 0.1212$\n\nSecond term: $0.00063\\times 37.96272 = 0.0239$\n\nThird term: $0.99600\\times 39.9624 = 39.8026$\n\n$\\bar{M} = 0.1212+0.0239+39.8026 = 39.948\\ \\text{g mol}^{-1} \\approx 39.95\\ \\text{g mol}^{-1}$\n\n**Notice how close this is to the pure mass of $\\ce{^{40}Ar}$ alone** — that's because $\\ce{^{40}Ar}$ makes up 99.6% of all naturally occurring argon, so the other two isotopes barely nudge the average. This is a good intuition check: when one isotope is overwhelmingly dominant, the average atomic mass will sit almost exactly at that isotope's mass.",
            },
            {
              kind: 'numerical',
              id: 'c1841ece-d5a9-43dc-9fe1-b4887ccc3d92',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.33',
              prompt: 'Calculate the number of atoms in each of the following (i) 52 moles of Ar (ii) 52 u of He (iii) 52 g of He.',
              answer: '(i) 3.131×10²⁵ atoms (ii) 13 atoms (iii) 7.829×10²⁴ atoms',
              solution:
                "**Three different starting quantities, three different routes to 'number of atoms' — pick the right conversion for each.**\n\n(i) $52$ **moles** of Ar: moles convert directly via Avogadro's number.\n$N = 52 \\times 6.022\\times 10^{23} = 3.131\\times 10^{25}\\ \\text{atoms}$\n\n(ii) $52$ **u** of He: here we're given a mass in atomic mass units, and one He atom itself weighs $4\\ \\text{u}$ (its atomic mass). So this is simply how many 4-u 'packets' fit into 52 u — no Avogadro's number needed at all, since we never left the atomic-mass-unit scale.\n$N = \\dfrac{52\\ \\text{u}}{4\\ \\text{u/atom}} = 13\\ \\text{atoms}$\n\n(iii) $52$ **g** of He: now the mass is in grams, a macroscopic unit, so we do need to go through moles.\n$\\text{moles} = \\dfrac{52\\ \\text{g}}{4\\ \\text{g mol}^{-1}} = 13\\ \\text{mol}$\n$N = 13 \\times 6.022\\times 10^{23} = 7.829\\times 10^{24}\\ \\text{atoms}$\n\n**Where students get stuck:** treating (ii) and (iii) as the same calculation just because both give '52' and 'He'. They're not — (ii) is atomic-mass-unit-to-atomic-mass-unit (no $N_A$ involved), while (iii) is gram-to-gram-per-mole-to-$N_A$ (a full three-step conversion). Mixing these up is the single most common trap in this question.",
            },
          ],
        },
        {
          id: 'a96ac834-b231-4515-9381-26c4dcfc1b65',
          title: 'Percentage composition & empirical / molecular formulas',
          blurb: 'Going from mass data to the ratio of atoms in a compound, and from that ratio to its real molecular identity.',
          items: [
            {
              kind: 'numerical',
              id: '7bc5604e-6da7-411f-9ed5-820d78668594',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.2',
              prompt: 'Calculate the mass per cent of different elements present in sodium sulphate (Na2SO4).',
              answer: 'Na ≈ 32.39%, S ≈ 22.54%, O ≈ 45.07%',
              solution:
                "**Mass percent of an element = (total mass of that element in one formula unit ÷ molar mass of the compound) × 100.** First get the molar mass of $\\ce{Na2SO4}$:\n\n$M = 2(23) + 32 + 4(16) = 46 + 32 + 64 = 142\\ \\text{g mol}^{-1}$\n\n**Now each element's share:**\n\n$\\%\\ \\ce{Na} = \\dfrac{46}{142}\\times 100 = 32.39\\%$\n\n$\\%\\ \\ce{S} = \\dfrac{32}{142}\\times 100 = 22.54\\%$\n\n$\\%\\ \\ce{O} = \\dfrac{64}{142}\\times 100 = 45.07\\%$\n\n**Check:** $32.39+22.54+45.07 = 100.0\\%$ — the three percentages must always add up to 100, which is a free way to catch arithmetic slips.\n\n**Where students get stuck:** using the atomic mass of a single Na atom (23) in the numerator instead of the mass contributed by *both* sodium atoms in the formula (46) — always multiply by the subscript first.",
            },
            {
              kind: 'numerical',
              id: '29b63b30-e7fe-440e-9184-dfd73cba8e67',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.3',
              prompt: 'Determine the empirical formula of an oxide of iron, which has 69.9% iron and 30.1% dioxygen by mass.',
              answer: 'Empirical formula: Fe2O3',
              solution:
                "**Empirical formula from percentages: assume a 100 g sample, so the percentages become grams directly, convert each to moles, then find the simplest whole-number ratio.**\n\nMass Fe $= 69.9\\ \\text{g}$, mass O $= 30.1\\ \\text{g}$ (in a 100 g sample)\n\nMoles Fe $= 69.9/56 = 1.248\\ \\text{mol}$\n\nMoles O $= 30.1/16 = 1.881\\ \\text{mol}$\n\n**Divide both by the smaller value (1.248) to get the simplest ratio:**\n\nFe: $1.248/1.248 = 1.00$\n\nO: $1.881/1.248 = 1.507 \\approx 1.5$\n\nA ratio of $1 : 1.5$ isn't whole numbers yet — **multiply both by 2** to clear the fraction:\n\nFe : O $= 2 : 3$\n\n**Empirical formula: $\\ce{Fe2O3}$**\n\n**Where students get stuck:** stopping at the $1:1.5$ ratio instead of recognising it needs to be doubled to reach whole numbers — any time your ratio ends in $.5$, $.33$, or $.25$, multiply through by 2, 3, or 4 respectively before finalising the formula.",
            },
            {
              kind: 'numerical',
              id: 'db5d52bc-1d1d-4f91-afdc-4f16966c4c21',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.8',
              prompt: 'Determine the molecular formula of an oxide of iron, in which the mass per cent of iron and oxygen are 69.9 and 30.1, respectively.',
              answer: 'Molecular formula: Fe2O3',
              solution:
                "**This is the exact same data as 1.3** — 69.9% Fe, 30.1% O — so the empirical formula comes out identically to $\\ce{Fe2O3}$ (see the working there: moles Fe $=1.248$, moles O $=1.881$, ratio $1:1.5\\to 2:3$).\n\n**The step this question adds is going from empirical to molecular formula.** Normally you'd need the compound's actual molar mass to find $n$ in $(\\text{empirical formula})_n = \\text{molecular formula}$, using $n = \\dfrac{\\text{molar mass of compound}}{\\text{empirical formula mass}}$.\n\nHere, no separate molar mass is given for this oxide — so, following the standard convention when no extra molar-mass data is supplied, we take $n=1$, meaning the **molecular formula is the same as the empirical formula**:\n\n**Molecular formula: $\\ce{Fe2O3}$** (this is indeed ferric oxide / hematite in real life, so this checks out chemically too).\n\n**Where students get stuck:** not noticing that 1.3 and 1.8 give the same numbers — many students redo the whole percent-to-mole calculation from scratch not realising the empirical-formula step is identical; the only new idea here is the empirical-vs-molecular distinction itself.",
            },
            {
              kind: 'numerical',
              id: '255d2e4e-f22b-4081-bf90-11bbc79c2956',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.34',
              prompt:
                'A welding fuel gas contains carbon and hydrogen only. Burning a small sample of it in oxygen gives 3.38 g carbon dioxide, 0.690 g of water and no other products. A volume of 10.0 L (measured at STP) of this welding gas is found to weigh 11.6 g. Calculate (i) empirical formula, (ii) molar mass of the gas, and (iii) molecular formula.',
              answer: 'Empirical formula CH; molar mass ≈ 26.0 g/mol; molecular formula C2H2',
              solution:
                "**This is a combustion analysis problem — all the carbon in the original sample ends up in the $\\ce{CO2}$, and all the hydrogen ends up in the $\\ce{H2O}$.** Work backwards from the products to find how much C and H were in the original gas.\n\n**Step 1 — moles and mass of carbon (from $\\ce{CO2}$):**\n$\\text{moles } \\ce{CO2} = 3.38/44 = 0.0768\\ \\text{mol} \\Rightarrow \\text{moles C} = 0.0768\\ \\text{mol}$\nmass C $= 0.0768\\times 12 = 0.922\\ \\text{g}$\n\n**Step 2 — moles and mass of hydrogen (from $\\ce{H2O}$):**\n$\\text{moles } \\ce{H2O} = 0.690/18 = 0.0383\\ \\text{mol} \\Rightarrow \\text{moles H} = 2\\times 0.0383 = 0.0767\\ \\text{mol}$\nmass H $= 0.0767\\times 1 = 0.0767\\ \\text{g}$\n\n**Step 3 — empirical formula.** Moles C : moles H $= 0.0768 : 0.0767 \\approx 1:1$.\n\n**Empirical formula: $\\ce{CH}$**, empirical formula mass $= 12+1 = 13\\ \\text{g mol}^{-1}$\n\n**Step 4 — molar mass, from the STP density.** At STP, 1 mole of any gas occupies $22.4\\ \\text{L}$ (the NCERT convention). Moles in the 10.0 L sample:\n$\\text{moles} = 10.0/22.4 = 0.4464\\ \\text{mol}$\n$\\text{Molar mass} = \\dfrac{\\text{mass}}{\\text{moles}} = \\dfrac{11.6}{0.4464} = 26.0\\ \\text{g mol}^{-1}$\n\n**Step 5 — molecular formula.**\n$n = \\dfrac{\\text{molar mass}}{\\text{empirical formula mass}} = \\dfrac{26.0}{13} = 2$\n\n**Molecular formula: $(\\ce{CH})_2 = \\ce{C2H2}$** — this is acetylene, which is exactly what real welding-gas cylinders contain, so the chemistry checks out.\n\n**Where students get stuck:** forgetting the factor of 2 when converting moles of $\\ce{H2O}$ to moles of H atoms (each water molecule has 2 hydrogens), and mixing up which formula (empirical vs molecular) the STP-density step is meant to determine.",
            },
          ],
        },
        {
          id: 'cb549d8a-12dd-495f-8520-c5af446631e0',
          title: 'Stoichiometry & limiting reagent',
          blurb: 'Balanced equations turned into mass and mole predictions — including spotting which reactant runs out first.',
          items: [
            {
              kind: 'numerical',
              id: 'e29f0bee-ea8f-4af4-9a37-7a8ecb5a74c3',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.4',
              prompt:
                'Calculate the amount of carbon dioxide that could be produced when\n(i) 1 mole of carbon is burnt in air.\n(ii) 1 mole of carbon is burnt in 16 g of dioxygen.\n(iii) 2 moles of carbon are burnt in 16 g of dioxygen.',
              answer: '(i) 44 g CO₂ (ii) 22 g CO₂ (iii) 22 g CO₂',
              solution:
                "**The reaction is $\\ce{C + O2 -> CO2}$ — a 1:1:1 mole ratio.** In each part, first check whether carbon or oxygen is the limiting reagent, then use whichever is limiting to find the $\\ce{CO2}$ produced.\n\n(i) **'Burnt in air'** means oxygen is in unlimited supply, so all $1$ mole of carbon reacts completely.\n$\\text{moles } \\ce{CO2} = 1\\ \\text{mol} \\Rightarrow \\text{mass} = 1\\times 44 = 44\\ \\text{g}$\n\n(ii) $1$ mole C, but oxygen is capped at $16\\ \\text{g}$: $\\text{moles } \\ce{O2} = 16/32 = 0.5\\ \\text{mol}$. Since the ratio needed is 1:1, only $0.5\\ \\text{mol}$ of the $1\\ \\text{mol}$ carbon can actually react — **oxygen is the limiting reagent**.\n$\\text{moles } \\ce{CO2} = 0.5\\ \\text{mol} \\Rightarrow \\text{mass} = 0.5\\times 44 = 22\\ \\text{g}$\n\n(iii) $2$ moles C, oxygen still capped at $16\\ \\text{g} = 0.5\\ \\text{mol}$ — **oxygen is again the limiting reagent** (there's even more excess carbon than in (ii), but that doesn't matter once oxygen runs out).\n$\\text{moles } \\ce{CO2} = 0.5\\ \\text{mol} \\Rightarrow \\text{mass} = 22\\ \\text{g}$\n\n**Where students get stuck:** in (iii), assuming that doubling the carbon doubles the $\\ce{CO2}$ — it doesn't, because oxygen (not carbon) is what's actually limiting the reaction in both (ii) and (iii); the extra carbon in (iii) just sits there unreacted.",
            },
            {
              kind: 'numerical',
              id: 'e82aa771-76fe-4d0d-8ad4-ed47dd7c94ba',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.7',
              prompt: 'How much copper can be obtained from 100 g of copper sulphate (CuSO4)?',
              answer: 'Cu ≈ 39.8 g',
              solution:
                "**Every mole of $\\ce{CuSO4}$ contains exactly one mole of Cu**, so this is a direct mole-ratio problem once you know the molar mass of $\\ce{CuSO4}$.\n\n$M(\\ce{CuSO4}) = 63.5 + 32 + 4(16) = 63.5+32+64 = 159.5\\ \\text{g mol}^{-1}$\n\n$\\text{moles } \\ce{CuSO4} = \\dfrac{100}{159.5} = 0.627\\ \\text{mol}$\n\nSince the mole ratio $\\ce{CuSO4}:\\ce{Cu}$ is $1:1$:\n\n$\\text{moles Cu} = 0.627\\ \\text{mol}$\n\n$\\text{mass Cu} = 0.627 \\times 63.5 = 39.8\\ \\text{g}$\n\n**Where students get stuck:** forgetting to actually finish the conversion back to grams — leaving the answer in moles instead of the mass the question asks for.",
            },
            {
              kind: 'mcq',
              id: '49c16267-ff05-4990-a511-f44a4d9ecc42',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.23',
              prompt:
                'In a reaction\nA + B2 → AB2\nIdentify the limiting reagent, if any, in the following reaction mixtures.\n(i) 300 atoms of A + 200 molecules of B\n(ii) 2 mol A + 3 mol B\n(iii) 100 atoms of A + 100 molecules of B\n(iv) 5 mol A + 2.5 mol B\n(v) 2.5 mol A + 5 mol B',
              options: [
                '(i) B₂ limiting (ii) A limiting (iii) none — exact ratio (iv) B₂ limiting (v) A limiting',
                '(i) A limiting (ii) B₂ limiting (iii) none — exact ratio (iv) A limiting (v) B₂ limiting',
                'All five mixtures are exactly stoichiometric — no limiting reagent anywhere',
                '(i) B₂ limiting (ii) no limiting reagent (iii) none — exact ratio (iv) B₂ limiting (v) A limiting',
              ],
              correct_index: 0,
              explanation:
                "**The equation $\\ce{A + B2 -> AB2}$ has a 1:1 mole ratio between A and $\\ce{B2}$** — so in every part, whichever reactant has fewer moles/particles than the other is the limiting one (and if they're exactly equal, there's no limiting reagent at all).\n\n(i) $300$ atoms A vs $200$ molecules $\\ce{B2}$ — need $300$ $\\ce{B2}$ for all the A to react, only $200$ available → **$\\ce{B2}$ is limiting** (100 atoms of A left over).\n\n(ii) $2$ mol A vs $3$ mol $\\ce{B2}$ — need only $2$ mol $\\ce{B2}$ to use up the A, but $3$ mol is available (an excess of 1 mol $\\ce{B2}$) → **A is limiting** (all of A reacts, some $\\ce{B2}$ is left over). Check this carefully against your own working rather than trusting a remembered shortcut — the 1:1 ratio makes it a direct head-to-head comparison of the two mole values, and $2 < 3$.\n\n(iii) $100$ atoms A vs $100$ molecules $\\ce{B2}$ — exactly equal, matching the 1:1 requirement perfectly → **no limiting reagent**, both are used up completely.\n\n(iv) $5$ mol A vs $2.5$ mol $\\ce{B2}$ — need $5$ mol $\\ce{B2}$, only $2.5$ mol available → **$\\ce{B2}$ is limiting**.\n\n(v) $2.5$ mol A vs $5$ mol $\\ce{B2}$ — need only $2.5$ mol $\\ce{B2}$, but $5$ mol is available → **A is limiting**.\n\n**Where students get stuck:** with a clean 1:1 ratio like this one, the limiting reagent is simply whichever quantity is smaller — no need for any division. The trap is overthinking it or misremembering a stoichiometric ratio from a different problem; always re-derive the required ratio from the balanced equation itself, here exactly 1 mol A per 1 mol $\\ce{B2}$.",
            },
            {
              kind: 'numerical',
              id: '5c91099f-1fd6-43c0-9e4e-fcdced59dea1',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.24',
              prompt:
                'Dinitrogen and dihydrogen react with each other to produce ammonia according to the following chemical equation:\nN2(g) + H2(g) → 2NH3(g)\n(i) Calculate the mass of ammonia produced if 2.00 × 10^3 g dinitrogen reacts with 1.00 × 10^3 g of dihydrogen.\n(ii) Will any of the two reactants remain unreacted?\n(iii) If yes, which one and what would be its mass?',
              answer: '(i) ≈2.43×10³ g NH₃ (ii) yes (iii) H₂ remains, ≈5.71×10² g',
              solution:
                "**First, balance the equation properly** — as written it's missing a coefficient. The correctly balanced reaction is:\n$\\ce{N2(g) + 3H2(g) -> 2NH3(g)}$\nEvery 1 mole of $\\ce{N2}$ needs 3 moles of $\\ce{H2}$.\n\n**Step 1 — convert both reactants to moles.**\n$\\text{moles } \\ce{N2} = \\dfrac{2.00\\times 10^3}{28} = 71.43\\ \\text{mol}$\n$\\text{moles } \\ce{H2} = \\dfrac{1.00\\times 10^3}{2} = 500\\ \\text{mol}$\n\n**Step 2 — find the limiting reagent.** For $71.43\\ \\text{mol}$ $\\ce{N2}$ to react fully, we'd need $3\\times 71.43 = 214.3\\ \\text{mol}$ $\\ce{H2}$. We have $500\\ \\text{mol}$ — far more than enough. So **$\\ce{N2}$ is the limiting reagent**.\n\n**(i) Mass of $\\ce{NH3}$ produced:** the ratio $\\ce{N2}:\\ce{NH3}$ is $1:2$.\n$\\text{moles } \\ce{NH3} = 2\\times 71.43 = 142.9\\ \\text{mol}$\n$\\text{mass } \\ce{NH3} = 142.9\\times 17 = 2.43\\times 10^{3}\\ \\text{g}$\n\n**(ii) Yes** — since $\\ce{N2}$ is limiting, some $\\ce{H2}$ is left unreacted.\n\n**(iii) Mass of $\\ce{H2}$ left over:**\n$\\ce{H2}$ actually used $= 3\\times 71.43 = 214.3\\ \\text{mol} \\Rightarrow$ mass used $= 214.3\\times 2 = 428.6\\ \\text{g}$\n$\\ce{H2}$ remaining $= 1000 - 428.6 = 571.4\\ \\text{g} \\approx 5.71\\times 10^{2}\\ \\text{g}$\n\n**Where students get stuck:** using the unbalanced $\\ce{N2 + H2 -> 2NH3}$ as printed instead of catching that it needs the coefficient 3 on $\\ce{H2}$ — a reaction that produces $\\ce{NH3}$ from $\\ce{N2}$ and $\\ce{H2}$ can never balance as 1:1:2, since that would leave nitrogen balanced but hydrogen short (2 H on the left, 6 H on the right).",
            },
            {
              kind: 'numerical',
              id: '73f69a68-bb73-4058-8ab7-b2dc4368abfc',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.25',
              prompt: 'How are 0.50 mol Na2CO3 and 0.50 M Na2CO3 different?',
              answer: '0.50 mol is a fixed amount of substance; 0.50 M is a concentration (per litre of solution)',
              solution:
                "**These describe two completely different kinds of quantity, even though the numbers look the same.**\n\n**$0.50\\ \\text{mol}\\ \\ce{Na2CO3}$** is simply an *amount of substance* — a fixed number of moles ($0.50\\times 6.022\\times 10^{23}$ formula units), which corresponds to a fixed mass: $0.50\\times 106 = 53\\ \\text{g}$ (molar mass of $\\ce{Na2CO3} = 2(23)+12+3(16)=106$). This amount doesn't depend on whether it's dissolved in water, dry as a solid, or spread across any volume at all.\n\n**$0.50\\ \\text{M}\\ \\ce{Na2CO3}$** (i.e. $0.50\\ \\text{mol L}^{-1}$) is a *concentration* — it tells you there's $0.50$ mole of $\\ce{Na2CO3}$ dissolved in **every litre** of solution. The total amount present depends entirely on how much solution volume you have: 1 L of it contains $0.50\\ \\text{mol}$, but 2 L of it contains $1.00\\ \\text{mol}$.\n\n**In short:** '$0.50$ mol' is a quantity; '$0.50$ M' is a concentration (a ratio of quantity to volume). You cannot ask 'how many grams does 0.50 M contain' without also knowing the volume of solution.\n\n**Where students get stuck:** treating molarity as if it were an absolute amount of substance, and trying to convert '0.50 M' directly to a mass without being given (or assuming) a solution volume.",
            },
            {
              kind: 'numerical',
              id: '500334b6-4a13-48df-a68c-895cfb956a69',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.26',
              prompt: 'If 10 volumes of dihydrogen gas reacts with five volumes of dioxygen gas, how many volumes of water vapour would be produced?',
              answer: 'Ten volumes of water vapour',
              solution:
                "**This uses Gay-Lussac's Law of Gaseous Volumes: under the same temperature and pressure, gas volumes react in the same simple ratio as their mole coefficients in the balanced equation.** So we can read the volume ratio directly off the balanced reaction, without ever needing actual mole or mass numbers.\n\n$\\ce{2H2(g) + O2(g) -> 2H2O(g)}$\n\nVolume ratio $\\ce{H2}:\\ce{O2}:\\ce{H2O} = 2:1:2$.\n\n**Check the given amounts fit this ratio:** $10$ volumes $\\ce{H2}$ to $5$ volumes $\\ce{O2}$ is exactly $2:1$ — a perfect stoichiometric mixture, nothing left over.\n\n**Volume of water vapour produced:** since $\\ce{H2}:\\ce{H2O}$ is $2:2 = 1:1$, $10$ volumes of $\\ce{H2}$ produce **10 volumes of water vapour**.\n\n**Where students get stuck:** trying to add the two volumes ($10+5=15$) as if gas volumes combine like masses — they don't; the *product* volume is set purely by the coefficient ratio in the balanced equation, not by conservation of total volume (moles of gas molecules aren't conserved across a reaction; here $10+5=15$ volumes of reactant produce only $10$ volumes of product).",
            },
            {
              kind: 'numerical',
              id: '6090711e-0ef1-4d89-8a32-dbc2fcd94cb0',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.35',
              prompt:
                'Calcium carbonate reacts with aqueous HCl to give CaCl2 and CO2 according to the reaction, CaCO3(s) + 2 HCl(aq) → CaCl2(aq) + CO2(g) + H2O(l)\nWhat mass of CaCO3 is required to react completely with 25 mL of 0.75 M HCl?',
              answer: 'CaCO₃ ≈ 0.938 g',
              solution:
                "**Start from the HCl volume and molarity to get moles of HCl, then use the balanced-equation ratio to reach $\\ce{CaCO3}$.**\n\n$\\text{moles HCl} = \\text{molarity} \\times \\text{volume (L)} = 0.75 \\times 0.025 = 0.01875\\ \\text{mol}$\n\n**From the balanced equation**, $\\ce{CaCO3 + 2HCl -> CaCl2 + CO2 + H2O}$, the mole ratio $\\ce{CaCO3}:\\ce{HCl}$ is $1:2$.\n\n$\\text{moles } \\ce{CaCO3} = \\dfrac{0.01875}{2} = 0.009375\\ \\text{mol}$\n\n**Molar mass of $\\ce{CaCO3}$:** $40+12+3(16) = 100\\ \\text{g mol}^{-1}$\n\n$\\text{mass } \\ce{CaCO3} = 0.009375 \\times 100 = 0.9375\\ \\text{g} \\approx 0.94\\ \\text{g}$\n\n**Where students get stuck:** forgetting to convert $25\\ \\text{mL}$ to litres ($0.025\\ \\text{L}$) before multiplying by molarity, and forgetting to divide by the 2 in the mole ratio (since it takes *two* moles of HCl per mole of $\\ce{CaCO3}$, not one).",
            },
            {
              kind: 'numerical',
              id: 'ff01a076-2d69-41ac-a6c8-8c011d9cdc9f',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.36',
              prompt:
                'Chlorine is prepared in the laboratory by treating manganese dioxide (MnO2) with aqueous hydrochloric acid according to the reaction\n4 HCl(aq) + MnO2(s) → 2H2O(l) + MnCl2(aq) + Cl2(g)\nHow many grams of HCl react with 5.0 g of manganese dioxide?',
              answer: 'HCl ≈ 8.4 g',
              solution:
                "**Start from the given mass of $\\ce{MnO2}$, convert to moles, then use the balanced-equation ratio to get moles (then mass) of HCl.**\n\n**Molar mass of $\\ce{MnO2}$:** $55+2(16) = 87\\ \\text{g mol}^{-1}$\n\n$\\text{moles } \\ce{MnO2} = \\dfrac{5.0}{87} = 0.05747\\ \\text{mol}$\n\n**From the balanced equation**, $\\ce{4HCl + MnO2 -> 2H2O + MnCl2 + Cl2}$, the mole ratio $\\ce{HCl}:\\ce{MnO2}$ is $4:1$.\n\n$\\text{moles HCl} = 4 \\times 0.05747 = 0.2299\\ \\text{mol}$\n\n**Molar mass of HCl:** $1+35.5 = 36.5\\ \\text{g mol}^{-1}$\n\n$\\text{mass HCl} = 0.2299 \\times 36.5 = 8.39\\ \\text{g} \\approx 8.4\\ \\text{g}$\n\n**Where students get stuck:** using the $1:1$ ratio instead of the actual $4:1$ ratio from the balanced equation — always read the coefficients off the equation itself rather than assuming a simple one-to-one relationship.",
            },
          ],
        },
        {
          id: 'd0ff6669-e70a-4e39-8e1b-16fc70f3a1b1',
          title: 'Concentration units — molarity, molality, mole fraction & ppm',
          blurb: 'Turning solution recipes into the different ways chemists express "how much is dissolved".',
          items: [
            {
              kind: 'numerical',
              id: 'eb1dcd00-67e5-4825-b05f-933d74c4337f',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.5',
              prompt: 'Calculate the mass of sodium acetate (CH3COONa) required to make 500 mL of 0.375 molar aqueous solution. Molar mass of sodium acetate is 82.0245 g mol-1.',
              answer: 'Mass ≈ 15.38 g',
              solution:
                "**Molarity tells you moles per litre — combine it with the volume to get moles needed, then convert to mass using the given molar mass.**\n\n$\\text{moles needed} = \\text{molarity}\\times \\text{volume (L)} = 0.375 \\times 0.500 = 0.1875\\ \\text{mol}$\n\n$\\text{mass} = \\text{moles}\\times \\text{molar mass} = 0.1875 \\times 82.0245 = 15.38\\ \\text{g}$\n\n**Where students get stuck:** using $500$ (mL) directly in the molarity formula instead of converting to litres first ($500\\ \\text{mL} = 0.500\\ \\text{L}$) — this is the single most common arithmetic slip across every molarity question in this chapter.",
            },
            {
              kind: 'numerical',
              id: '287f9c99-cd06-4a5d-901f-a257769569c1',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.6',
              prompt: 'Calculate the concentration of nitric acid in moles per litre in a sample which has a density, 1.41 g mL-1 and the mass per cent of nitric acid in it being 69%.',
              answer: 'Molarity of HNO₃ ≈ 15.44 mol/L',
              solution:
                "**Work with a convenient fixed volume — take exactly 1 litre (1000 mL) of the solution — and use the density to find its total mass, then the mass percent to find how much of that is actual $\\ce{HNO3}$.**\n\n**Total mass of 1 L of solution:**\n$\\text{mass} = \\text{density}\\times \\text{volume} = 1.41\\ \\text{g mL}^{-1} \\times 1000\\ \\text{mL} = 1410\\ \\text{g}$\n\n**Mass of $\\ce{HNO3}$ in that litre** (69% by mass):\n$\\text{mass } \\ce{HNO3} = 0.69 \\times 1410 = 972.9\\ \\text{g}$\n\n**Convert to moles.** $M(\\ce{HNO3}) = 1+14+3(16) = 63\\ \\text{g mol}^{-1}$\n$\\text{moles} = \\dfrac{972.9}{63} = 15.44\\ \\text{mol}$\n\n**Since this is the amount of $\\ce{HNO3}$ found in exactly 1 litre of solution, this number IS the molarity:**\n\n$\\text{Molarity} = 15.44\\ \\text{mol L}^{-1}$\n\n**Where students get stuck:** picking an arbitrary volume like 100 mL instead of 1 L — it still works mathematically, but choosing 1 L directly gives you the molarity without a final division step, and is far less error-prone.",
            },
            {
              kind: 'numerical',
              id: '811bf3af-845c-4fb6-8487-f03bdb758c24',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.11',
              prompt: 'What is the concentration of sugar (C12H22O11) in mol L-1 if its 20 g are dissolved in enough water to make a final volume up to 2L?',
              answer: 'Molarity ≈ 0.0292 mol/L',
              solution:
                "**Straightforward molarity: convert the given mass to moles, then divide by the given volume in litres.**\n\n**Molar mass of sugar:** $\\ce{C12H22O11} = 12(12)+22(1)+11(16) = 144+22+176 = 342\\ \\text{g mol}^{-1}$\n\n$\\text{moles} = \\dfrac{20}{342} = 0.0585\\ \\text{mol}$\n\n$\\text{Molarity} = \\dfrac{\\text{moles}}{\\text{volume (L)}} = \\dfrac{0.0585}{2} = 0.0292\\ \\text{mol L}^{-1}$\n\n**Where students get stuck:** stopping after finding moles and forgetting the final division by volume — molarity always needs both a mole count and a volume, never just one.",
            },
            {
              kind: 'numerical',
              id: '0c2c6bd3-4e24-4e0c-b4e1-1328f4376b0f',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.12',
              prompt: 'If the density of methanol is 0.793 kg L-1, what is its volume needed for making 2.5 L of its 0.25 M solution?',
              answer: 'Volume of methanol ≈ 25.2 mL',
              solution:
                "**Work forward from the target solution to find how much pure methanol (by mass) is needed, then use density to convert that mass to a volume.**\n\n**Step 1 — moles of methanol needed:**\n$\\text{moles} = \\text{molarity}\\times \\text{volume} = 0.25 \\times 2.5 = 0.625\\ \\text{mol}$\n\n**Step 2 — mass of methanol needed.** $M(\\ce{CH3OH}) = 12+4(1)+16 = 32\\ \\text{g mol}^{-1}$\n$\\text{mass} = 0.625 \\times 32 = 20\\ \\text{g}$\n\n**Step 3 — convert that mass to a volume using density.** Density $=0.793\\ \\text{kg L}^{-1} = 0.793\\ \\text{g mL}^{-1}$ (numerically the same value, since kg/L and g/mL are equal units).\n\n$\\text{volume} = \\dfrac{\\text{mass}}{\\text{density}} = \\dfrac{20\\ \\text{g}}{0.793\\ \\text{g mL}^{-1}} = 25.2\\ \\text{mL}$\n\n**Where students get stuck:** treating $0.793\\ \\text{kg L}^{-1}$ as if it needs a unit conversion before use — it doesn't; $1\\ \\text{kg L}^{-1}$ numerically equals $1\\ \\text{g mL}^{-1}$, so you can plug the given density straight in as g/mL.",
            },
            {
              kind: 'numerical',
              id: '10532749-260d-4cc3-a047-f7ce48490153',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.17',
              prompt:
                'A sample of drinking water was found to be severely contaminated with chloroform, CHCl3, supposed to be carcinogenic in nature. The level of contamination was 15 ppm (by mass).\n(i) Express this in per cent by mass.\n(ii) Determine the molality of chloroform in the water sample.',
              answer: '(i) 1.5×10⁻³% (ii) ≈1.25×10⁻⁴ mol/kg',
              solution:
                "**ppm (parts per million) by mass means grams of solute per $10^6$ grams of solution — treat this as your recipe for both parts.**\n\n**(i) Convert ppm to percent.** Percent is 'parts per hundred', so:\n$\\%\\ \\text{by mass} = \\dfrac{15}{10^6}\\times 100 = 15\\times 10^{-4}\\% = 1.5\\times 10^{-3}\\%$\n\n**(ii) Molality = moles of solute per kilogram of solvent.** Take the $10^6\\ \\text{g}$ solution as basis: it contains $15\\ \\text{g}$ of $\\ce{CHCl3}$, and (since the contamination is tiny) essentially $10^6\\ \\text{g} = 1000\\ \\text{kg}$ of water as solvent.\n\n**Molar mass of $\\ce{CHCl3}$:** $12+1+3(35.5) = 12+1+106.5 = 119.5\\ \\text{g mol}^{-1}$\n\n$\\text{moles } \\ce{CHCl3} = \\dfrac{15}{119.5} = 0.1255\\ \\text{mol}$\n\n$\\text{Molality} = \\dfrac{0.1255\\ \\text{mol}}{1000\\ \\text{kg}} = 1.255\\times 10^{-4}\\ \\text{mol kg}^{-1}$\n\n**Where students get stuck:** forgetting that molality needs the mass of *solvent* (water), not the mass of the whole solution — for such a dilute contamination the two are nearly identical, which is exactly why the approximation (treating all $10^6$ g as water) is valid here.",
            },
            {
              kind: 'numerical',
              id: 'fd7c4267-5673-4427-968e-b068642ef383',
              source: 'ncert_exercise',
              source_label: 'NCERT 1.29',
              prompt: 'Calculate the molarity of a solution of ethanol in water, in which the mole fraction of ethanol is 0.040 (assume the density of water to be one).',
              answer: 'Molarity of ethanol ≈ 2.31 mol/L',
              solution:
                "**Mole fraction only tells you a ratio, not actual amounts — so pick a convenient basis, work out the actual moles, then bring in density to convert to a volume for molarity.**\n\n**Step 1 — pick a basis.** Take $1\\ \\text{mol}$ of water as the basis and let $x$ be the moles of ethanol.\n\n$X_{\\text{ethanol}} = \\dfrac{x}{x+1} = 0.040$\n\n$x = 0.040(x+1) = 0.040x + 0.040$\n\n$x(1-0.040) = 0.040 \\Rightarrow x = \\dfrac{0.040}{0.960} = 0.04167\\ \\text{mol ethanol}$\n\n**Step 2 — find the volume of solution using the water.** Mass of $1\\ \\text{mol}$ water $= 18\\ \\text{g}$. Since density of water is taken as $1\\ \\text{g mL}^{-1}$, and the ethanol amount is small enough that the solution volume is approximated by the water's volume:\n\n$\\text{volume} \\approx 18\\ \\text{mL} = 0.018\\ \\text{L}$\n\n**Step 3 — molarity of ethanol:**\n\n$\\text{Molarity} = \\dfrac{0.04167\\ \\text{mol}}{0.018\\ \\text{L}} = 2.31\\ \\text{mol L}^{-1}$\n\n**Where students get stuck:** trying to compute molarity directly from the mole fraction without picking a concrete basis first — mole fraction is a pure ratio, so you always need to anchor it to an actual amount (here, 1 mole of water) before you can talk about volumes and molarity.",
            },
          ],
        },
      ],
    },
  ],
};
