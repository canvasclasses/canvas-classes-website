// IEQ page 17 — The Solubility Product, Ksp (NCERT §7.13.1, PDF pp. 220-222).
// For a sparingly soluble salt M_xX_y(s) <=> x M^{y+} + y X^{x-}, the solubility product is
//   Ksp = [M^{y+}]^x [X^{x-}]^y  (the solid's concentration is constant, so it drops out).
// Relating Ksp to molar solubility S: general form Ksp = x^x y^y S^(x+y); derive 4S^3 for MX2
//   and 27S^4 for MX3 families from it.
// Comparing solubilities: you cannot read solubility straight off Ksp; convert each Ksp to S
//   first, because the order can flip.
// Folds NCERT Problem 7.26 (solubility of A2X3 from Ksp = 1.1e-23 -> S = 1.0e-5 mol/L) and
//   Problem 7.27 (compare Ni(OH)2 Ksp = 2.0e-15 vs AgCN Ksp = 6e-17 -> Ni(OH)2 more soluble).
//   Arithmetic verified against the NCERT PDF (pp. 221-222).
// Voice: teacher-voice-profile + IEQ-exemplars. HIS points (used, not invented):
//   - A: the money-ledger for dissolution (lattice = cost, hydration = return; dissolves only
//     when hydration pays back more than the lattice cost, "Rs 50 spent, Rs 60 back, Rs 10 profit").
//   - B: Ksp general form for AxBy = x^x y^y S^(x+y); derive 4S^3, 27S^4 from it, don't memorise.
//   - C/D24: the trap "smallest Ksp != smallest solubility -- convert to S first".
// §5.X audited: no "Not X. It is Y." pairs; no banned metaphors; <=1 em-dash/para; plain SVO;
// say-it-once; second person; analogy-first with HIS analogy; no reveal framing; no
// intensifier-stacking; no triple-repetition; no universal claims.
module.exports = {
  page_number: 17,
  slug: 'solubility-product-ksp',
  title: 'The Solubility Product, Ksp',
  subtitle: "How much of an 'insoluble' salt really dissolves.",
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, science-notebook feel. Ultra-wide cinematic banner. A beaker drawn like a chemist sketched it, with a small heap of undissolved white salt resting at the bottom and a few ion symbols (a plus charge and a minus charge) floating up into the clear liquid above, with tiny double-headed arrows between the solid and the dissolved ions. A faint hand-lettered note to the side: "only a little dissolves, the rest sits in balance with it". Calm, uncluttered, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', "No Salt Is Truly Insoluble",
        "The label \"insoluble\" is a convenience, not the truth. Even a salt like silver chloride that we shrug off as insoluble does dissolve, only by a vanishingly small amount, a few millionths of a gram per litre. A tiny number of its ions are always floating free in the water, in balance with the solid sitting at the bottom. The job of this page is to put a number on exactly how much."),
      h.text(
        "Whether a salt dissolves at all comes down to a balance of two energies. Breaking the solid apart costs energy, the **lattice energy**, the price of pulling the packed ions away from each other. Surrounding those freed ions with water pays energy back, the **hydration energy**. Think of it as a money ledger: if you spend $\\textsf{₹}50$ breaking the lattice and water returns $\\textsf{₹}60$ by hydrating the ions, you come out $\\textsf{₹}10$ ahead, so the salt dissolves. When the return falls short of the cost, the salt stays put and we call it sparingly soluble.\n\n" +
        "For a sparingly soluble salt only a little dissolves, and what does dissolve sits in equilibrium with the solid:\n\n" +
        "$$\\ce{M_xX_y(s) <=> x M^{y+} + y X^{x-}}$$\n\n" +
        "Write the equilibrium constant for this. The solid $\\ce{M_xX_y}$ is a pure solid, so its concentration is constant and drops out, leaving only the dissolved ions:\n\n" +
        "$$K_{sp} = [\\ce{M^{y+}}]^x [\\ce{X^{x-}}]^y$$\n\n" +
        "This is the **solubility product**, $K_{sp}$. Each ion concentration is raised to its coefficient in the dissolution equation, exactly as you did for $K_c$."
      ),
      h.heading('From $K_{sp}$ to solubility $S$ — one general form',
        'Relate $K_{sp}$ to molar solubility $S$ with the general $x^x y^y S^{(x+y)}$ form, and derive the $4S^3$ and $27S^4$ cases from it.'),
      h.text(
        "The **molar solubility** $S$ is how many moles of the salt dissolve per litre of saturated solution. Tie it to $K_{sp}$ through the dissolution equation. If $S$ mol/L of $\\ce{M_xX_y}$ dissolves, it releases $xS$ of the cation and $yS$ of the anion. Put these into the $K_{sp}$ expression:\n\n" +
        "$$K_{sp} = (xS)^x (yS)^y = x^x\\, y^y\\, S^{(x+y)}$$\n\n" +
        "That one line is the general form. Two families come straight out of it:\n\n" +
        "- **A $\\ce{MX2}$ salt** (like $\\ce{Mg(OH)2}$): here $x = 1$, $y = 2$, so $K_{sp} = 1^1 \\cdot 2^2 \\cdot S^{3} = 4S^3$.\n" +
        "- **A $\\ce{MX3}$ salt** (like $\\ce{Fe(OH)3}$): here $x = 1$, $y = 3$, so $K_{sp} = 1^1 \\cdot 3^3 \\cdot S^{4} = 27S^4$.\n\n" +
        "There is no need to memorise $4S^3$ and $27S^4$ as separate facts. Read off $x$ and $y$ from the formula, drop them into $x^x y^y S^{(x+y)}$, and the case falls out. To go the other way, from $K_{sp}$ to $S$, rearrange:\n\n" +
        "$$S = \\left(\\frac{K_{sp}}{x^x\\, y^y}\\right)^{\\frac{1}{x+y}}$$"
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, clean science-notebook feel. A single beaker drawn like a chemist sketched it in a notebook: a layer of undissolved solid salt at the bottom hand-lettered "M_x X_y (s)", a double-headed equilibrium arrow rising from it, and above it the dissolved ions hand-lettered "x M^{y+}" and "y X^{x-}" scattered in the liquid, marked "saturated solution". To the right of the beaker a boxed hand-lettered relation "Ksp = [M^{y+}]^x [X^{x-}]^y = x^x y^y S^(x+y)" with two small worked notes beneath it: "MX2 -> 4S^3" and "MX3 -> 27S^4". Warm ink colours, no large text blocks.',
        '16:9',
        'A saturated solution sits in equilibrium with undissolved solid. Kₛₚ is the product of the ion concentrations, each raised to its coefficient — and in terms of molar solubility S it becomes xˣyʸS^(x+y), giving 4S³ for MX₂ and 27S⁴ for MX₃.'
      ),
      h.worked('Problem 7.26 (NCERT)', 'ncert_intext',
        "Calculate the solubility of $\\ce{A2X3}$ in pure water, assuming that neither kind of ion reacts with water. The solubility product of $\\ce{A2X3}$ is $K_{sp} = 1.1 \\times 10^{-23}$.",
        "**Step 1 — write the dissolution.** $\\ce{A2X3 -> 2A^{3+} + 3X^{2-}}$\n\n" +
        "**Step 2 — express the ion concentrations in $S$.** If the solubility is $S$, then dissolving $S$ mol/L gives:\n\n" +
        "$$[\\ce{A^{3+}}] = 2S, \\qquad [\\ce{X^{2-}}] = 3S$$\n\n" +
        "**Step 3 — substitute into $K_{sp}$.** Here $x = 2$, $y = 3$:\n\n" +
        "$$K_{sp} = [\\ce{A^{3+}}]^2 [\\ce{X^{2-}}]^3 = (2S)^2 (3S)^3 = 4S^2 \\cdot 27S^3 = 108\\,S^5$$\n\n" +
        "**Step 4 — solve for $S$.**\n\n" +
        "$$108\\,S^5 = 1.1 \\times 10^{-23}$$\n\n" +
        "$$S^5 = 1.0 \\times 10^{-25}$$\n\n" +
        "$$S = 1.0 \\times 10^{-5}\\ \\text{mol/L}$$\n\n" +
        "**Answer:** $S = 1.0 \\times 10^{-5}$ mol/L. Notice this is just the general form with $x = 2$, $y = 3$, giving $K_{sp} = 2^2 \\cdot 3^3 \\cdot S^5 = 108\\,S^5$.",
        'tap_to_reveal'),
      h.worked('Problem 7.27 (NCERT)', 'ncert_intext',
        "The values of $K_{sp}$ of two sparingly soluble salts $\\ce{Ni(OH)2}$ and $\\ce{AgCN}$ are $2.0 \\times 10^{-15}$ and $6 \\times 10^{-17}$ respectively. Which salt is more soluble? Explain.",
        "**Do not compare the $K_{sp}$ values directly.** The two salts release different numbers of ions, so the smaller $K_{sp}$ need not mean the smaller solubility. Convert each $K_{sp}$ to a solubility $S$ first.\n\n" +
        "**Salt 1 — $\\ce{AgCN}$.** $\\ce{AgCN <=> Ag+ + CN-}$, so with solubility $S_1$, $[\\ce{Ag+}] = [\\ce{CN-}] = S_1$:\n\n" +
        "$$K_{sp} = S_1^2 = 6 \\times 10^{-17}$$\n\n" +
        "$$S_1 = 7.8 \\times 10^{-9}\\ \\text{mol/L}$$\n\n" +
        "**Salt 2 — $\\ce{Ni(OH)2}$.** $\\ce{Ni(OH)2 <=> Ni^{2+} + 2OH-}$, so with solubility $S_2$, $[\\ce{Ni^{2+}}] = S_2$ and $[\\ce{OH-}] = 2S_2$:\n\n" +
        "$$K_{sp} = (S_2)(2S_2)^2 = 4S_2^3 = 2.0 \\times 10^{-15}$$\n\n" +
        "$$S_2^3 = 0.5 \\times 10^{-15}$$\n\n" +
        "$$S_2 = 0.58 \\times 10^{-4}\\ \\text{mol/L}$$\n\n" +
        "**Compare the solubilities.** $S_2 = 0.58 \\times 10^{-4}$ mol/L is far larger than $S_1 = 7.8 \\times 10^{-9}$ mol/L.\n\n" +
        "**Answer:** $\\ce{Ni(OH)2}$ is more soluble than $\\ce{AgCN}$, even though its $K_{sp}$ is the larger number. The order flipped because the two salts give different numbers of ions, so only the converted $S$ values can be compared.",
        'tap_to_reveal'),
      h.reasoning('quantitative',
        "Two sparingly soluble salts are given: $\\ce{AB}$ with $K_{sp} = 4 \\times 10^{-10}$ and $\\ce{AB2}$ with $K_{sp} = 3.2 \\times 10^{-11}$. A student says \"$\\ce{AB2}$ has the smaller $K_{sp}$, so it is the less soluble.\" Are they right?",
        [
          "Yes — the smaller $K_{sp}$ always means the smaller solubility, so $\\ce{AB2}$ is less soluble",
          "No — convert each to $S$. For $\\ce{AB}$, $S = \\sqrt{K_{sp}} = 2 \\times 10^{-5}$; for $\\ce{AB2}$, $4S^3 = 3.2 \\times 10^{-11}$ gives $S = 2 \\times 10^{-4}$, so $\\ce{AB2}$ is actually more soluble",
          "No — but the reason is that $K_{sp}$ values cannot be calculated for $\\ce{AB2}$ type salts at all",
          "Yes, provided both salts are at the same temperature",
        ], 1,
        "You cannot read solubility straight off $K_{sp}$ when the salts give different numbers of ions. Convert each. For $\\ce{AB <=> A+ + B-}$, $K_{sp} = S^2$, so $S = \\sqrt{4 \\times 10^{-10}} = 2 \\times 10^{-5}$ mol/L. For $\\ce{AB2 <=> A^{2+} + 2B-}$, $K_{sp} = 4S^3 = 3.2 \\times 10^{-11}$, so $S^3 = 8 \\times 10^{-12}$ and $S = 2 \\times 10^{-4}$ mol/L. The $\\ce{AB2}$ salt has the larger $S$, so it is the more soluble of the two even though its $K_{sp}$ is smaller. The order flipped, which is exactly why you convert first.",
        3),
      h.callout('exam_tip', 'JEE / NEET — Working with Ksp',
        "- **The solid drops out.** For $\\ce{M_xX_y(s) <=> x M^{y+} + y X^{x-}}$, write $K_{sp} = [\\ce{M^{y+}}]^x [\\ce{X^{x-}}]^y$. The solid is a pure solid, so it never appears.\n" +
        "- **One general form covers every case.** $K_{sp} = x^x\\, y^y\\, S^{(x+y)}$. Read $x$ and $y$ off the formula. It gives $S^2$ for $\\ce{AB}$, $4S^3$ for $\\ce{MX2}$, $27S^4$ for $\\ce{MX3}$, $108S^5$ for $\\ce{A2X3}$. No need to memorise each.\n" +
        "- **Watch the doubled ion.** In $\\ce{Ni(OH)2}$ the hydroxide is $2S$, so its square brings in the factor 4. Drop the coefficient into the power, do not forget it.\n" +
        "- **Classic trap:** a smaller $K_{sp}$ does **not** mean a smaller solubility when the salts give different numbers of ions. Convert every $K_{sp}$ to $S$ before you compare, because the order can flip (Problem 7.27 is exactly this).\n" +
        "- **Units check:** $S$ comes out in mol/L. Multiply by the molar mass if the question asks for grams per litre."),
      h.quiz([
        {
          question: "For the sparingly soluble salt $\\ce{Ca3(PO4)2}$, which dissolves as $\\ce{Ca3(PO4)2(s) <=> 3Ca^{2+} + 2PO4^{3-}}$, the solubility product in terms of the molar solubility $S$ is:",
          options: [
            "$K_{sp} = S^5$",
            "$K_{sp} = 108\\,S^5$",
            "$K_{sp} = 5S$",
            "$K_{sp} = 6\\,S^5$",
          ], correct_index: 1,
          explanation: "Here $x = 3$ and $y = 2$, so $[\\ce{Ca^{2+}}] = 3S$ and $[\\ce{PO4^{3-}}] = 2S$. Then $K_{sp} = (3S)^3 (2S)^2 = 27S^3 \\cdot 4S^2 = 108\\,S^5$, which is just $x^x y^y S^{(x+y)} = 3^3 \\cdot 2^2 \\cdot S^5$. The coefficients become both the multipliers and the powers.",
        },
        {
          question: "Why does the concentration of the solid salt not appear in the solubility-product expression?",
          options: [
            "Because the solid has not dissolved, so it has zero concentration",
            "Because the concentration of a pure solid is constant, so it is absorbed into the constant and drops out",
            "Because solids react too slowly to count",
            "Because $K_{sp}$ only ever includes anions, never the salt",
          ], correct_index: 1,
          explanation: "A pure solid has a fixed concentration that does not change as some of it dissolves. When you write the equilibrium constant, that constant value is folded into $K_{sp}$ itself and the solid term disappears, leaving only the dissolved-ion concentrations, each raised to its coefficient.",
        },
        {
          question: "Salt $\\ce{XY}$ has $K_{sp} = 1 \\times 10^{-10}$ and salt $\\ce{XY2}$ has $K_{sp} = 4 \\times 10^{-12}$. Which is more soluble?",
          options: [
            "$\\ce{XY}$, because it has the larger $K_{sp}$, so larger $K_{sp}$ always wins",
            "$\\ce{XY2}$, because converting gives $S = 1 \\times 10^{-4}$ mol/L for it versus $1 \\times 10^{-5}$ mol/L for $\\ce{XY}$",
            "$\\ce{XY}$, because it has fewer ions",
            "They are equally soluble because solubility does not depend on the formula",
          ], correct_index: 1,
          explanation: "Convert each first. For $\\ce{XY <=> X+ + Y-}$, $K_{sp} = S^2 = 1 \\times 10^{-10}$, so $S = 1 \\times 10^{-5}$ mol/L. For $\\ce{XY2 <=> X^{2+} + 2Y-}$, $K_{sp} = 4S^3 = 4 \\times 10^{-12}$, so $S^3 = 1 \\times 10^{-12}$ and $S = 1 \\times 10^{-4}$ mol/L. $\\ce{XY2}$ has the larger $S$, so it is more soluble despite its smaller $K_{sp}$. You cannot read solubility straight off $K_{sp}$ when the ion counts differ.",
        },
      ]),
    ];
  },
};
