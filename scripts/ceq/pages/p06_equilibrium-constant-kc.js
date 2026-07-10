// CEQ page 6 — The Equilibrium Constant, Kc (law of chemical equilibrium / mass action).
// NCERT §7.3-7.4: Kc = [C]^c[D]^d / [A]^a[B]^b for aA+bB <=> cC+dD; the H2+I2 experiment
// (Tables 7.2/7.3) showing the ratio holds constant from any starting amounts; one Kc per
// temperature. Folds NCERT Problems 7.1, 7.2, 7.3 as worked() blocks.
// Voice: teacher-voice-profile + CEQ-exemplars. HIS framing: reaction quotient Q measures
// "how far the reaction has gone" like IQ measures intelligence; at eq Q = Kc; the H2+I2
// table where the bare ratio drifts but [HI]^2/([H2][I2]) lands on ~one number every time;
// the master refrain "temperature nahi badla => K nahi badlega" (one value per temperature).
// §5.X audited: no "Not X. It is Y." pairs, <=1 em-dash/para, plain SVO, say-it-once,
// no reveal framing, no triple-repetition, hedged "you".
module.exports = {
  page_number: 6,
  slug: 'equilibrium-constant-kc',
  title: 'The Equilibrium Constant, Kc',
  subtitle: 'Putting a number on how far a reaction goes.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. Three sealed glass flasks in a row, each started with a different mix of purple iodine vapour and pale hydrogen gas, all reaching the same steady purple shade. Below the flasks a faint hand-lettered fraction [HI]^2 over [H2][I2] with a small note "lands on the same number". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Three Different Starts, One Steady Number',
        "Chemists once ran the $\\ce{H2 + I2 <=> 2HI}$ reaction six separate times, each with a different amount of hydrogen and iodine to begin with. The flasks ended up with different amounts of everything. Yet when they fed the equilibrium amounts into one particular fraction, every flask gave back almost the same value, around 47. That single number is the fingerprint of the reaction at that temperature."),
      h.text(
        "You can see *that* a reaction has reached equilibrium when its amounts stop changing. The harder question is *how far* it went before it stalled. Did it run almost to completion, or did it stop early with most of the reactant untouched? You want one number that answers this for any reaction.\n\n" +
        "That number comes from the **reaction quotient**. Think of it the way an IQ score stands in for intelligence: the reaction quotient stands in for how far the reaction has travelled. For a general reaction\n\n" +
        "$$aA + bB \\rightleftharpoons cC + dD$$\n\n" +
        "you build the quotient by putting the products on top and the reactants on the bottom, each concentration raised to the power of its coefficient in the balanced equation:\n\n" +
        "$$Q = \\frac{[C]^c [D]^d}{[A]^a [B]^b}$$\n\n" +
        "At the start, with barely any product made, $Q$ is close to zero. As the reaction proceeds, $Q$ climbs. Once the reaction reaches equilibrium, $Q$ stops climbing and settles on a fixed value. That settled value gets its own name: the **equilibrium constant**, written $K_c$. The little $c$ reminds you the concentrations are in $\\text{mol L}^{-1}$."
      ),
      h.heading('The law of chemical equilibrium', 'Write $K_c$ for any balanced reaction and read what the experiment proves about it.'),
      h.text(
        "Two Norwegian chemists, Guldberg and Waage, spotted this pattern back in 1864 and named it the **law of mass action**. Stated plainly: at a given temperature, the products' concentrations (each raised to its coefficient) divided by the reactants' concentrations (each raised to its coefficient) always work out to the same value.\n\n" +
        "$$K_c = \\frac{[C]^c [D]^d}{[A]^a [B]^b}$$\n\n" +
        "Look at why this is believable. For $\\ce{H2 + I2 <=> 2HI}$, the six experiments started from very different mixtures, four with pure $\\ce{H2}$ and $\\ce{I2}$ and two with pure $\\ce{HI}$. If you take the crude ratio $\\frac{[\\ce{HI}]}{[\\ce{H2}][\\ce{I2}]}$, the six values are all over the place, from 790 to 1970. The moment you use the *correct* powers from the balanced equation, $\\frac{[\\ce{HI}]^2}{[\\ce{H2}][\\ce{I2}]}$, the six values collapse to nearly one number, about 47. The powers are the stoichiometric coefficients, and putting them in is what makes the ratio constant.\n\n" +
        "Here is the rule worth holding onto: as long as you do not change the temperature, $K_c$ does not change. One reaction, one temperature, one value of $K_c$."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. A single line graph drawn like a chemist sketched it in a notebook. Vertical axis hand-lettered "concentration", horizontal axis hand-lettered "time". Two curves: a falling curve labelled "H2, I2" that starts high and levels off, and a rising curve labelled "HI" that starts at zero and levels off higher, both flattening to constant heights after a dashed vertical line marked "equilibrium". To the right of the flat region a boxed hand-lettered expression "Kc = [HI]^2 / ([H2][I2])" with a small note "constant once flat". The reaction "H2 + I2 <=> 2HI" hand-lettered along the top. Neat hand-lettered labels, clean science-notebook feel.',
        '16:9',
        'As H₂ and I₂ are used up and HI builds, the concentrations level off — and from that flat region the fraction [HI]²/([H₂][I₂]) is the constant Kc.'
      ),
      h.worked('Problem 7.1', 'solved_example',
        "The following concentrations were obtained for the formation of $\\ce{NH3}$ from $\\ce{N2}$ and $\\ce{H2}$ at equilibrium at 500 K: $[\\ce{N2}] = 1.5 \\times 10^{-2}$ M, $[\\ce{H2}] = 3.0 \\times 10^{-2}$ M and $[\\ce{NH3}] = 1.2 \\times 10^{-2}$ M. Calculate the equilibrium constant.",
        "**Step 1 — Write $K_c$ for the balanced reaction.** For $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$, the ammonia coefficient is 2 and the hydrogen coefficient is 3:\n\n" +
        "$$K_c = \\frac{[\\ce{NH3}]^2}{[\\ce{N2}][\\ce{H2}]^3}$$\n\n" +
        "**Step 2 — Put the values in.**\n\n" +
        "$$K_c = \\frac{(1.2 \\times 10^{-2})^2}{(1.5 \\times 10^{-2})(3.0 \\times 10^{-2})^3}$$\n\n" +
        "**Step 3 — Evaluate.** The top is $1.44 \\times 10^{-4}$. The bottom is $(1.5 \\times 10^{-2}) \\times (2.7 \\times 10^{-5}) = 4.05 \\times 10^{-7}$.\n\n" +
        "$$K_c = \\frac{1.44 \\times 10^{-4}}{4.05 \\times 10^{-7}} = 1.06 \\times 10^{3}$$\n\n" +
        "**Answer:** $K_c = 1.06 \\times 10^{3}$ (its units depend on the powers, covered on the next page).",
        'tap_to_reveal'),
      h.worked('Problem 7.2', 'solved_example',
        "At equilibrium, the concentrations of $\\ce{N2} = 3.0 \\times 10^{-3}$ M, $\\ce{O2} = 4.2 \\times 10^{-3}$ M and $\\ce{NO} = 2.8 \\times 10^{-3}$ M in a sealed vessel at 800 K. What will be $K_c$ for the reaction $\\ce{N2(g) + O2(g) <=> 2NO(g)}$?",
        "**Step 1 — Write $K_c$.** The $\\ce{NO}$ coefficient is 2; $\\ce{N2}$ and $\\ce{O2}$ are each 1:\n\n" +
        "$$K_c = \\frac{[\\ce{NO}]^2}{[\\ce{N2}][\\ce{O2}]}$$\n\n" +
        "**Step 2 — Put the values in.**\n\n" +
        "$$K_c = \\frac{(2.8 \\times 10^{-3})^2}{(3.0 \\times 10^{-3})(4.2 \\times 10^{-3})}$$\n\n" +
        "**Step 3 — Evaluate.** Top: $7.84 \\times 10^{-6}$. Bottom: $1.26 \\times 10^{-5}$.\n\n" +
        "$$K_c = \\frac{7.84 \\times 10^{-6}}{1.26 \\times 10^{-5}} = 0.622$$\n\n" +
        "**Answer:** $K_c = 0.622$. Here the powers on top and bottom match (two and two), so this $K_c$ has no units.",
        'tap_to_reveal'),
      h.worked('Problem 7.3', 'solved_example',
        "$\\ce{PCl5}$, $\\ce{PCl3}$ and $\\ce{Cl2}$ are at equilibrium at 500 K with concentrations $1.59$ M $\\ce{PCl3}$, $1.59$ M $\\ce{Cl2}$ and $1.41$ M $\\ce{PCl5}$. Calculate $K_c$ for the reaction $\\ce{PCl5 <=> PCl3 + Cl2}$.",
        "**Step 1 — Write $K_c$.** Every coefficient is 1, so no powers above 1 appear:\n\n" +
        "$$K_c = \\frac{[\\ce{PCl3}][\\ce{Cl2}]}{[\\ce{PCl5}]}$$\n\n" +
        "**Step 2 — Put the values in.**\n\n" +
        "$$K_c = \\frac{(1.59)(1.59)}{1.41}$$\n\n" +
        "**Step 3 — Evaluate.** Top: $1.59 \\times 1.59 = 2.528$.\n\n" +
        "$$K_c = \\frac{2.528}{1.41} = 1.79$$\n\n" +
        "**Answer:** $K_c = 1.79$ M (one extra concentration on top, so the unit is $\\text{mol L}^{-1}$).",
        'tap_to_reveal'),
      h.reasoning('quantitative',
        "For $\\ce{H2 + I2 <=> 2HI}$ at one temperature, a student first computes the crude ratio $\\frac{[\\ce{HI}]}{[\\ce{H2}][\\ce{I2}]}$ from two flasks that started differently, and gets 1840 in one and 790 in the other. They conclude the reaction has no fixed equilibrium constant. Where did they go wrong?",
        [
          "They are right — the equilibrium constant genuinely changes from flask to flask",
          "They forgot the power: the constant ratio is $\\frac{[\\ce{HI}]^2}{[\\ce{H2}][\\ce{I2}]}$, using the coefficient 2 on HI, and that lands near 47 for both flasks",
          "The two flasks were at different temperatures, which is the only reason the numbers differ",
          "They should have put the reactants on top and the product on the bottom instead",
        ], 1,
        "The law of mass action uses the stoichiometric coefficients as powers. $\\ce{HI}$ has coefficient 2, so the concentration of $\\ce{HI}$ must be squared. The crude first-power ratio is not the equilibrium constant, and it drifts from flask to flask. Square the $\\ce{HI}$ term and both flasks give close to 47, the true $K_c$ at that temperature.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Writing Kc Correctly',
        "- **Products on top, reactants on the bottom**, each concentration raised to its **balancing coefficient**. For $aA + bB \\rightleftharpoons cC + dD$: $K_c = \\frac{[C]^c [D]^d}{[A]^a[B]^b}$.\n" +
        "- The number depends entirely on **how you wrote the equation**. Double the coefficients and $K_c$ becomes $K_c^2$; reverse the reaction and it becomes $1/K_c$. Always quote the equation with the value.\n" +
        "- **One temperature gives one $K_c$.** A given numerical's whole trick is often this: temperature unchanged, so set the before-$K$ equal to the after-$K$.\n" +
        "- **Classic trap:** $K_c$ does not tell you the *speed* of the reaction. A large $K_c$ means products dominate at equilibrium, not that equilibrium arrives quickly."),
      h.quiz([
        {
          question: "For the reaction $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$, the correct expression for $K_c$ is:",
          options: [
            "$\\frac{[\\ce{NH3}]^2}{[\\ce{N2}][\\ce{H2}]^3}$",
            "$\\frac{[\\ce{N2}][\\ce{H2}]^3}{[\\ce{NH3}]^2}$",
            "$\\frac{[\\ce{NH3}]}{[\\ce{N2}][\\ce{H2}]}$",
            "$\\frac{2[\\ce{NH3}]}{[\\ce{N2}] + 3[\\ce{H2}]}$",
          ], correct_index: 0,
          explanation: "Products go on top and reactants on the bottom, each raised to its coefficient: $\\ce{NH3}$ squared on top, $\\ce{N2}$ to the first power and $\\ce{H2}$ cubed on the bottom. The coefficients become powers, never added together as the last option does.",
        },
        {
          question: "Six flasks run $\\ce{H2 + I2 <=> 2HI}$ from different starting amounts at the same temperature. Which quantity comes out the same for all six?",
          options: [
            "The final concentration of $\\ce{HI}$ in each flask",
            "The crude ratio $\\frac{[\\ce{HI}]}{[\\ce{H2}][\\ce{I2}]}$",
            "The fraction $\\frac{[\\ce{HI}]^2}{[\\ce{H2}][\\ce{I2}]}$",
            "The total mass of gas in each flask",
          ], correct_index: 2,
          explanation: "The equilibrium amounts differ from flask to flask, so the individual $\\ce{HI}$ concentration is not shared. The crude first-power ratio drifts too. Only the proper expression with $\\ce{HI}$ squared stays constant, because that is the equilibrium constant for the fixed temperature.",
        },
        {
          question: "Which statement about $K_c$ is correct?",
          options: [
            "A large $K_c$ means the reaction reaches equilibrium very fast",
            "$K_c$ keeps the same value as long as the temperature is unchanged",
            "$K_c$ has the same value no matter how the equation is written",
            "$K_c$ is always a number without any units",
          ], correct_index: 1,
          explanation: "$K_c$ is fixed for a given reaction at a given temperature. It says nothing about speed, so a large value does not mean a fast reaction. Its value and its units both depend on how the equation is written, so the other options fail.",
        },
      ]),
    ];
  },
};
