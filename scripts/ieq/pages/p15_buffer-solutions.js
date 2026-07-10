// IEQ page 15 — Buffer Solutions (NCERT §7.12).
// A buffer resists a change in pH when a little acid or base is added, or on dilution.
//   Acidic buffer = weak acid + its salt (CH3COOH / CH3COONa, pH ~ 4.75).
//   Basic buffer  = weak base + its salt (NH4OH / NH4Cl, pH ~ 9.25).
// Henderson-Hasselbalch:  pH  = pKa + log([salt]/[acid])
//                         pOH = pKb + log([salt]/[base])
// At half-neutralisation / equal concentrations the log term is zero => pH = pKa (no
// calculation needed). Buffer range: salt/acid ratio 0.1 to 10, i.e. pH = pKa +/- 1.
// How it resists: the weak acid mops up added base; its salt mops up added acid.
// Folds NCERT Problem 7.22 (basic buffer 0.2 M NH4Cl + 0.1 M NH3, pKb 4.75 -> pH 8.95) and
// Problem 7.24 (pH of 0.10 M ammonia = 11.12; then 25 mL of 0.10 M HCl into 50 mL of it makes
// a buffer of 2.5 mmol NH3 + 2.5 mmol NH4+ in 75 mL -> pH 9.24) as worked(). Arithmetic
// verified against the NCERT PDF (pp. 215, 218).
// Voice: teacher-voice-profile + IEQ-exemplars. HIS points (used, not invented):
//   - B/D9/D10/D17: half-neutralisation toy-particle bookkeeping => pH = pKa, "calculate
//     karne ki bhi avashyakta nahi hai" / "you do not even need to calculate".
//   - B: buffer validity window, salt/acid ratio 0.1 to 10 (pH = pKa +/- 1).
//   - C/D10: a wall of given log values is often there to intimidate when pH = pKa.
// §5.X audited: no "Not X. It is Y." pairs; no banned metaphors; <=1 em-dash/para; plain
// SVO; say-it-once; second person; analogy-first with HIS bookkeeping analogy; no reveal
// framing; no intensifier-stacking; no triple-repetition; no universal claims.
module.exports = {
  page_number: 15,
  slug: 'buffer-solutions',
  title: 'Buffer Solutions',
  subtitle: 'Solutions that resist a change in pH.',
  page_type: 'lesson',
  build(h) {
    return [
      h.img(
        'Hand-drawn coloured illustration on a deep charcoal near-black background, warm muted earthy palette (teal, ochre, sage, indigo, cream), visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, science-notebook feel. Ultra-wide cinematic banner. A single beaker drawn like a chemist sketched it, with a pH meter dial above it whose needle is hand-lettered "pH 4.75" and stays pointed steadily at one mark. From the left a dropper labelled "add acid" releases a drop into the beaker; from the right a dropper labelled "add base" releases a drop. Small curved arrows show the drops being absorbed without moving the needle. A faint hand-lettered note underneath: "pH holds steady". Calm, uncluttered, no large text blocks.',
        '16:5'
      ),
      h.callout('fun_fact', 'Your Blood Holds a Steady pH',
        "Human blood sits at a pH near 7.4, and your body guards that number closely. Add a little acid to plain water and its pH drops at once, yet your blood barely shifts even as acids and bases pour into it all day from the food you eat and the energy you burn. The chemistry that holds the line is a **buffer**, a pairing of a weak partner and its salt that quietly absorbs whatever acid or base comes its way."),
      h.text(
        "A **buffer solution** resists a change in pH when a small amount of acid or base is added to it, or when it is diluted. Compare it with the bookkeeping you have already done for salts. A buffer keeps two reserves on hand: one that can soak up incoming acid, and one that can soak up incoming base. Whichever turns up, the matching reserve neutralises it, so the free $\\ce{H+}$ stays almost unchanged and the pH holds.\n\n" +
        "Buffers come in two kinds.\n\n" +
        "**An acidic buffer** is a weak acid together with its salt of a strong base. The standard pair is acetic acid with sodium acetate, $\\ce{CH3COOH}$ / $\\ce{CH3COONa}$, which holds a pH around $4.75$.\n\n" +
        "**A basic buffer** is a weak base together with its salt of a strong acid. The standard pair is ammonium hydroxide with ammonium chloride, $\\ce{NH4OH}$ / $\\ce{NH4Cl}$, which holds a pH around $9.25$.\n\n" +
        "Take the acidic buffer to see how it resists. Add a little base and the weak acid $\\ce{CH3COOH}$ neutralises it; add a little acid and the salt's anion $\\ce{CH3COO-}$ mops up the extra $\\ce{H+}$ back into $\\ce{CH3COOH}$. Either way the pH barely moves."
      ),
      h.heading('The Henderson equation, and why half-neutralisation gives $pH = pK_a$ for free',
        'Use the Henderson–Hasselbalch equation to find a buffer pH, and recognise when the log term vanishes so no calculation is needed.'),
      h.text(
        "The pH of an acidic buffer comes from the **Henderson–Hasselbalch equation**:\n\n" +
        "$$pH = pK_a + \\log\\frac{[\\text{salt}]}{[\\text{acid}]}$$\n\n" +
        "and a basic buffer has the matching version in $pOH$:\n\n" +
        "$$pOH = pK_b + \\log\\frac{[\\text{salt}]}{[\\text{base}]}$$\n\n" +
        "Now look at the log term. When the salt and the acid are present in equal amounts, their ratio is 1, and $\\log 1 = 0$. The whole term disappears and you are left with\n\n" +
        "$$pH = pK_a$$\n\n" +
        "This is the half-neutralisation result. Picture 100 particles of a weak acid being titrated: once 50 are neutralised, 50 have become salt and 50 acid remain, so salt equals acid, the ratio is 1, and the pH reads $pK_a$ straight off. You do not even need to calculate. Examiners know this, and often print a wall of $\\log$ values in the stem to make the question look heavy. When the salt and acid are equal, none of those numbers are needed.\n\n" +
        "A buffer only does its job while the two amounts stay reasonably close. The working window is a salt-to-acid ratio between $0.1$ and $10$, which is\n\n" +
        "$$pH = pK_a \\pm 1$$\n\n" +
        "Push the ratio past 10 or below 0.1 and the mixture stops behaving like a buffer; treat it as plain salt hydrolysis or a simple weak acid instead."
      ),
      h.img(
        'Hand-drawn coloured illustration, deep charcoal near-black background, warm muted earthy palette, visible ink/pencil line work with soft gouache fills, NO neon/glow/3D, neat hand-lettered labels, clean science-notebook feel. A central beaker drawn like a chemist sketched it, holding a labelled mixture "weak acid CH3COOH + its salt CH3COONa". A vertical pH ruler beside the beaker with the needle fixed at "pKa" in the middle. On the LEFT a dropper "+ OH-" with a curved arrow into the beaker and a small note "weak acid neutralises it"; on the RIGHT a dropper "+ H+" with a curved arrow and a small note "salt neutralises it". Below, the boxed hand-lettered equation "pH = pKa + log([salt]/[acid])" and beside it a tiny note "salt = acid -> log = 0 -> pH = pKa", plus a faint band marked "buffer range: pKa +/- 1". Warm ink colours.',
        '16:9',
        'A buffer holds its pH near pKₐ: added base is neutralised by the weak acid, added acid by its salt. When salt equals acid the log term is zero, so pH = pKₐ — and the buffer works across pKₐ ± 1.'
      ),
      h.worked('Problem 7.22 (NCERT)', 'ncert_intext',
        "Calculate the pH of the solution in which $0.2$ M $\\ce{NH4Cl}$ and $0.1$ M $\\ce{NH3}$ are present. The $pK_b$ of the ammonia solution is $4.75$.",
        "**Step 1 — classify the mixture.** A weak base ($\\ce{NH3}$) sits alongside its salt ($\\ce{NH4Cl}$, which supplies $\\ce{NH4+}$). A weak base with its salt is a basic buffer, so work in $pOH$.\n\n" +
        "**Step 2 — get $K_b$ from $pK_b$.**\n\n" +
        "$$K_b = 10^{-4.75} = 1.77 \\times 10^{-5}$$\n\n" +
        "**Step 3 — set up the equilibrium** $\\ce{NH3 + H2O <=> NH4+ + OH-}$ with $x = [\\ce{OH-}]$ formed. The salt already gives $0.20$ M $\\ce{NH4+}$:\n\n" +
        "$$K_b = \\frac{[\\ce{NH4+}][\\ce{OH-}]}{[\\ce{NH3}]} = \\frac{(0.20 + x)(x)}{0.10 - x} = 1.77 \\times 10^{-5}$$\n\n" +
        "**Step 4 — use that $x$ is tiny.** Since $x$ is small next to $0.10$ and $0.20$, take $0.20 + x \\approx 0.20$ and $0.10 - x \\approx 0.10$:\n\n" +
        "$$x = [\\ce{OH-}] = \\frac{1.77 \\times 10^{-5} \\times 0.10}{0.20} = 0.88 \\times 10^{-5}\\ \\text{M}$$\n\n" +
        "**Step 5 — convert to pH.**\n\n" +
        "$$[\\ce{H+}] = \\frac{10^{-14}}{0.88 \\times 10^{-5}} = 1.12 \\times 10^{-9}\\ \\text{M}$$\n\n" +
        "$$pH = -\\log(1.12 \\times 10^{-9}) = 8.95$$\n\n" +
        "**Answer:** pH $= 8.95$. The basic buffer holds the solution mildly basic, near the ammonia buffer's home of about $9.25$.",
        'tap_to_reveal'),
      h.worked('Problem 7.24 (NCERT)', 'ncert_intext',
        "Calculate the pH of a $0.10$ M ammonia solution. Then calculate the pH after $50.0$ mL of this solution is treated with $25.0$ mL of $0.10$ M HCl. The dissociation constant of ammonia, $K_b = 1.77 \\times 10^{-5}$.",
        "**Part A — the plain $0.10$ M ammonia.** With $\\ce{NH3 + H2O <=> NH4+ + OH-}$ and $[\\ce{NH4+}] = [\\ce{OH-}] = x$:\n\n" +
        "$$K_b = \\frac{x^2}{0.10 - x} \\approx \\frac{x^2}{0.10} = 1.77 \\times 10^{-5}$$\n\n" +
        "$$x = [\\ce{OH-}] = 1.33 \\times 10^{-3}\\ \\text{M}$$\n\n" +
        "$$[\\ce{H+}] = \\frac{10^{-14}}{1.33 \\times 10^{-3}} = 7.51 \\times 10^{-12}\\ \\text{M} \\;\\Rightarrow\\; pH = 11.12$$\n\n" +
        "**Part B — after adding the acid, a buffer forms.** Count in millimoles. $50.0$ mL of $0.10$ M ammonia is $5.0$ mmol $\\ce{NH3}$; $25.0$ mL of $0.10$ M HCl is $2.5$ mmol $\\ce{HCl}$. The strong acid neutralises an equal amount of ammonia:\n\n" +
        "$$\\ce{NH3 + HCl -> NH4+ + Cl-}$$\n\n" +
        "That uses up $2.5$ mmol of the $5.0$ mmol ammonia, leaving $2.5$ mmol $\\ce{NH3}$ unreacted and making $2.5$ mmol $\\ce{NH4+}$. A weak base sitting with its salt is a basic buffer.\n\n" +
        "**Read off the buffer.** In the total $75$ mL, both $\\ce{NH3}$ and $\\ce{NH4+}$ are $2.5\\,\\text{mmol}/75\\,\\text{mL} = 0.033$ M, so $[\\text{salt}] = [\\text{base}]$ and their ratio is 1.\n\n" +
        "$$K_b = \\frac{[\\ce{NH4+}][\\ce{OH-}]}{[\\ce{NH4OH}]} = \\frac{(0.033)(y)}{0.033} \\;\\Rightarrow\\; y = [\\ce{OH-}] = 1.77 \\times 10^{-5}\\ \\text{M}$$\n\n" +
        "$$[\\ce{H+}] = \\frac{10^{-14}}{1.77 \\times 10^{-5}} = 0.56 \\times 10^{-9}\\ \\text{M} \\;\\Rightarrow\\; pH = 9.24$$\n\n" +
        "**Answer:** the $0.10$ M ammonia has pH $11.12$; after the acid is added a buffer forms and the pH falls to $9.24$. Half-neutralisation made salt equal base, so $[\\ce{OH-}]$ came out equal to $K_b$ with no log work needed.",
        'tap_to_reveal'),
      h.reasoning('quantitative',
        "An acidic buffer is made from a weak acid ($pK_a = 4.74$) and its sodium salt, with the salt and the acid at exactly the same concentration. A question prints a long table of $\\log$ values and asks for the pH. What is the pH, and how much calculation does it take?",
        [
          "pH $= 4.74$, found at once because $[\\text{salt}] = [\\text{acid}]$ makes the log term zero — no calculation needed",
          "It cannot be found without first reading the $\\log$ values from the printed table",
          "pH $= 9.26$, because a buffer is always on the basic side",
          "pH $= 7.00$, since equal salt and acid must give a neutral solution",
        ], 0,
        "Henderson gives $pH = pK_a + \\log([\\text{salt}]/[\\text{acid}])$. With the salt and acid equal, the ratio is 1 and $\\log 1 = 0$, so the whole term drops out and $pH = pK_a = 4.74$ directly. The table of $\\log$ values is there to make the question look heavy; for an equal-amounts buffer none of it is needed. An acidic buffer is not forced onto the basic side, and equal salt and acid do not make a neutral solution.",
        2),
      h.callout('exam_tip', 'JEE / NEET — Working a Buffer',
        "- **Name the buffer first.** Weak acid + its salt $\\rightarrow$ acidic buffer, use $pH = pK_a + \\log([\\text{salt}]/[\\text{acid}])$. Weak base + its salt $\\rightarrow$ basic buffer, use $pOH = pK_b + \\log([\\text{salt}]/[\\text{base}])$.\n" +
        "- **Equal amounts? Stop calculating.** When salt and acid (or salt and base) are equal, the log term is zero, so $pH = pK_a$ (or $pOH = pK_b$). A printed wall of $\\log$ values is often there only to slow you down.\n" +
        "- **Strong acid or base added to a weak partner makes a buffer.** Work in millimoles: let the strong reagent neutralise an equal amount of the weak one, then read off the salt and the leftover weak partner. Problem 7.24 is exactly this.\n" +
        "- **Buffer range is $pK_a \\pm 1$.** The salt-to-acid ratio must sit between $0.1$ and $10$. Outside that window, stop calling it a buffer and treat it as salt hydrolysis or a plain weak acid or base.\n" +
        "- **Classic trap:** dilution does not move a buffer's pH much, because the salt-to-acid ratio is unchanged. Do not recompute the pH as if it were a simple weak acid being diluted."),
      h.quiz([
        {
          question: "Which of these mixtures acts as an acidic buffer?",
          options: [
            "$\\ce{HCl}$ and $\\ce{NaCl}$ (a strong acid and its salt)",
            "$\\ce{CH3COOH}$ and $\\ce{CH3COONa}$ (a weak acid and its salt)",
            "$\\ce{NaOH}$ and $\\ce{NaCl}$ (a strong base and a neutral salt)",
            "$\\ce{NaCl}$ in pure water",
          ], correct_index: 1,
          explanation: "An acidic buffer is a weak acid with its salt of a strong base, so acetic acid with sodium acetate qualifies and holds a pH near $4.75$. A strong acid such as $\\ce{HCl}$ has no reserve to soak up added acid, so $\\ce{HCl}$/$\\ce{NaCl}$ does not buffer, and the other two mixtures have no weak-acid–salt pair at all.",
        },
        {
          question: "An acidic buffer has acetic acid and sodium acetate at equal concentrations, with $pK_a = 4.74$. Its pH is:",
          options: [
            "$4.74$, because the salt-to-acid ratio is 1 and the log term is zero",
            "$9.26$, because acetate makes the solution basic",
            "$7.00$, because equal salt and acid neutralise to neutral",
            "Impossible to find without the concentration value",
          ], correct_index: 0,
          explanation: "By Henderson, $pH = pK_a + \\log([\\text{salt}]/[\\text{acid}])$. Equal concentrations give a ratio of 1, and $\\log 1 = 0$, so $pH = pK_a = 4.74$. The actual concentration never enters once the two are equal, which is why this is the half-neutralisation shortcut.",
        },
        {
          question: "To $50.0$ mL of $0.10$ M ammonia ($5.0$ mmol) you add $25.0$ mL of $0.10$ M HCl ($2.5$ mmol). What is in the flask afterwards?",
          options: [
            "Only $\\ce{NH4Cl}$, because the acid neutralises all the ammonia",
            "$2.5$ mmol of unreacted $\\ce{NH3}$ together with $2.5$ mmol of $\\ce{NH4+}$ — a basic buffer",
            "Excess HCl, so the solution is strongly acidic",
            "Only $\\ce{NH3}$, because HCl is too weak to react with it",
          ], correct_index: 1,
          explanation: "The $2.5$ mmol of strong acid neutralises $2.5$ mmol of the $5.0$ mmol ammonia, leaving $2.5$ mmol $\\ce{NH3}$ and making $2.5$ mmol $\\ce{NH4+}$. A weak base with its salt is a basic buffer, and because the two are equal the pH comes out at $9.24$ with no log work. The acid is the limiting reagent, so it cannot all turn to $\\ce{NH4Cl}$ or leave HCl in excess.",
        },
      ]),
    ];
  },
};
