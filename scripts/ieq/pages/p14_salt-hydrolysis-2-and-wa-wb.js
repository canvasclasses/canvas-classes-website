// IEQ page 14 — Salt Hydrolysis (part 2): the weak-acid–weak-base salt (NCERT §7.11.9).
// When BOTH parents are weak (e.g. CH3COONH4), BOTH ions hydrolyse, so the pH no longer
// depends on concentration — only on the relative strengths of the two parents:
//   pH = 7 + 1/2 (pKa - pKb)   (acidic if pKa < pKb, basic if pKa > pKb)
// and the degree of hydrolysis is concentration-independent: Kh = h^2/(1-h)^2, the C cancels.
// Folds NCERT Problem 7.25 (ammonium acetate, pKa 4.76 / pKb 4.75 -> pH 7.005) as worked().
// Voice: teacher-voice-profile + IEQ-exemplars. HIS points (used, not invented):
//   - D16: "h ka concentration se link hi nahi hai. Tum double karo, chaar guna karo —
//     50% tha toh ab bhi 50% hi rahega." (degree of hydrolysis independent of concentration)
//   - B: the three salt-hydrolysis pH formulas are licensed ratta ("formulas teen hain,
//     yaad kar lo"); D11: only the salt given (no leftover acid/base) => hydrolysis, not buffer.
//   - C/E "scary given-data as psychology": a wall of pK / log values is often there to
//     intimidate when the formula does the work.
// §5.X audited: no "Not X. It is Y." pairs; no banned metaphors (two-way traffic / living
// balance); <=1 em-dash/para; plain SVO; say-it-once; second person; analogy-first with HIS
// analogy; no reveal framing; no intensifier-stacking; no triple-repetition; no universal claims.
module.exports = {
  page_number: 14,
  slug: 'salt-hydrolysis-2-and-wa-wb',
  title: 'Hydrolysis of Weak-Acid–Weak-Base Salts',
  subtitle: 'When both ions react with water.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, science-notebook feel. Ultra-wide cinematic banner. A single beaker of water drawn like a chemist sketched it; floating in it the two ions of ammonium acetate hand-lettered "CH3COO-" on the left and "NH4+" on the right, each shown tugging on a small water molecule in the middle with a curved arrow, so the water is pulled both ways at once. Above the beaker a faint hand-lettered result "pH = 7 + 1/2 (pKa - pKb)". Calm, uncluttered, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'A Salt Whose pH Ignores How Much You Add',
        "Dissolve a pinch of ammonium acetate, $\\ce{CH3COONH4}$, in water and measure the pH. Now dissolve four times as much in the same water and measure again. The pH barely moves. For most salts the pH drifts as you change the amount, yet for this one the reading holds almost steady whether the solution is dilute or strong. That odd stability is the signature of a salt whose acid parent and base parent were *both* weak."),
      h.text(
        "On the last page each salt had one weak parent and one strong parent, so a single ion did the hydrolysing. Here both parents are weak. Take $\\ce{CH3COONH4}$: it comes from weak acetic acid, $\\ce{CH3COOH}$, and weak ammonium hydroxide, $\\ce{NH4OH}$. The anion $\\ce{CH3COO-}$ pulls $\\ce{H+}$ off water to give back its parent acid, and at the same time the cation $\\ce{NH4+}$ pulls $\\ce{OH-}$ off water to give back its parent base.\n\n" +
        "$$\\ce{CH3COO- + NH4+ + H2O <=> CH3COOH + NH4OH}$$\n\n" +
        "So one ion makes a little extra $\\ce{H+}$ and the other makes a little extra $\\ce{OH-}$. The final pH depends on which ion wins the tug, and that is decided only by how the two parents compare in strength."
      ),
      h.heading('The pH depends on relative strength, and the degree of hydrolysis ignores concentration',
        'Predict the pH of a weak-acid–weak-base salt from $pK_a$ and $pK_b$, and explain why its degree of hydrolysis does not change with concentration.'),
      h.text(
        "Because both ions hydrolyse, the leftover $\\ce{H+}$ and $\\ce{OH-}$ partly cancel, and the result settles on one formula worth committing to memory:\n\n" +
        "$$pH = 7 + \\tfrac{1}{2}\\,(pK_a - pK_b)$$\n\n" +
        "Read it as a comparison. If $pK_a$ is larger than $pK_b$, the acid is the weaker parent, so the base wins and the solution turns basic (pH above 7). If $pK_a$ is smaller than $pK_b$, the acid is the stronger parent, so it wins and the solution turns acidic (pH below 7). When the two are equal, the bracket is zero and the solution lands at pH 7.\n\n" +
        "Now look at what is missing from that formula: there is no $C$ in it. The concentration has dropped out, and that is the strange stability from the opening. Working from the hydrolysis constant for both ions gives\n\n" +
        "$$K_h = \\frac{h^2}{(1-h)^2}$$\n\n" +
        "and you can see the concentration term cancel on the way to this shape. So the **degree of hydrolysis $h$ has no link to concentration.** Double the amount of salt, or take four times as much, and a salt that was 50 % hydrolysed stays 50 % hydrolysed. For every other salt type, $h$ shrinks as you concentrate the solution. Here it sits still."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, clean science-notebook feel. A central beaker drawn like a chemist sketched it. Inside, a single water molecule "H2O" in the middle being pulled in two directions: on the LEFT the acetate ion "CH3COO-" tugs with a curved arrow and a small note "grabs H+ -> CH3COOH"; on the RIGHT the ammonium ion "NH4+" tugs with a curved arrow and a small note "grabs OH- -> NH4OH". Below the beaker the boxed hand-lettered result "pH = 7 + 1/2 (pKa - pKb)" with three tiny labelled cases beside it: "pKa < pKb : acidic", "pKa = pKb : neutral", "pKa > pKb : basic". A faint side note: "no C in the formula -> pH independent of concentration". Warm ink colours.',
        '16:9',
        'Both ions of CH₃COONH₄ pull on the same water molecule — acetate grabs H⁺, ammonium grabs OH⁻ — so the pH is set only by pKₐ versus pK_b, with no concentration term.'
      ),
      h.worked('Problem 7.25 (NCERT)', 'ncert_intext',
        "The $pK_a$ of acetic acid and the $pK_b$ of ammonium hydroxide are $4.76$ and $4.75$ respectively. Calculate the pH of an ammonium acetate ($\\ce{CH3COONH4}$) solution.",
        "**Step 1 — classify the salt.** Ammonium acetate comes from weak acetic acid and weak ammonium hydroxide. Both parents are weak, so this is a weak-acid–weak-base salt and the pH depends only on $pK_a$ and $pK_b$.\n\n" +
        "**Step 2 — pick the formula.**\n\n" +
        "$$pH = 7 + \\tfrac{1}{2}\\,(pK_a - pK_b)$$\n\n" +
        "**Step 3 — put the values in.**\n\n" +
        "$$pH = 7 + \\tfrac{1}{2}\\,(4.76 - 4.75)$$\n\n" +
        "**Step 4 — evaluate.**\n\n" +
        "$$pH = 7 + \\tfrac{1}{2}\\,(0.01) = 7 + 0.005 = 7.005$$\n\n" +
        "**Answer:** pH $= 7.005$. The acid is the very slightly weaker parent ($pK_a$ a touch larger), so the base wins by a hair and the solution is a whisker above neutral. The concentration of the salt was never needed, because $C$ does not appear in the formula.",
        'tap_to_reveal'),
      h.reasoning('quantitative',
        "A $0.1$ M solution of a weak-acid–weak-base salt is found to be 40 % hydrolysed. The solution is then made $0.4$ M (four times as concentrated) at the same temperature. A student argues the more concentrated solution must hydrolyse less, so they expect about 10 %. What is the actual degree of hydrolysis, and why?",
        [
          "About 10 %, because a more concentrated solution always hydrolyses a smaller fraction",
          "Still 40 %, because for a weak-acid–weak-base salt $h$ does not depend on concentration — the $C$ cancels in $K_h = h^2/(1-h)^2$",
          "About 80 %, because four times the salt means four times the hydrolysis",
          "It cannot be found without the values of $K_a$ and $K_b$",
        ], 1,
        "For this salt type, both ions hydrolyse and the hydrolysis constant takes the shape $K_h = h^2/(1-h)^2$, with no concentration term in it. So $h$ is fixed by $K_h$ alone. Changing $C$ from $0.1$ M to $0.4$ M leaves $h$ untouched: a salt that was 40 % hydrolysed stays 40 % hydrolysed. The reflex that ``more concentrated means less hydrolysed'' is true for the single-ion salts of the last page, but it does not carry over here.",
        3),
      h.callout('exam_tip', 'JEE / NEET — The Weak–Weak Salt',
        "- **Spot it by both parents being weak.** Then both ions hydrolyse, and you reach for $pH = 7 + \\tfrac{1}{2}(pK_a - pK_b)$ at once.\n" +
        "- **Sign of the bracket tells the answer:** $pK_a < pK_b \\Rightarrow$ acidic (pH below 7); $pK_a > pK_b \\Rightarrow$ basic (pH above 7); $pK_a = pK_b \\Rightarrow$ neutral.\n" +
        "- **Concentration is a red herring here.** $C$ is absent from the pH formula and from $h$, so if a question hands you a molarity for this salt type, it is often there to test whether you reach for the wrong formula.\n" +
        "- **Only the salt given, no leftover acid or base?** Then it is hydrolysis, so use this formula. The moment some unreacted weak acid or weak base is left alongside the salt, it becomes a buffer instead, which is the next page.\n" +
        "- **Classic trap:** a wall of $pK$ and $\\log$ values printed in the stem is often there to slow you down. For a weak–weak salt the formula needs only $pK_a$ and $pK_b$, so do not let the rest of the data drag you in."),
      h.quiz([
        {
          question: "A salt is made from a weak acid and a weak base. Which quantities does its solution's pH depend on?",
          options: [
            "Only the concentration of the salt",
            "Only $pK_a$ of the acid and $pK_b$ of the base, through $pH = 7 + \\tfrac{1}{2}(pK_a - pK_b)$",
            "Both the concentration and the temperature, but not the $pK$ values",
            "Nothing — every weak-acid–weak-base salt has pH exactly 7",
          ], correct_index: 1,
          explanation: "Both ions hydrolyse, and the leftover $\\ce{H+}$ and $\\ce{OH-}$ partly cancel, so the pH settles at $7 + \\tfrac{1}{2}(pK_a - pK_b)$. There is no $C$ in that formula, so concentration does not enter. The pH equals 7 only in the special case $pK_a = pK_b$, not for every such salt.",
        },
        {
          question: "For ammonium acetate, $pK_a$ (acetic acid) $= 4.76$ and $pK_b$ (ammonium hydroxide) $= 4.75$. The solution is:",
          options: [
            "Strongly acidic, around pH 2",
            "Slightly basic, pH $\\approx 7.005$, because $pK_a > pK_b$",
            "Strongly basic, around pH 12",
            "Exactly neutral, pH 7.000, no matter the values",
          ], correct_index: 1,
          explanation: "$pH = 7 + \\tfrac{1}{2}(4.76 - 4.75) = 7 + 0.005 = 7.005$. Since $pK_a$ is slightly larger than $pK_b$, the acid is the marginally weaker parent, so the base edges ahead and the solution is a hair above neutral. The two strengths are almost matched, which is why the pH lands so close to 7.",
        },
        {
          question: "A $0.05$ M solution of a weak-acid–weak-base salt is 30 % hydrolysed. If it is diluted to $0.01$ M at the same temperature, the degree of hydrolysis becomes:",
          options: [
            "Larger, about 150 %",
            "Smaller, about 6 %",
            "Still 30 %, because $h$ is independent of concentration for this salt type",
            "Exactly 50 %, the fixed value for all such salts",
          ], correct_index: 2,
          explanation: "For a weak-acid–weak-base salt, $K_h = h^2/(1-h)^2$ has no concentration term, so $h$ is set by $K_h$ alone. Changing the concentration from $0.05$ M to $0.01$ M leaves $h$ at 30 %. A degree of hydrolysis cannot exceed 100 %, and there is no universal fixed value, so the other options fail.",
        },
      ]),
    ];
  },
};
