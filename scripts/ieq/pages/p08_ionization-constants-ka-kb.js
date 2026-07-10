// IEQ page 8 — Acid and base ionization constants (Ka, Kb), pKa, the NCERT Ka/Kb
// tables, the conjugate-pair link Ka·Kb = Kw (pKa + pKb = 14), and di-/polybasic
// acids with stepwise Ka1 > Ka2 > Ka3. NCERT §7.11.3-7.11.6. Folds NCERT Problems
// 7.18 (HF degree of dissociation + species + pH), 7.21 (hydrazine Kb, pKb from pH),
// 7.23 (ammonia degree of ionization + pH + Ka of conjugate) as worked() blocks.
// Voice: teacher-voice-profile + IEQ-exemplars (B: Ka·Kb = Kw is the unlock; the
// strength seesaw "stronger species, weaker its conjugate"; C: diprotic second step
// negligible). §5.X audited: no "Not X. It is Y." pairs, <=1 em-dash/para, plain SVO,
// say-it-once, second person, no reveal framing, no triple-repetition, no banned
// metaphors, no intensifier-stacking, no universal claims.
module.exports = {
  page_number: 8,
  slug: 'ionization-constants-ka-kb',
  title: 'Acid and Base Ionization Constants',
  subtitle: 'Putting a number on weak-acid strength.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D. Ultra-wide cinematic banner. A row of labelled beakers of weak acids drawn like a chemist sketched them, each with a small hand-lettered number tag underneath suggesting "how much it splits" — a fuller one for a stronger acid on the left, an almost-untouched one for a weaker acid on the right. A faint hand-lettered note along the bottom "bigger number = stronger". Calm, uncluttered, science-notebook feel, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'A Number for "How Strong"',
        "You already know that hydrofluoric acid, $\\ce{HF}$, is a weak acid and hydrochloric acid is strong. But \"weak\" and \"strong\" are blunt words. Chemists wanted a single number that says exactly how far a weak acid splits, so a chemist could line up nitrous acid, acetic acid and $\\ce{HF}$ and read off which is stronger. That number is the ionization constant, and once you have it, comparing acids becomes arithmetic instead of opinion."),
      h.text(
        "When a weak acid $\\ce{HA}$ sits in water, only part of it splits into ions before the amounts stop changing:\n\n" +
        "$$\\ce{HA + H2O <=> H3O+ + A-}$$\n\n" +
        "This is just an equilibrium, so it has an equilibrium constant. Write it the usual way, products over reactants, leaving water out because it is the solvent and its concentration barely moves. The constant you get is the **acid ionization constant**, $K_a$:\n\n" +
        "$$K_a = \\frac{[\\ce{H3O+}][\\ce{A-}]}{[\\ce{HA}]}$$\n\n" +
        "A large $K_a$ means the top of that fraction is big, so the acid has handed over a lot of its $\\ce{H+}$. A small $K_a$ means most of the acid is still whole. So at a fixed temperature, a larger $K_a$ marks a stronger acid. A base $\\ce{B}$ behaves the same way when it takes an $\\ce{H+}$ from water, $\\ce{B + H2O <=> BH+ + OH-}$, and its constant is the **base ionization constant** $K_b = \\frac{[\\ce{BH+}][\\ce{OH-}]}{[\\ce{B}]}$."
      ),
      h.heading('Reading the Ka tables and the pKa shortcut', 'Compare weak acids using $K_a$ and $pK_a$, and link any conjugate pair through $K_a \\times K_b = K_w$.'),
      h.text(
        "The values of $K_a$ run very small, like $3.2 \\times 10^{-4}$ for $\\ce{HF}$ or $4.9 \\times 10^{-10}$ for $\\ce{HCN}$. Carrying those powers of ten around is tiring, so chemists take the negative logarithm and quote $pK_a = -\\log K_a$ instead. A bigger $K_a$ gives a smaller $pK_a$, so the rule flips neatly: a **smaller $pK_a$ marks the stronger acid**. From the NCERT table, $\\ce{HF}$ ($K_a = 3.2 \\times 10^{-4}$) is stronger than acetic acid ($1.74 \\times 10^{-5}$), which is stronger than $\\ce{HCN}$ ($4.9 \\times 10^{-10}$).\n\n" +
        "There is one relation worth memorising for this chapter. For a conjugate pair, the acid's $K_a$ and its conjugate base's $K_b$ always multiply to $K_w$:\n\n" +
        "$$K_a \\times K_b = K_w = 10^{-14} \\quad (\\text{at } 298\\,\\text{K})$$\n\n" +
        "Take the negative log of both sides and it reads $pK_a + pK_b = pK_w = 14$. This is the unlock for a whole family of questions: if a problem hands you the $K_a$ of an acid and asks for the $K_b$ of its conjugate base, you divide $K_w$ by $K_a$ and you are done. The same relation carries a quiet warning about strength. The stronger an acid is, the weaker its conjugate base, because their constants have to stay tied to the fixed product $K_w$."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, ink/pencil line work with soft gouache fills, NO neon/glow/3D. Two parts drawn like a chemist sketched them in a notebook. Part one: a horizontal hand-lettered strength scale running left to right, "stronger acid" on the left to "weaker acid" on the right, with tick marks placing HF (Ka 3.2e-4), HNO2 (4.5e-4), CH3COOH (1.74e-5) and HCN (4.9e-10), and a small note "smaller pKa = stronger". Part two below it: a balance-style link showing a box "Ka of acid" times a box "Kb of its conjugate base" equals a box "Kw = 1e-14", with a hand-lettered caption "one conjugate pair, tied to Kw". Neat hand-lettered labels, warm ink colours, clean science-notebook feel.',
        '16:9',
        'Weak acids ranked by Ka (smaller pKa = stronger), and the conjugate-pair link Ka × Kb = Kw that lets you get one constant from the other.'
      ),
      h.text(
        "One more case to settle. Some acids carry more than one ionizable $\\ce{H+}$, like carbonic acid $\\ce{H2CO3}$ (two) and phosphoric acid $\\ce{H3PO4}$ (three). These are **di- and polybasic acids**, and they let go of their protons one at a time, each step with its own constant. For phosphoric acid:\n\n" +
        "$$K_{a_1} > K_{a_2} > K_{a_3}$$\n\n" +
        "Each step is harder than the one before. After the first $\\ce{H+}$ leaves, you are pulling the next $\\ce{H+}$ away from an ion that is already negative, and a positive proton clings harder to a negative ion. So $K_{a_2}$ is much smaller than $K_{a_1}$, often by a factor of ten thousand or more. In practice the second dissociation adds so little extra $\\ce{H+}$ that you can usually ignore it and treat a diprotic acid using $K_{a_1}$ alone."
      ),
      h.worked('Problem 7.18 (NCERT)', 'ncert_intext',
        "The ionization constant of $\\ce{HF}$ is $3.2 \\times 10^{-4}$. Calculate the degree of dissociation of $\\ce{HF}$ in its $0.02$ M solution. Calculate the concentration of all species present ($\\ce{H3O+}$, $\\ce{F-}$ and $\\ce{HF}$) and its pH.",
        "**Step 1 — set up the ICE row.** For $\\ce{HF + H2O <=> H3O+ + F-}$ with $c = 0.02$ M and degree of dissociation $\\alpha$:\n\n" +
        "Equilibrium: $0.02(1-\\alpha),\\ 0.02\\alpha,\\ 0.02\\alpha$\n\n" +
        "**Step 2 — substitute into $K_a$.**\n\n" +
        "$$K_a = \\frac{(0.02\\alpha)^2}{0.02(1-\\alpha)} = \\frac{0.02\\,\\alpha^2}{1-\\alpha} = 3.2 \\times 10^{-4}$$\n\n" +
        "**Step 3 — solve the quadratic for $\\alpha$.**\n\n" +
        "$$\\alpha^2 + 1.6 \\times 10^{-2}\\,\\alpha - 1.6 \\times 10^{-2} = 0$$\n\n" +
        "The roots are $\\alpha = +0.12$ and $\\alpha = -0.12$. A negative degree of dissociation has no meaning, so keep $\\alpha = 0.12$.\n\n" +
        "**Step 4 — read off the species.**\n\n" +
        "$[\\ce{H3O+}] = [\\ce{F-}] = c\\alpha = 0.02 \\times 0.12 = 2.4 \\times 10^{-3}$ M\n\n" +
        "$[\\ce{HF}] = c(1-\\alpha) = 0.02 \\times 0.88 = 17.6 \\times 10^{-3}$ M\n\n" +
        "**Step 5 — pH.**\n\n" +
        "$$\\text{pH} = -\\log(2.4 \\times 10^{-3}) = 2.62$$\n\n" +
        "**Answer:** $\\alpha = 0.12$; $[\\ce{H3O+}] = [\\ce{F-}] = 2.4 \\times 10^{-3}$ M, $[\\ce{HF}] = 17.6 \\times 10^{-3}$ M, pH $= 2.62$.",
        'tap_to_reveal'),
      h.worked('Problem 7.21 (NCERT)', 'ncert_intext',
        "The pH of $0.004$ M hydrazine solution is $9.7$. Calculate its ionization constant $K_b$ and $pK_b$.",
        "**Step 1 — get $[\\ce{H+}]$ from the pH.**\n\n" +
        "$$[\\ce{H+}] = \\text{antilog}(-9.7) = 1.67 \\times 10^{-10}\\ \\text{M}$$\n\n" +
        "**Step 2 — get $[\\ce{OH-}]$ through $K_w$.**\n\n" +
        "$$[\\ce{OH-}] = \\frac{K_w}{[\\ce{H+}]} = \\frac{10^{-14}}{1.67 \\times 10^{-10}} = 5.98 \\times 10^{-5}\\ \\text{M}$$\n\n" +
        "**Step 3 — set up the ICE.** For $\\ce{NH2NH2 + H2O <=> NH2NH3+ + OH-}$, the hydrazinium ion equals the hydroxide, so $[\\ce{NH2NH3+}] = 5.98 \\times 10^{-5}$ M. Both are tiny next to $0.004$ M, so the leftover base is still about $0.004$ M.\n\n" +
        "**Step 4 — substitute into $K_b$.**\n\n" +
        "$$K_b = \\frac{[\\ce{NH2NH3+}][\\ce{OH-}]}{[\\ce{NH2NH2}]} = \\frac{(5.98 \\times 10^{-5})^2}{0.004} = 8.96 \\times 10^{-7}$$\n\n" +
        "**Step 5 — $pK_b$.**\n\n" +
        "$$pK_b = -\\log(8.96 \\times 10^{-7}) = 6.04$$\n\n" +
        "**Answer:** $K_b = 8.96 \\times 10^{-7}$ and $pK_b = 6.04$.",
        'tap_to_reveal'),
      h.worked('Problem 7.23 (NCERT)', 'ncert_intext',
        "Determine the degree of ionization and pH of a $0.05$ M solution of ammonia ($K_b = 1.77 \\times 10^{-5}$). Also calculate the ionization constant of the conjugate acid of ammonia.",
        "**Step 1 — find $\\alpha$.** For $\\ce{NH3 + H2O <=> NH4+ + OH-}$, $K_b = c\\alpha^2$ when $\\alpha$ is small:\n\n" +
        "$$\\alpha = \\sqrt{\\frac{K_b}{c}} = \\sqrt{\\frac{1.77 \\times 10^{-5}}{0.05}} = 0.018$$\n\n" +
        "**Step 2 — get $[\\ce{OH-}]$.**\n\n" +
        "$$[\\ce{OH-}] = c\\alpha = 0.05 \\times 0.018 = 9.4 \\times 10^{-4}\\ \\text{M}$$\n\n" +
        "**Step 3 — get $[\\ce{H+}]$ through $K_w$, then pH.**\n\n" +
        "$$[\\ce{H+}] = \\frac{K_w}{[\\ce{OH-}]} = \\frac{10^{-14}}{9.4 \\times 10^{-4}} = 1.06 \\times 10^{-11}\\ \\text{M}$$\n\n" +
        "$$\\text{pH} = -\\log(1.06 \\times 10^{-11}) = 10.97$$\n\n" +
        "**Step 4 — $K_a$ of the conjugate acid $\\ce{NH4+}$.** Use the conjugate-pair relation:\n\n" +
        "$$K_a = \\frac{K_w}{K_b} = \\frac{10^{-14}}{1.77 \\times 10^{-5}} = 5.64 \\times 10^{-10}$$\n\n" +
        "**Answer:** $\\alpha = 0.018$, pH $= 10.97$, and $K_a(\\ce{NH4+}) = 5.64 \\times 10^{-10}$.",
        'tap_to_reveal'),
      h.reasoning('quantitative',
        "A student knows $K_a$ for acetic acid is $1.8 \\times 10^{-5}$ and is asked for the $K_b$ of acetate ion, $\\ce{CH3COO-}$, its conjugate base. They look up acetate in a table of bases, cannot find it, and decide the question is unanswerable. What should they have done?",
        [
          "Nothing — without a measured $K_b$ for acetate, the value genuinely cannot be found",
          "Used $K_b = \\frac{K_w}{K_a} = \\frac{10^{-14}}{1.8 \\times 10^{-5}} = 5.6 \\times 10^{-10}$, since acetate is the conjugate base of acetic acid",
          "Looked up the $K_b$ of acetic acid instead, since an acid and its conjugate share the same constant",
          "Added $K_a$ and $K_w$ to get the $K_b$ of the conjugate base",
        ], 1,
        "For any conjugate pair, $K_a \\times K_b = K_w$. Acetate is the conjugate base of acetic acid, so its $K_b$ comes straight from dividing $K_w$ by the acid's $K_a$: $10^{-14} / (1.8 \\times 10^{-5}) = 5.6 \\times 10^{-10}$. There is no need for a separate table, an acid does not share a constant with its conjugate, and the relation is a product, not a sum.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Ka, Kb and Conjugate Pairs',
        "- **Smaller $pK_a$ means stronger acid.** Take negative logs of $K_a$ and the comparison gets easy. The same flips for bases through $pK_b$.\n" +
        "- **$K_a \\times K_b = K_w$ for a conjugate pair** ($pK_a + pK_b = 14$ at 298 K). This is the one relation to memorise here, and it is the standard route to a conjugate's constant.\n" +
        "- **Pairs only.** $K_a \\times K_b = K_w$ holds between an acid and *its own* conjugate base. It does not link two unrelated species.\n" +
        "- **Diprotic shortcut:** for $\\ce{H2CO3}$, $\\ce{H3PO4}$ and similar, $K_{a_1} \\gg K_{a_2}$, so the second dissociation contributes almost no extra $\\ce{H+}$. Solve with $K_{a_1}$ alone unless the question asks for the later steps."),
      h.quiz([
        {
          question: "For a weak acid $\\ce{HA}$, which statement about its ionization constant $K_a$ is correct?",
          options: [
            "A larger $K_a$ at a fixed temperature means a stronger acid",
            "A larger $K_a$ means the acid ionizes more slowly",
            "$K_a$ has the same value for a strong acid and its conjugate base",
            "A larger $K_a$ goes with a larger $pK_a$",
          ], correct_index: 0,
          explanation: "$K_a$ puts products over reactant, so a larger value means more of the acid has split into $\\ce{H3O+}$ and $\\ce{A-}$, marking a stronger acid. It says nothing about speed. And since $pK_a = -\\log K_a$, a larger $K_a$ gives a smaller $pK_a$, so the last option is backwards.",
        },
        {
          question: "The $K_a$ of $\\ce{HCN}$ is $4.9 \\times 10^{-10}$. The $K_b$ of its conjugate base $\\ce{CN-}$ is closest to:",
          options: [
            "$4.9 \\times 10^{-10}$",
            "$2.0 \\times 10^{-5}$",
            "$4.9 \\times 10^{-24}$",
            "$2.0 \\times 10^{-4}$",
          ], correct_index: 1,
          explanation: "For a conjugate pair, $K_b = K_w / K_a = 10^{-14} / (4.9 \\times 10^{-10}) = 2.0 \\times 10^{-5}$. The first option wrongly assumes the pair shares a constant, and multiplying instead of dividing by $K_w$ gives the impossibly small $4.9 \\times 10^{-24}$.",
        },
        {
          question: "For phosphoric acid, $\\ce{H3PO4}$, why is $K_{a_2}$ much smaller than $K_{a_1}$?",
          options: [
            "The first proton removed makes the acid more concentrated",
            "The second proton is lighter and escapes faster",
            "Pulling a positive proton away from an already-negative ion is harder",
            "$K_{a_2}$ measures a different temperature from $K_{a_1}$",
          ], correct_index: 2,
          explanation: "After the first $\\ce{H+}$ leaves, the next one must be pulled from a negatively charged ion, and a positive proton holds tighter to a negative ion. That extra pull makes each step harder, so $K_{a_1} > K_{a_2} > K_{a_3}$. Concentration, proton mass and temperature are not the reason.",
        },
      ]),
    ];
  },
};
