// IEQ page 12 — The Common-Ion Effect (Le Chatelier applied to ionization).
// NCERT §7.11.8: adding an ion already present in a weak electrolyte's equilibrium
// (CH3COOH <=> CH3COO- + H+, add HCl or CH3COONa) suppresses its ionization; the new
// degree of ionization alpha_1 < alpha. Founder notes pp.5-6: the CH3COOH + HCl
// derivation Ka = (C*alpha_1 + C1)*alpha_1 / (C*(1-alpha_1)) simplifying to
// C*alpha^2 = C*alpha_1^2 + C1*alpha_1, hence alpha_1 < alpha. Applications: controlling
// [H+] in buffers and qualitative salt analysis.
// Voice: teacher-voice-profile + IEQ-exemplars. HIS framing: common-ion effect is just
// Le Chatelier on ionization ("the system already has plenty of this ion, so pushing more
// in shuts the split"); the conjugate-pair direction; toy-particle bookkeeping.
// §5.X audited: no "Not X. It is Y." pairs, no banned metaphors (no "two-way traffic"/
// "living balance"), <=1 em-dash/para, plain SVO, say-it-once, second person, no reveal
// framing, no intensifier-stacking, no triple-repetition, no universal claims.
module.exports = {
  page_number: 12,
  slug: 'common-ion-effect',
  title: 'The Common-Ion Effect',
  subtitle: 'Adding a shared ion shuts down ionisation.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. Two beakers drawn like a chemist sketched them in a notebook. The LEFT beaker is a weak acid with a few tiny H+ particles drifting free above many intact acid molecules. A hand tips a small bottle labelled "HCl" into it; the RIGHT beaker, after the addition, now shows the free H+ particles being pushed back down into intact acid molecules, with a hand-lettered backward arrow over the equilibrium. A faint note underneath reads "more shared ion -> less splitting". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Add the Product, and the Acid Goes Quiet',
        "A weak acid in water is already splitting a little, releasing a small trickle of $\\ce{H+}$. Pour in a few drops of strong acid, which carries its own flood of $\\ce{H+}$, and the weak acid splits even less than before. You added the very ion it was making, and it responded by making less. That single move is what lets a chemist dial the acidity of a solution up or down on demand."),
      h.text(
        "You met Le Chatelier's principle on the last pages: change a condition on a system at equilibrium and it shifts to reduce that change. The **common-ion effect** is that same idea pointed at ionisation.\n\n" +
        "A weak electrolyte sits in its own equilibrium, with a small fraction split into ions. Suppose one of those ions is already floating around from somewhere else in the solution. When you add more of that shared ion, the system sees a surplus of it and works to bring the amount back down. The way it does that is by pushing the split backwards, joining ions back into the un-split form. So the weak electrolyte ends up **less ionised** than it was on its own.\n\n" +
        "An ion that is shared between the equilibrium you care about and a second source is called a **common ion**. Add a common ion, and the weak electrolyte's ionisation is suppressed."
      ),
      h.heading('Pushing acetic acid backwards with a common ion', 'Derive how a common ion lowers the degree of ionisation of a weak acid, and read off $\\alpha_1 < \\alpha$.'),
      h.text(
        "Take acetic acid, a weak acid, sitting in water:\n\n" +
        "$$\\ce{CH3COOH <=> CH3COO- + H+}$$\n\n" +
        "On its own it splits to a small degree $\\alpha$, giving a little $\\ce{CH3COO-}$ and a little $\\ce{H+}$. Now you have two ways to feed in a common ion. Add a few drops of $\\ce{HCl}$ and you flood the solution with the common ion $\\ce{H+}$. Add some sodium acetate ($\\ce{CH3COONa}$) instead and you flood it with the common ion $\\ce{CH3COO-}$. Either ion already appears on the right side of the acetic-acid equilibrium.\n\n" +
        "Once that surplus arrives, the system has too much of a product ion. It runs backward to use the surplus up, pulling $\\ce{H+}$ and $\\ce{CH3COO-}$ back together into $\\ce{CH3COOH}$. The fresh degree of ionisation $\\alpha_1$ comes out **smaller** than the original $\\alpha$. The worked derivation below puts a number-relation behind that claim."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. A single notebook-style equilibrium diagram. In the centre, the reaction "CH3COOH <=> CH3COO- + H+" hand-lettered, with a bold backward-pointing arrow drawn thicker than the forward arrow to show the shift. Coming in from the right, an arrow labelled "add H+ (from HCl)" and a second labelled "add CH3COO- (from CH3COONa)" both feed into the product side. A small hand-lettered note below reads "common ion added -> equilibrium pushed LEFT -> less ionisation, alpha goes down". Neat hand-lettered labels, warm ink colours, clean science-notebook feel.',
        '16:9',
        'Adding the common ion H⁺ (from HCl) or CH₃COO⁻ (from CH₃COONa) pushes the acetic-acid equilibrium back to the left, so the acid ionises less — its degree of ionisation drops from α to a smaller α₁.'
      ),
      h.worked('Worked Derivation — Acetic Acid + HCl', 'solved_example',
        "Acetic acid of concentration $C$ has degree of ionisation $\\alpha$ in pure water. You then add $\\ce{HCl}$ so that it contributes a concentration $C_1$ of $\\ce{H+}$. Show that the new degree of ionisation $\\alpha_1$ is smaller than $\\alpha$.",
        "**Step 1 — write $K_a$ for the acid alone.** For $\\ce{CH3COOH <=> CH3COO- + H+}$ starting at concentration $C$ with degree $\\alpha$, the equilibrium amounts are $C(1-\\alpha)$ acid, $C\\alpha$ acetate and $C\\alpha$ hydrogen ion:\n\n" +
        "$$K_a = \\frac{(C\\alpha)(C\\alpha)}{C(1-\\alpha)} = \\frac{C\\alpha^2}{1-\\alpha}$$\n\n" +
        "Since the acid is weak, $1-\\alpha \\approx 1$, so\n\n" +
        "$$K_a = C\\alpha^2$$\n\n" +
        "**Step 2 — now add the $\\ce{HCl}$.** The $\\ce{HCl}$ ionises completely and dumps a concentration $C_1$ of $\\ce{H+}$ into the solution. With this extra $\\ce{H+}$ present, let the acetic acid's fresh degree of ionisation be $\\alpha_1$. The equilibrium amounts become:\n\n" +
        "$$[\\ce{CH3COOH}] = C(1-\\alpha_1), \\quad [\\ce{CH3COO-}] = C\\alpha_1, \\quad [\\ce{H+}] = C\\alpha_1 + C_1$$\n\n" +
        "The $\\ce{H+}$ count adds the bit from the acid ($C\\alpha_1$) and the flood from the $\\ce{HCl}$ ($C_1$).\n\n" +
        "**Step 3 — write $K_a$ again with these amounts.** $K_a$ has not changed, because the temperature has not changed:\n\n" +
        "$$K_a = \\frac{(C\\alpha_1 + C_1)\\,(C\\alpha_1)}{C(1-\\alpha_1)}$$\n\n" +
        "With $1-\\alpha_1 \\approx 1$ this gives\n\n" +
        "$$K_a = (C\\alpha_1 + C_1)\\,\\alpha_1 = C\\alpha_1^2 + C_1\\alpha_1$$\n\n" +
        "**Step 4 — set the two expressions for $K_a$ equal.** From Step 1, $K_a = C\\alpha^2$. From Step 3, $K_a = C\\alpha_1^2 + C_1\\alpha_1$. So:\n\n" +
        "$$C\\alpha^2 = C\\alpha_1^2 + C_1\\alpha_1$$\n\n" +
        "The right side carries an extra positive term $C_1\\alpha_1$ on top of a $C\\alpha_1^2$ term. For the two sides to balance, $\\alpha_1$ must be smaller than $\\alpha$.\n\n" +
        "$$\\boxed{\\alpha_1 < \\alpha}$$\n\n" +
        "**Answer:** the added common ion $\\ce{H+}$ forces the acid to ionise less, so its degree of ionisation falls from $\\alpha$ to a smaller $\\alpha_1$. (Adding $\\ce{CH3COONa}$ instead supplies the common ion $\\ce{CH3COO-}$ and gives the same result.)",
        'tap_to_reveal'),
      h.reasoning('logical',
        "You have a beaker of weak acetic acid at equilibrium. You stir in some solid sodium acetate ($\\ce{CH3COONa}$), which dissolves completely into $\\ce{Na+}$ and $\\ce{CH3COO-}$. What happens to the degree of ionisation of the acetic acid, and why?",
        [
          "It rises, because adding more acetate gives the acid extra material to ionise from",
          "It falls, because $\\ce{CH3COO-}$ is a common ion, so the surplus pushes the acetic-acid equilibrium backward and suppresses the split",
          "It stays exactly the same, because sodium acetate is a salt and salts cannot affect an acid's equilibrium",
          "It falls, because the $\\ce{Na+}$ ion reacts with the acetic acid and removes it",
        ], 1,
        "Sodium acetate hands the solution a flood of $\\ce{CH3COO-}$, which already sits on the product side of $\\ce{CH3COOH <=> CH3COO- + H+}$. The system has a surplus of that ion, so it runs backward to use it up, joining $\\ce{CH3COO-}$ and $\\ce{H+}$ back into acid. The degree of ionisation drops. The $\\ce{Na+}$ is a spectator and reacts with nothing.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Common-Ion Effect',
        "- **The reflex:** find the ion shared between a weak electrolyte's equilibrium and a second source. Adding that **common ion** shifts the equilibrium backward and lowers the degree of ionisation, so $\\alpha_1 < \\alpha$.\n" +
        "- **Two standard feeds for acetic acid:** $\\ce{HCl}$ supplies the common ion $\\ce{H+}$; $\\ce{CH3COONa}$ supplies the common ion $\\ce{CH3COO-}$. Both suppress the acid.\n" +
        "- **Why it matters:** this is the lever behind **buffers** (a weak acid plus its salt holds $[\\ce{H+}]$ steady) and behind **qualitative salt analysis** (adding a common ion keeps a sparingly soluble salt from dissolving, sharpening the separation).\n" +
        "- **Classic trap:** the effect needs a genuine equilibrium to act on. A salt that is completely soluble and completely ionised has no equilibrium to push, so there is no common-ion suppression there. $K_a$ itself does not change either; only the position of the split moves."),
      h.quiz([
        {
          question: "Acetic acid is in equilibrium as $\\ce{CH3COOH <=> CH3COO- + H+}$. A few drops of concentrated $\\ce{HCl}$ are added at constant temperature. What happens to the ionisation of the acetic acid?",
          options: [
            "It is suppressed: the common ion $\\ce{H+}$ pushes the equilibrium backward, so the acid ionises less",
            "It increases, because the strong acid helps the weak acid break apart faster",
            "It is unaffected, because $\\ce{HCl}$ and $\\ce{CH3COOH}$ are different acids",
            "The acetic acid is converted entirely into $\\ce{CH3COO-}$",
          ], correct_index: 0,
          explanation: "$\\ce{HCl}$ floods the solution with $\\ce{H+}$, which is a product of the acetic-acid equilibrium. The surplus of this common ion drives the equilibrium backward, joining $\\ce{H+}$ and $\\ce{CH3COO-}$ back into acid, so the degree of ionisation falls. The derivation gives $\\alpha_1 < \\alpha$.",
        },
        {
          question: "Which of these added substances will NOT show a common-ion effect on a weak acetic acid solution?",
          options: [
            "$\\ce{CH3COONa}$ (sodium acetate)",
            "$\\ce{HCl}$ (hydrochloric acid)",
            "$\\ce{NaNO3}$ (sodium nitrate)",
            "$\\ce{CH3COOK}$ (potassium acetate)",
          ], correct_index: 2,
          explanation: "A common-ion effect needs the added substance to supply an ion already in the acetic-acid equilibrium, namely $\\ce{H+}$ or $\\ce{CH3COO-}$. Sodium acetate and potassium acetate both supply $\\ce{CH3COO-}$, and $\\ce{HCl}$ supplies $\\ce{H+}$. $\\ce{NaNO3}$ gives only $\\ce{Na+}$ and $\\ce{NO3-}$, neither of which appears in the equilibrium, so it has no suppressing effect.",
        },
        {
          question: "In the derivation for acetic acid (concentration $C$, degree $\\alpha$ alone) with $\\ce{HCl}$ adding $C_1$ of $\\ce{H+}$, the two expressions for $K_a$ give $C\\alpha^2 = C\\alpha_1^2 + C_1\\alpha_1$. What does this tell you about $\\alpha_1$?",
          options: [
            "$\\alpha_1 > \\alpha$, the acid ionises more",
            "$\\alpha_1 = \\alpha$, nothing changes",
            "$\\alpha_1 < \\alpha$, the acid ionises less",
            "$\\alpha_1 = 0$, the acid stops ionising completely",
          ], correct_index: 2,
          explanation: "The right side carries an extra positive term $C_1\\alpha_1$ beyond the $C\\alpha_1^2$ term. For the right side to equal the fixed left side $C\\alpha^2$, the value of $\\alpha_1$ has to be smaller than $\\alpha$. The common ion suppresses ionisation, it does not stop it entirely, so $\\alpha_1$ is small but not zero.",
        },
      ]),
    ];
  },
};
