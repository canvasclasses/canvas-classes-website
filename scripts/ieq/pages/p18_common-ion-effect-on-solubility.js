// IEQ page 18 — Common-ion effect on solubility + precipitation (NCERT §7.13.2, PDF pp. 221-222).
// Sub-topic: adding a common ion to a saturated solution of a sparingly soluble salt lowers
//   its solubility (Le Chatelier — the added ion pushes the dissolution equilibrium back, so
//   some salt precipitates out). Precipitation begins when the ionic product Q (IP) exceeds Ksp:
//     IP < Ksp -> unsaturated (more dissolves); IP = Ksp -> saturated (the threshold);
//     IP > Ksp -> supersaturated (precipitate forms).
//   Selective / fractional precipitation: with two salts sharing an ion, compute the threshold
//   concentration of the added ion for each; the one needing less precipitates first
//   (AgCl before Ag2CrO4).
// Folds NCERT Problem 7.28 (molar solubility of Ni(OH)2 in 0.10 M NaOH, Ksp = 2.0e-15
//   -> S = 2.0e-13 M, far below the value in pure water). Arithmetic verified against PDF p.222.
// Voice: teacher-voice-profile + IEQ-exemplars. HIS points (used, not invented):
//   - B: precipitation trigger is ionic product = Ksp; "the moment the ion concentration crosses
//        that value, precipitation starts."
//   - D24: AgCl precipitates before Ag2CrO4 because it needs less Ag+ to cross its Ksp.
//   - C ("common ion != everywhere"): the effect needs a real dissolution equilibrium to act on.
// §5.X audited: no "Not X. It is Y." pairs; no banned metaphors ("two-way traffic"/"living
//   balance"); <=1 em-dash/para; plain SVO; say-it-once; second person; analogy-first with HIS
//   framing; no reveal framing; no intensifier-stacking; no triple-repetition; no universal claims.
module.exports = {
  page_number: 18,
  slug: 'common-ion-effect-on-solubility',
  title: 'Common-Ion Effect on Solubility and Precipitation',
  subtitle: 'Forcing a salt out of solution.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, science-notebook feel. Ultra-wide cinematic banner. A beaker drawn like a chemist sketched it, holding a clear saturated salt solution with a few free ion symbols floating in it; from the right a dropper adds a stream of identical ions of one kind into the beaker, and in response a small cloud of white solid begins to settle at the bottom. A faint hand-lettered note to the side: "add more of one ion, and the salt drops out". Calm, uncluttered, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Crowding a Salt Out',
        "A street vendor with only so much space can hold a fixed crowd of customers. Push more people of one kind into that fixed space and some of the others have to leave. A saturated salt solution behaves the same way. It is already holding all the ions it can, so adding more of one ion forces some of the salt to fall out as a solid. That single idea is behind purifying common salt, separating metals in the lab, and a good handful of exam questions."),
      h.text(
        "On the last page you saw that a sparingly soluble salt sits in equilibrium with its dissolved ions:\n\n" +
        "$$\\ce{AgCl(s) <=> Ag+ + Cl-}$$\n\n" +
        "Now add a **common ion**, an ion this salt already produces. Drip some $\\ce{NaCl}$ solution in, and you pour extra $\\ce{Cl-}$ into the mix. By Le Chatelier's principle the equilibrium answers the rise in $\\ce{Cl-}$ by shifting to the left, back toward solid $\\ce{AgCl}$. Some dissolved silver chloride comes out as a precipitate, and the amount that stays dissolved drops. This is the **common-ion effect on solubility**: adding an ion the salt shares lowers how much of that salt can dissolve.\n\n" +
        "One caution before you reach for this. The effect needs a genuine dissolution equilibrium to push on. A salt like $\\ce{NaCl}$ in water is fully soluble with no solid left over, so there is no equilibrium to shift and no common-ion story to tell. Save the reasoning for the sparingly soluble salts, where a solid actually sits in balance with its ions."
      ),
      h.heading('The precipitation trigger: ionic product versus $K_{sp}$',
        'Use the ionic product $Q$ against $K_{sp}$ to decide whether a solution is unsaturated, just saturated, or about to precipitate.'),
      h.text(
        "To know whether a precipitate will actually form, compare two numbers. One is $K_{sp}$, the fixed solubility product of the salt. The other is the **ionic product** $Q$ (also written $IP$), worked out from the ion concentrations you have in the beaker right now, using the same expression as $K_{sp}$ but with the current values rather than the equilibrium ones. Reading $Q$ against $K_{sp}$ tells you the state of the solution:\n\n" +
        "- $Q < K_{sp}$ — **unsaturated**. The solution can hold more, so any solid added keeps dissolving.\n" +
        "- $Q = K_{sp}$ — **just saturated**. This is the threshold, the dividing line.\n" +
        "- $Q > K_{sp}$ — **supersaturated**. The solution is over its limit, so the excess falls out as a precipitate until $Q$ drops back to $K_{sp}$.\n\n" +
        "So precipitation begins the instant $Q$ crosses $K_{sp}$. The moment the ion concentration in solution pushes $Q$ past that value, the salt starts coming out. When you add a common ion, you raise one of the concentrations in $Q$, drive $Q$ above $K_{sp}$, and trigger exactly this."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, clean science-notebook feel. Two linked sketches side by side. LEFT: a beaker holding a saturated salt solution hand-lettered "AgCl(s) <=> Ag+ + Cl-", with a dropper adding extra "Cl-" ions from a bottle labelled "NaCl"; a bold leftward arrow over the equation shows the equilibrium shifting back, and a small heap of white solid settling at the bottom hand-lettered "AgCl precipitates". RIGHT: a clean horizontal number line for the ionic product, with a marked point in the middle hand-lettered "Q = Ksp (saturated)", the region to its left hand-lettered "Q < Ksp: unsaturated, more dissolves", and the region to its right hand-lettered "Q > Ksp: precipitate forms". Warm ink colours, no large text blocks.',
        '16:9',
        'Adding a common ion (extra Cl⁻ from NaCl) pushes the AgCl equilibrium left, so solid precipitates. On the ionic-product number line, the salt stays dissolved while Q < Kₛₚ, sits at the threshold when Q = Kₛₚ, and precipitates once Q > Kₛₚ.'
      ),
      h.worked('Problem 7.28 (NCERT)', 'ncert_intext',
        "Calculate the molar solubility of $\\ce{Ni(OH)2}$ in $0.10$ M $\\ce{NaOH}$. The ionic product of $\\ce{Ni(OH)2}$ is $2.0 \\times 10^{-15}$.",
        "**Step 1 — write the dissolution.** Let the solubility of $\\ce{Ni(OH)2}$ in this solution be $S$. Dissolving $S$ mol/L gives:\n\n" +
        "$$\\ce{Ni(OH)2 <=> Ni^{2+} + 2OH-}$$\n\n" +
        "$$[\\ce{Ni^{2+}}] = S$$\n\n" +
        "**Step 2 — account for the common ion.** The $\\ce{NaOH}$ already supplies $0.10$ M $\\ce{OH-}$, and the dissolving salt adds $2S$ more. So the total hydroxide is:\n\n" +
        "$$[\\ce{OH-}] = (0.10 + 2S)$$\n\n" +
        "**Step 3 — substitute into $K_{sp}$.**\n\n" +
        "$$K_{sp} = [\\ce{Ni^{2+}}][\\ce{OH-}]^2 = (S)(0.10 + 2S)^2 = 2.0 \\times 10^{-15}$$\n\n" +
        "**Step 4 — simplify.** $K_{sp}$ is tiny, so $S$ is tiny and $2S$ is negligible beside $0.10$. Take $(0.10 + 2S) \\approx 0.10$:\n\n" +
        "$$2.0 \\times 10^{-15} = S\\,(0.10)^2 = S\\,(0.01)$$\n\n" +
        "**Step 5 — solve for $S$.**\n\n" +
        "$$S = \\frac{2.0 \\times 10^{-15}}{0.01} = 2.0 \\times 10^{-13}\\ \\text{M}$$\n\n" +
        "**Answer:** $S = [\\ce{Ni^{2+}}] = 2.0 \\times 10^{-13}$ M. Compare this with the solubility in pure water, where $4S^3 = 2.0 \\times 10^{-15}$ gives $S \\approx 7.9 \\times 10^{-6}$ M. The $\\ce{OH-}$ already present has pushed the solubility down by about ten million times. That is the common-ion effect doing its work.",
        'tap_to_reveal'),
      h.text(
        "The same trigger lets you separate two ions on purpose. Suppose a solution holds both $\\ce{Cl-}$ and $\\ce{CrO4^{2-}}$, and you slowly add $\\ce{Ag+}$. Both could precipitate, as $\\ce{AgCl}$ ($K_{sp} = 1.8 \\times 10^{-10}$) and as $\\ce{Ag2CrO4}$ ($K_{sp} = 1.1 \\times 10^{-12}$). Which falls out first? Work out the $\\ce{Ag+}$ concentration each one needs to reach its own $K_{sp}$, and the salt with the lower threshold crosses its line sooner. This is **selective** or **fractional precipitation**, and it is the backbone of separating ions in the lab."
      ),
      h.worked('Selective precipitation — which salt drops first', 'solved_example',
        "A solution contains $0.010$ M $\\ce{Cl-}$ and $0.010$ M $\\ce{CrO4^{2-}}$. $\\ce{Ag+}$ is added slowly. Given $K_{sp}(\\ce{AgCl}) = 1.8 \\times 10^{-10}$ and $K_{sp}(\\ce{Ag2CrO4}) = 1.1 \\times 10^{-12}$, which salt precipitates first?",
        "**Find the $\\ce{Ag+}$ that each salt needs to start precipitating.** Each salt begins to come out when its ionic product first reaches its $K_{sp}$.\n\n" +
        "**For $\\ce{AgCl}$:** $K_{sp} = [\\ce{Ag+}][\\ce{Cl-}]$, so\n\n" +
        "$$[\\ce{Ag+}] = \\frac{K_{sp}}{[\\ce{Cl-}]} = \\frac{1.8 \\times 10^{-10}}{0.010} = 1.8 \\times 10^{-8}\\ \\text{M}$$\n\n" +
        "**For $\\ce{Ag2CrO4}$:** $K_{sp} = [\\ce{Ag+}]^2[\\ce{CrO4^{2-}}]$, so\n\n" +
        "$$[\\ce{Ag+}] = \\sqrt{\\frac{K_{sp}}{[\\ce{CrO4^{2-}}]}} = \\sqrt{\\frac{1.1 \\times 10^{-12}}{0.010}} = \\sqrt{1.1 \\times 10^{-10}} = 1.05 \\times 10^{-5}\\ \\text{M}$$\n\n" +
        "**Compare the thresholds.** $\\ce{AgCl}$ needs only $1.8 \\times 10^{-8}$ M $\\ce{Ag+}$, while $\\ce{Ag2CrO4}$ needs $1.05 \\times 10^{-5}$ M, about a thousand times more.\n\n" +
        "**Answer:** $\\ce{AgCl}$ precipitates first, because the $\\ce{Ag+}$ concentration crosses its $K_{sp}$ while it is still far below the level $\\ce{Ag2CrO4}$ requires. By the time enough $\\ce{Ag+}$ has been added to start the chromate, almost all the chloride is already out of solution.",
        'tap_to_reveal'),
      h.reasoning('logical',
        "A saturated solution of $\\ce{AgCl}$ is sitting with some solid at the bottom. You add a few drops of concentrated $\\ce{NaCl}$ solution. A student says: \"$\\ce{NaCl}$ is very soluble, so adding it will dissolve the $\\ce{AgCl}$ as well.\" What actually happens, and why?",
        [
          "The $\\ce{AgCl}$ dissolves further, because more ions in solution always means more dissolving",
          "More $\\ce{AgCl}$ precipitates, because the added $\\ce{Cl-}$ raises the ionic product above $K_{sp}$ and pushes the equilibrium back toward solid",
          "Nothing changes, because $\\ce{NaCl}$ and $\\ce{AgCl}$ share no ions",
          "The solution turns basic, because $\\ce{NaCl}$ is a salt of a strong base",
        ], 1,
        "The $\\ce{NaCl}$ pours extra $\\ce{Cl-}$ into a solution that is already saturated in $\\ce{AgCl}$. That raises the ionic product $[\\ce{Ag+}][\\ce{Cl-}]$ above $K_{sp}$, so by Le Chatelier the equilibrium $\\ce{AgCl(s) <=> Ag+ + Cl-}$ shifts left and more solid $\\ce{AgCl}$ drops out. The student has confused the solubility of $\\ce{NaCl}$ with the behaviour of $\\ce{AgCl}$. The shared $\\ce{Cl-}$ ion is the whole point, so the claim that they share no ions is also wrong.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Common Ion and Precipitation',
        "- **Common-ion effect on solubility:** adding an ion the salt already produces lowers its solubility. The extra ion shifts the dissolution equilibrium back, and some salt precipitates.\n" +
        "- **The precipitation trigger is $Q = K_{sp}$.** Compute the ionic product $Q$ from the concentrations in hand. $Q < K_{sp}$ means unsaturated, $Q = K_{sp}$ means just saturated, $Q > K_{sp}$ means a precipitate forms. Precipitation starts the moment $Q$ crosses $K_{sp}$.\n" +
        "- **In a common-ion solubility problem, the common ion has two sources.** For $\\ce{Ni(OH)2}$ in $\\ce{NaOH}$, $[\\ce{OH-}] = (0.10 + 2S)$, and since $S$ is tiny you approximate it to $0.10$. Check that the approximation holds before using it.\n" +
        "- **Selective precipitation:** find the added-ion concentration each salt needs to hit its own $K_{sp}$. The salt with the lower threshold precipitates first (so $\\ce{AgCl}$ comes out before $\\ce{Ag2CrO4}$).\n" +
        "- **Common ion needs an equilibrium.** A fully soluble salt like $\\ce{NaCl}$ in water has no solid in balance, so there is no common-ion effect to invoke."),
      h.quiz([
        {
          question: "Solid $\\ce{AgCl}$ is in equilibrium with its saturated solution. Adding a few drops of $\\ce{NaCl}$ solution will:",
          options: [
            "increase the solubility of $\\ce{AgCl}$",
            "decrease the solubility of $\\ce{AgCl}$ and precipitate some out",
            "have no effect, since $K_{sp}$ is a constant",
            "raise the $K_{sp}$ of $\\ce{AgCl}$",
          ], correct_index: 1,
          explanation: "The $\\ce{NaCl}$ adds the common ion $\\ce{Cl-}$. This raises the ionic product above $K_{sp}$, so the equilibrium $\\ce{AgCl(s) <=> Ag+ + Cl-}$ shifts left and some $\\ce{AgCl}$ precipitates, lowering its solubility. $K_{sp}$ itself stays fixed at a given temperature, so the option claiming it rises is wrong.",
        },
        {
          question: "For a sparingly soluble salt, a precipitate begins to form exactly when the ionic product $Q$ satisfies:",
          options: [
            "$Q < K_{sp}$",
            "$Q = K_{sp}$",
            "$Q = 0$",
            "$Q = 2K_{sp}$ only",
          ], correct_index: 1,
          explanation: "While $Q < K_{sp}$ the solution is unsaturated and holds more salt. The threshold is $Q = K_{sp}$, the just-saturated point. The instant the concentrations push $Q$ past this value, the solution is supersaturated and the excess salt comes out, so precipitation begins right at $Q = K_{sp}$.",
        },
        {
          question: "A solution holds $0.01$ M $\\ce{Cl-}$ and $0.01$ M $\\ce{CrO4^{2-}}$. Silver ion is added slowly. With $K_{sp}(\\ce{AgCl}) = 1.8 \\times 10^{-10}$ and $K_{sp}(\\ce{Ag2CrO4}) = 1.1 \\times 10^{-12}$, which precipitates first?",
          options: [
            "$\\ce{Ag2CrO4}$, because it has the smaller $K_{sp}$",
            "$\\ce{AgCl}$, because it needs a much lower $\\ce{Ag+}$ concentration to reach its $K_{sp}$",
            "Both precipitate together at the same $\\ce{Ag+}$ concentration",
            "Neither, because the chromate keeps the chloride dissolved",
          ], correct_index: 1,
          explanation: "Compare the $\\ce{Ag+}$ each salt needs. $\\ce{AgCl}$ needs $[\\ce{Ag+}] = K_{sp}/[\\ce{Cl-}] = 1.8 \\times 10^{-8}$ M, while $\\ce{Ag2CrO4}$ needs $[\\ce{Ag+}] = \\sqrt{K_{sp}/[\\ce{CrO4^{2-}}]} = 1.05 \\times 10^{-5}$ M. $\\ce{AgCl}$ crosses its threshold at a far lower $\\ce{Ag+}$, so it precipitates first. Reading off the smaller $K_{sp}$ alone misleads here, because the two salts give different numbers of ions.",
        },
      ]),
    ];
  },
};
