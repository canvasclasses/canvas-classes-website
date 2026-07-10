// IEQ page 3 — "Ostwald's Dilution Law".
// Sub-topic: AB <=> A+ + B-; Ka = C*alpha^2/(1-alpha). Weak electrolyte:
// 1-alpha ~ 1 => Ka = C*alpha^2 => alpha = sqrt(Ka/C). alpha rises on dilution,
// -> 1 at infinite dilution; alpha-vs-C graph. GATE the 1-alpha~1 approximation
// (IEQ-exemplars C: redo without it if alpha comes out large). Worked example
// from founder notes Q1: HCN Ka=4.9e-10, alpha at 0.1 M (7e-5) and 0.01 M
// (2.2e-4). Source: founder notes p4 (Ostwald derivation, graph, HCN Q1).
// §5.X audited: no "Not X. It is Y." pairs, no banned stacked metaphors,
// <=1 em-dash/para, second person, say-it-once.
module.exports = {
  page_number: 3,
  slug: 'ostwald-dilution-law',
  page_type: 'lesson',
  title: "Ostwald's Dilution Law",
  subtitle: "The maths of a weak electrolyte's dissociation.",
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A row of three beakers of the same weak acid drawn left to right, getting progressively more dilute: the left beaker is crowded with mostly whole HA molecule-blobs and only a couple of separated ion dots; the middle beaker has more separated ions; the right, palest beaker has a larger fraction broken into + and - ion dots. A faint hand-lettered curved arrow runs along the top from left to right labelled "more dilute, more ionised". Calm science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Add Water and a Weak Acid Ionises More',
        "It feels backwards: pour water into a weak acid and a bigger fraction of it breaks into ions, even though you have made the solution weaker overall. The total amount of acid has not changed, but more of it is now in ionised form. Ostwald turned this observation into an exact rule, and that rule is the whole of this page."),
      h.text(
        "Take a weak electrolyte $AB$ that ionises into $A^+$ and $B^-$. Start with concentration $C$ and let a fraction $\\alpha$ ionise. At equilibrium, $\\alpha$ of every mole has split, so:\n\n" +
        "$$AB \\rightleftharpoons A^+ + B^-$$\n\n" +
        "The leftover un-ionised $AB$ is $C(1-\\alpha)$, while each ion is present at $C\\alpha$. Putting these into the equilibrium expression gives **Ostwald's dilution law**:\n\n" +
        "$$K_a = \\frac{[A^+][B^-]}{[AB]} = \\frac{(C\\alpha)(C\\alpha)}{C(1-\\alpha)} = \\frac{C\\alpha^2}{1-\\alpha}$$\n\n" +
        "For a genuinely weak electrolyte $\\alpha$ is small, so $1-\\alpha$ is very close to 1. Dropping it cleans the expression right up:\n\n" +
        "$$K_a = C\\alpha^2 \\quad\\Rightarrow\\quad \\alpha = \\sqrt{\\frac{K_a}{C}}$$\n\n" +
        "Read that last result carefully. With $K_a$ fixed by the acid and the temperature, $\\alpha$ depends only on $C$, and it grows as $C$ falls. Halve the concentration and $\\alpha$ rises. Keep diluting toward zero concentration and $\\alpha$ climbs toward 1, its maximum, at infinite dilution. This is the exact version of the dilution effect from the previous page."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. A single clean hand-drawn graph, science-notebook style with neat hand-lettering. The vertical axis is labelled "alpha (degree of dissociation)" with a faint dashed horizontal line near the top marked "1". The horizontal axis is labelled "C (concentration)". A smooth curve starts high on the left near alpha = 1 at very low concentration and falls steadily as concentration increases, flattening low on the right. A small hand-lettered note beside the upper-left of the curve reads "as C -> 0, alpha -> 1 (infinite dilution)" and another near the lower right reads "high C, low alpha". Uncluttered, hand-lettered.',
        '16:9',
        'Ostwald\'s law plotted: as the concentration C falls toward zero, the degree of dissociation α rises toward 1. At infinite dilution a weak electrolyte is fully ionised.'
      ),
      h.callout('remember', 'Check the 1 − α ≈ 1 Assumption Before You Trust It',
        "Dropping $1-\\alpha$ to get $\\alpha = \\sqrt{K_a/C}$ only holds while $\\alpha$ really is small. If the number you get back is large, say above about $0.1$, the approximation has broken and your answer is off. The safeguard: compute $\\alpha$ the easy way first, then look at it. If it came out large, go back to the full $K_a = \\dfrac{C\\alpha^2}{1-\\alpha}$ and solve that quadratic instead. The shortcut is for genuinely weak, reasonably concentrated solutions."),
      h.worked('Worked Example — Degree of Dissociation of HCN', 'solved_example',
        "At 25 °C the dissociation constant of $\\ce{HCN}$ is $K_a = 4.9 \\times 10^{-10}$. Find its degree of dissociation $\\alpha$ when the concentration is (a) 0.1 M and (b) 0.01 M.",
        "$\\ce{HCN}$ is a very weak acid (its $K_a$ is tiny), so $\\alpha$ will be small and the approximation $1-\\alpha \\approx 1$ is safe. That gives the working form:\n\n" +
        "$$\\alpha = \\sqrt{\\frac{K_a}{C}}$$\n\n" +
        "**(a) At $C = 0.1$ M:**\n\n" +
        "$$\\alpha = \\sqrt{\\frac{4.9 \\times 10^{-10}}{0.1}} = \\sqrt{4.9 \\times 10^{-9}}$$\n\n" +
        "$$\\alpha = 7 \\times 10^{-5}$$\n\n" +
        "**(b) At $C = 0.01$ M:**\n\n" +
        "$$\\alpha = \\sqrt{\\frac{4.9 \\times 10^{-10}}{0.01}} = \\sqrt{4.9 \\times 10^{-8}}$$\n\n" +
        "$$\\alpha = 2.2 \\times 10^{-4}$$\n\n" +
        "**Check the assumption:** both values are far below 0.1, so dropping $1-\\alpha$ was justified.\n\n" +
        "**Read the result:** diluting tenfold (from 0.1 M to 0.01 M) raised $\\alpha$ by a factor of about $\\sqrt{10} \\approx 3.2$, from $7 \\times 10^{-5}$ to $2.2 \\times 10^{-4}$. Lower concentration, higher degree of dissociation, exactly as Ostwald's law predicts.\n\n" +
        "**Answer:** (a) $\\alpha = 7 \\times 10^{-5}$  (b) $\\alpha = 2.2 \\times 10^{-4}$"),
      h.reasoning('quantitative',
        "A student solves Ostwald's law for some acid using $\\alpha = \\sqrt{K_a/C}$ and gets $\\alpha = 0.6$. They write it down and move on. What has gone wrong, and what should they do?",
        [
          "Nothing is wrong — α = 0.6 is a perfectly fine answer from the shortcut formula",
          "α = 0.6 is too large for the 1 − α ≈ 1 shortcut to hold, so they must redo it with the full $K_a = C\\alpha^2/(1-\\alpha)$ and solve the quadratic",
          "They should simply double the answer to correct for the dropped 1 − α term",
          "α can never exceed 0.5, so the arithmetic must contain a slip and the real answer is below 0.5",
        ], 1,
        "An $\\alpha$ of 0.6 means more than half the acid ionised, so $1-\\alpha$ is nowhere near 1 and dropping it was invalid. The fix is to abandon the shortcut and solve the full $K_a = \\dfrac{C\\alpha^2}{1-\\alpha}$ as a quadratic. You cannot patch it by doubling, and there is no rule capping $\\alpha$ at 0.5 — the only real cap is 1.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Ostwald\'s Dilution Law',
        "- **Full form:** $K_a = \\dfrac{C\\alpha^2}{1-\\alpha}$. **Weak-electrolyte shortcut** ($1-\\alpha \\approx 1$): $\\alpha = \\sqrt{\\dfrac{K_a}{C}}$.\n" +
        "- $\\alpha \\propto \\dfrac{1}{\\sqrt{C}}$ — dilute tenfold and $\\alpha$ rises by $\\sqrt{10} \\approx 3.2$. At infinite dilution $\\alpha \\to 1$.\n" +
        "- **Gate the approximation:** the shortcut is valid only when the resulting $\\alpha$ is small (roughly $< 0.1$). If $\\alpha$ comes out large, solve the full quadratic instead — a classic examiner trap.\n" +
        "- The ion concentration follows from $\\alpha$: $[A^+] = C\\alpha$. For an acid, $[H^+] = C\\alpha = \\sqrt{K_a \\cdot C}$.\n" +
        "- Next we leave dissociation behind and meet the three pictures of an acid and a base: Arrhenius, Brønsted–Lowry and Lewis."),
      h.quiz([
        {
          question: "According to Ostwald's dilution law for a weak electrolyte, the degree of dissociation α:",
          options: [
            "increases as the solution is diluted",
            "decreases as the solution is diluted",
            "does not depend on concentration at all",
            "is always equal to 1 regardless of concentration",
          ], correct_index: 0,
          explanation: "Since $\\alpha = \\sqrt{K_a/C}$, a smaller $C$ gives a larger $\\alpha$, so diluting raises the degree of dissociation. It does depend on concentration, and it only approaches (never simply equals) 1, at infinite dilution.",
        },
        {
          question: "For a weak acid of dissociation constant $K_a$ at concentration $C$, the approximate expression for α is:",
          options: [
            "$\\alpha = K_a \\cdot C$",
            "$\\alpha = \\dfrac{K_a}{C}$",
            "$\\alpha = \\sqrt{\\dfrac{K_a}{C}}$",
            "$\\alpha = \\sqrt{K_a \\cdot C}$",
          ], correct_index: 2,
          explanation: "Starting from $K_a = C\\alpha^2$ (after dropping $1-\\alpha$) and solving for $\\alpha$ gives $\\alpha = \\sqrt{K_a/C}$. The product forms confuse $\\alpha$ with the ion concentration $[H^+] = \\sqrt{K_a \\cdot C}$, which is a different quantity.",
        },
        {
          question: "Solving $\\alpha = \\sqrt{K_a/C}$ for a fairly concentrated acid gives $\\alpha = 0.7$. The correct response is to:",
          options: [
            "accept $\\alpha = 0.7$, since the formula was applied correctly",
            "reject it and re-solve using the full $K_a = C\\alpha^2/(1-\\alpha)$, because $1-\\alpha \\approx 1$ no longer holds",
            "conclude the acid must actually be a strong electrolyte",
            "divide the answer by 2 to fix the dropped term",
          ], correct_index: 1,
          explanation: "An $\\alpha$ of 0.7 is far too large for the $1-\\alpha \\approx 1$ assumption, so the shortcut is invalid here and you must return to the full quadratic form. The large $\\alpha$ does not reclassify the acid as strong, and you cannot repair the error by dividing by 2.",
        },
      ]),
    ];
  },
};
