// IEQ practice page — end-of-chapter Practice for Ionic Equilibrium (Ch.7).
// Built from NCERT Exemplar Chapter 7 (Equilibrium), restricted to the
// ionic-equilibrium sub-topics that map to this book's Ionic Equilibrium chapter
// (acid/base theories, Ka/Kb, pH/Kw, salt hydrolysis/buffers, solubility/Ksp).
// One practice_bank block, five sub-topic sections.
// Question stems + options transcribed from 11-Chemistry-Exemplar-Chapter-7.pdf.
// Worked solutions from 11-Chemistry-Exemplar-Chapter-7-answer.pdf, EXCEPT:
//   - Q8:  answer CORRECTED to (ii) — the official key prints (iv), which is the
//          acid-strength order, NOT the pH order asked for. (correct_index 1)
//   - Q31: answer CORRECTED to S ≈ 6.4×10⁻⁵ mol dm⁻³ — the official key prints
//          6×10⁻⁴, which carries a power-of-ten slip in the quadratic.
//   - Q36: not in the official key; solution supplied per the build spec.
//   - Q49: option (iii) is "A is false but R is true" (non-standard) — transcribed
//          exactly as printed for this question.
module.exports = {
  page_number: 20,
  chapter: 7,
  slug: 'ionic-equilibrium-practice',
  title: 'Practice — Ionic Equilibrium',
  subtitle: 'Every NCERT textbook exercise and NCERT Exemplar question for the chapter, by sub-topic.',
  build(h) {
    const ncert = require('./ncert_ieq');
    const sections = [
          {
            id: 'sec-theories',
            title: 'Acid–Base Theories & Conjugate Pairs',
            blurb: 'Arrhenius / Brønsted–Lowry / Lewis concepts, conjugate acid–base pairs, and relative strengths.',
            items: [
              {
                kind: 'mcq',
                id: 'ieq-ex-q10',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q10',
                prompt: 'Acidity of $\\ce{BF3}$ can be explained on the basis of which of the following concepts?',
                options: [
                  'Arrhenius concept',
                  'Bronsted Lowry concept',
                  'Lewis concept',
                  'Bronsted Lowry as well as Lewis concept.',
                ],
                correct_index: 2,
                explanation: '$\\ce{BF3}$ has **no proton to donate**, so the Arrhenius and Brønsted–Lowry pictures (which both define an acid by its $\\ce{H+}$) cannot explain its acidity. The boron in $\\ce{BF3}$ is **electron-deficient** — it has a vacant orbital and readily accepts a lone pair. That is exactly the **Lewis** definition of an acid (an electron-pair acceptor). So only the Lewis concept explains the acidity of $\\ce{BF3}$ → option (iii).',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q22',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q22',
                prompt: 'The ionisation of hydrochloric acid in water is given below:\n\n' +
                  '$$\\ce{HCl(aq) + H2O(l) <=> H3O+(aq) + Cl-(aq)}$$\n\n' +
                  'Label two conjugate acid–base pairs in this ionisation.',
                answer: 'Pair 1: HCl / Cl⁻ (acid / conjugate base); Pair 2: H₂O / H₃O⁺ (base / conjugate acid).',
                solution: 'A conjugate acid–base pair differs by exactly **one proton** ($\\ce{H+}$). Read each species before and after it gains or loses that proton:\n\n' +
                  '- **Pair 1 — $\\ce{HCl}$ / $\\ce{Cl-}$.** $\\ce{HCl}$ **donates** a proton, so it is the acid; what is left, $\\ce{Cl-}$, is its **conjugate base**.\n' +
                  '- **Pair 2 — $\\ce{H2O}$ / $\\ce{H3O+}$.** $\\ce{H2O}$ **accepts** that proton, so it is the base; the $\\ce{H3O+}$ it becomes is its **conjugate acid**.\n\n' +
                  'So: $\\ce{HCl}$ (acid) / $\\ce{Cl-}$ (conjugate base), and $\\ce{H2O}$ (base) / $\\ce{H3O+}$ (conjugate acid).',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q24',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q24',
                prompt: '$\\ce{BF3}$ does not have a proton but still acts as an acid and reacts with $\\ce{NH3}$. Why is it so? What type of bond is formed between the two?',
                answer: 'BF₃ is a Lewis acid (electron-deficient); it accepts the lone pair of NH₃, forming a coordinate (dative) bond, H₃N→BF₃.',
                solution: 'An acid does not have to carry a proton. Under the **Lewis** definition, an acid is anything that can **accept a pair of electrons**. The boron in $\\ce{BF3}$ has only six electrons around it — it is **electron-deficient** and has a vacant orbital — so it behaves as a Lewis acid.\n\n' +
                  '$\\ce{NH3}$ has a **lone pair on nitrogen**, making it a Lewis base. When they meet, nitrogen donates that lone pair into boron’s empty orbital:\n\n' +
                  '$$\\ce{H3N: -> BF3}$$\n\n' +
                  'Because **both** shared electrons come from the same atom (nitrogen), the new bond is a **coordinate (dative) bond**, not an ordinary covalent bond.',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q26',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q26',
                prompt: 'Conjugate acid of a weak base is always stronger. What will be the decreasing order of basic strength of the following conjugate bases?\n\n' +
                  '$$\\ce{OH-},\\ \\ce{RO-},\\ \\ce{CH3COO-},\\ \\ce{Cl-}$$',
                answer: 'RO⁻ > OH⁻ > CH₃COO⁻ > Cl⁻',
                solution: 'The **weaker** the parent acid, the **stronger** its conjugate base. Rank the parent acids from weakest to strongest and the conjugate bases fall in the opposite order:\n\n' +
                  '- $\\ce{ROH}$ (an alcohol) is the **weakest** acid here → $\\ce{RO-}$ is the **strongest** base.\n' +
                  '- $\\ce{H2O}$ is a slightly stronger acid than the alcohol → $\\ce{OH-}$ comes next.\n' +
                  '- $\\ce{CH3COOH}$ (acetic acid) is a moderate weak acid → $\\ce{CH3COO-}$ is weaker still.\n' +
                  '- $\\ce{HCl}$ is a **strong** acid → $\\ce{Cl-}$ is the **weakest** base.\n\n' +
                  '**Decreasing basic strength:** $\\ce{RO- > OH- > CH3COO- > Cl-}$.',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q36',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q36',
                prompt: 'A reaction between ammonia and boron trifluoride is given below:\n\n' +
                  '$$\\ce{NH3 + BF3 -> H3N:BF3}$$\n\n' +
                  'Identify the acid and base in this reaction. Which theory explains it? What is the hybridisation of B and N in the reactants?',
                answer: 'BF₃ = Lewis acid, NH₃ = Lewis base; explained by the Lewis theory; a coordinate (dative) bond forms N→B. In the reactants: B (in BF₃) is sp², N (in NH₃) is sp³.',
                solution: '**Acid and base.** $\\ce{BF3}$ is the **Lewis acid** — boron is electron-deficient and has a vacant orbital, so it accepts an electron pair. $\\ce{NH3}$ is the **Lewis base** — nitrogen carries a lone pair it can donate.\n\n' +
                  '**Theory.** This is explained by the **Lewis theory** of acids and bases (electron-pair acceptor + electron-pair donor). Neither species exchanges a proton, so the Arrhenius/Brønsted pictures do not apply.\n\n' +
                  '**The bond formed.** Nitrogen donates its lone pair into boron’s empty orbital, forming a **coordinate (dative) bond** from N to B in the adduct $\\ce{H3N:BF3}$.\n\n' +
                  '**Hybridisation in the reactants.**\n' +
                  '- B in $\\ce{BF3}$ is **sp²** — trigonal planar, three B–F bonds and an empty $p$ orbital.\n' +
                  '- N in $\\ce{NH3}$ is **sp³** — pyramidal, three N–H bonds and one lone pair.\n\n' +
                  '(On forming the adduct, boron picks up a fourth bond and becomes **sp³**.)',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q41',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q41',
                prompt: 'Match the following species with the corresponding conjugate acid.\n\n' +
                  '| Species | Conjugate acid |\n' +
                  '|---|---|\n' +
                  '| (i) $\\ce{NH3}$ | (a) $\\ce{CO3^2-}$ |\n' +
                  '| (ii) $\\ce{HCO3-}$ | (b) $\\ce{NH4+}$ |\n' +
                  '| (iii) $\\ce{H2O}$ | (c) $\\ce{H3O+}$ |\n' +
                  '| (iv) $\\ce{HSO4-}$ | (d) $\\ce{H2SO4}$ |\n' +
                  '| | (e) $\\ce{H2CO3}$ |',
                answer: '(i)→(b), (ii)→(e), (iii)→(c), (iv)→(d)',
                solution: 'The **conjugate acid** of a species is what you get when you **add one proton** ($\\ce{H+}$) to it:\n\n' +
                  '- **(i) $\\ce{NH3} + \\ce{H+} \\to \\ce{NH4+}$** → **(b)**.\n' +
                  '- **(ii) $\\ce{HCO3-} + \\ce{H+} \\to \\ce{H2CO3}$** → **(e)**.\n' +
                  '- **(iii) $\\ce{H2O} + \\ce{H+} \\to \\ce{H3O+}$** → **(c)**.\n' +
                  '- **(iv) $\\ce{HSO4-} + \\ce{H+} \\to \\ce{H2SO4}$** → **(d)**.\n\n' +
                  'Option (a) $\\ce{CO3^2-}$ is unused — it is the conjugate **base** of $\\ce{HCO3-}$ (proton removed), not a conjugate acid.',
              },
              {
                kind: 'mcq',
                id: 'ieq-ex-q44',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q44',
                prompt: '**Assertion (A):** Increasing order of acidity of hydrogen halides is $\\ce{HF < HCl < HBr < HI}$.\n\n' +
                  '**Reason (R):** While comparing acids formed by the elements belonging to the same group of the periodic table, H–A bond strength is a more important factor in determining acidity of an acid than the polar nature of the bond.',
                options: [
                  'Both A and R are true and R is the correct explanation of A.',
                  'Both A and R are true but R is not the correct explanation of A.',
                  'A is true but R is false.',
                  'Both A and R are false.',
                ],
                correct_index: 0,
                explanation: 'Assertion is **true**: acidity of the hydrogen halides really does rise $\\ce{HF < HCl < HBr < HI}$. Reason is **true and explains it**: going **down** group 17, the H–A bond gets longer and **weaker**, so the proton is released more easily. Down a group this **bond strength** matters more than bond polarity (HF is the most polar yet the *weakest* acid, precisely because its short H–F bond is hard to break). So both true and R correctly explains A → option (i).',
              },
            ],
          },
          {
            id: 'sec-ka-kb',
            title: 'Electrolytes, Kₐ/K_b & Strength',
            blurb: 'Ionisation constants Ka/Kb, multi-step Ka relationships, electrolyte conductance, and relative strengths.',
            items: [
              {
                kind: 'mcq',
                id: 'ieq-ex-q8',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q8',
                prompt: 'The ionisation constant of an acid, $K_a$, is the measure of strength of an acid. The $K_a$ values of acetic acid, hypochlorous acid and formic acid are $1.74 \\times 10^{-5}$, $3.0 \\times 10^{-8}$ and $1.8 \\times 10^{-4}$ respectively. Which of the following orders of pH of $0.1\\text{ mol dm}^{-3}$ solutions of these acids is correct?',
                options: [
                  'acetic acid $>$ hypochlorous acid $>$ formic acid',
                  'hypochlorous acid $>$ acetic acid $>$ formic acid',
                  'formic acid $>$ hypochlorous acid $>$ acetic acid',
                  'formic acid $>$ acetic acid $>$ hypochlorous acid',
                ],
                correct_index: 1,
                explanation: 'A larger $K_a$ means a **stronger** acid, which releases more $\\ce{H+}$ and so has a **lower** pH. Rank by $K_a$:\n\n' +
                  '- Formic acid $K_a = 1.8 \\times 10^{-4}$ — **strongest** → **lowest** pH.\n' +
                  '- Acetic acid $K_a = 1.74 \\times 10^{-5}$ — middle.\n' +
                  '- Hypochlorous acid $K_a = 3.0 \\times 10^{-8}$ — **weakest** → **highest** pH.\n\n' +
                  'pH runs **opposite** to acid strength, so the pH order (high → low) is **hypochlorous acid $>$ acetic acid $>$ formic acid** → option (ii).\n\n' +
                  '*Note:* the official Exemplar key prints (iv), but that is the order of **acid strength**, not the **pH** order the question asks for — so the key is in error here. The correct pH order is option (ii).',
              },
              {
                kind: 'mcq',
                id: 'ieq-ex-q9',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q9',
                prompt: '$K_{a_1}$, $K_{a_2}$ and $K_{a_3}$ are the respective ionisation constants for the following reactions.\n\n' +
                  '$$\\ce{H2S <=> H+ + HS-}$$\n' +
                  '$$\\ce{HS- <=> H+ + S^2-}$$\n' +
                  '$$\\ce{H2S <=> 2H+ + S^2-}$$\n\n' +
                  'The correct relationship between $K_{a_1}$, $K_{a_2}$ and $K_{a_3}$ is:',
                options: [
                  '$K_{a_3} = K_{a_1} \\times K_{a_2}$',
                  '$K_{a_3} = K_{a_1} + K_{a_2}$',
                  '$K_{a_3} = K_{a_1} - K_{a_2}$',
                  '$K_{a_3} = K_{a_1} / K_{a_2}$',
                ],
                correct_index: 0,
                explanation: 'The third reaction is the **sum** of the first two:\n\n' +
                  '$$\\ce{H2S <=> H+ + HS-} \\quad (K_{a_1})$$\n' +
                  '$$\\ce{HS- <=> H+ + S^2-} \\quad (K_{a_2})$$\n\n' +
                  'Adding two reactions **multiplies** their equilibrium constants. So $K_{a_3} = K_{a_1} \\times K_{a_2}$ → option (i).',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q23',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q23',
                prompt: 'The aqueous solution of sugar does not conduct electricity. However, when sodium chloride is added to water, it conducts electricity. How will you explain this statement on the basis of ionisation and how is it affected by concentration of sodium chloride?',
                answer: 'Sugar is a non-electrolyte (does not ionise) so it cannot conduct; NaCl is a strong electrolyte, ionising completely into Na⁺ and Cl⁻, so it conducts — and conductance rises with concentration as more ions are released.',
                solution: 'Electricity flows through a solution only when **mobile ions** are present to carry the charge.\n\n' +
                  '- **Sugar** dissolves but does **not ionise** — it stays as neutral molecules. With no ions to carry charge, a sugar solution **does not conduct**. It is a **non-electrolyte**.\n' +
                  '- **Sodium chloride** is a **strong electrolyte**. In water it ionises **completely**:\n\n' +
                  '$$\\ce{NaCl(s) -> Na+(aq) + Cl-(aq)}$$\n\n' +
                  'These free $\\ce{Na+}$ and $\\ce{Cl-}$ ions carry the current, so the solution **conducts**.\n\n' +
                  '**Effect of concentration:** raising the concentration of $\\ce{NaCl}$ releases **more ions** into solution, so the **conductance increases**.',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q25',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q25',
                prompt: 'Ionisation constant of a weak base MOH is given by the expression\n\n' +
                  '$$K_b = \\frac{[\\ce{M+}][\\ce{OH-}]}{[\\ce{MOH}]}.$$\n\n' +
                  'Values of ionisation constant of some weak bases at a particular temperature are given below:\n\n' +
                  '| Base | $K_b$ |\n' +
                  '|---|---|\n' +
                  '| Dimethylamine | $5.4 \\times 10^{-4}$ |\n' +
                  '| Urea | $1.3 \\times 10^{-14}$ |\n' +
                  '| Pyridine | $1.77 \\times 10^{-9}$ |\n' +
                  '| Ammonia | $1.77 \\times 10^{-5}$ |\n\n' +
                  'Arrange the bases in decreasing order of the extent of their ionisation at equilibrium. Which of the above bases is the strongest?',
                answer: 'Dimethylamine > Ammonia > Pyridine > Urea; the strongest base is dimethylamine.',
                solution: 'A **larger $K_b$** means the base ionises to a **greater extent** and is therefore **stronger**. Just rank the bases by their $K_b$ values, largest first:\n\n' +
                  '- Dimethylamine — $K_b = 5.4 \\times 10^{-4}$ (largest)\n' +
                  '- Ammonia — $K_b = 1.77 \\times 10^{-5}$\n' +
                  '- Pyridine — $K_b = 1.77 \\times 10^{-9}$\n' +
                  '- Urea — $K_b = 1.3 \\times 10^{-14}$ (smallest)\n\n' +
                  '**Decreasing order of ionisation:** dimethylamine $>$ ammonia $>$ pyridine $>$ urea. The **strongest** base is **dimethylamine**, since it ionises to the maximum extent.',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q32',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q32',
                prompt: 'pH of $0.08\\text{ mol dm}^{-3}$ $\\ce{HOCl}$ solution is $2.85$. Calculate its ionisation constant.',
                answer: 'Ka ≈ 2.5 × 10⁻⁵',
                solution: '**Step 1 — find $[\\ce{H+}]$ from the pH.**\n\n' +
                  '$$-\\text{pH} = \\log[\\ce{H+}] \\quad\\Rightarrow\\quad \\log[\\ce{H+}] = -2.85 = \\bar{3}.15$$\n\n' +
                  '$$[\\ce{H+}] = 1.413 \\times 10^{-3}\\text{ mol dm}^{-3}.$$\n\n' +
                  '**Step 2 — use the weak monobasic-acid relation.** For a weak acid, $[\\ce{H+}] = \\sqrt{K_a\\,C}$, so $K_a = \\frac{[\\ce{H+}]^2}{C}$ with $C = 0.08$:\n\n' +
                  '$$K_a = \\frac{(1.413 \\times 10^{-3})^2}{0.08} = \\frac{1.997 \\times 10^{-6}}{0.08} = 2.4957 \\times 10^{-5}.$$\n\n' +
                  '**Answer:** $K_a \\approx 2.5 \\times 10^{-5}$.',
              },
            ],
          },
          {
            id: 'sec-ph',
            title: 'pH, Kw & Calculations',
            blurb: 'Temperature dependence of Kw, pH of weak acids, and the very-dilute / mixing pH cases.',
            items: [
              {
                kind: 'mcq',
                id: 'ieq-ex-q7',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q7',
                prompt: 'The pH of neutral water at $25\\,^\\circ\\text{C}$ is $7.0$. As the temperature increases, ionisation of water increases, however, the concentration of $\\ce{H+}$ ions and $\\ce{OH-}$ ions are equal. What will be the pH of pure water at $60\\,^\\circ\\text{C}$?',
                options: [
                  'Equal to 7.0',
                  'Greater than 7.0',
                  'Less than 7.0',
                  'Equal to zero',
                ],
                correct_index: 2,
                explanation: 'Heating water makes it ionise **more**, so $K_w$ rises and both $[\\ce{H+}]$ and $[\\ce{OH-}]$ go **up** (staying equal to each other). A higher $[\\ce{H+}]$ means a **lower pH**, so pure water at $60\\,^\\circ\\text{C}$ has pH **less than 7.0** → option (iii). The water is still **neutral** (since $[\\ce{H+}] = [\\ce{OH-}]$); only the numerical pH of neutrality has shifted below 7.',
              },
              {
                kind: 'mcq',
                id: 'ieq-ex-q13',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q13',
                prompt: 'What will be the value of pH of $0.01\\text{ mol dm}^{-3}$ $\\ce{CH3COOH}$ ($K_a = 1.74 \\times 10^{-5}$)?',
                options: ['3.4', '3.6', '3.9', '3.0'],
                correct_index: 0,
                explanation: 'For a weak acid, $[\\ce{H+}] = \\sqrt{K_a\\,C}$:\n\n' +
                  '$$[\\ce{H+}] = \\sqrt{(1.74 \\times 10^{-5})(0.01)} = \\sqrt{1.74 \\times 10^{-7}} = 4.17 \\times 10^{-4}.$$\n\n' +
                  'Then $\\text{pH} = -\\log(4.17 \\times 10^{-4}) = 3.4$ → option (i).',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q29',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q29',
                prompt: 'On the basis of the equation $\\text{pH} = -\\log[\\ce{H+}]$, the pH of $10^{-8}\\text{ mol dm}^{-3}$ solution of HCl should be 8. However, it is observed to be less than 7.0. Explain the reason.',
                answer: 'At 10⁻⁸ M the acid is so dilute that water’s own H⁺ is no longer negligible; including it makes [H⁺] just above 10⁻⁷, so pH is just below 7 (never above 7 for an acid).',
                solution: 'The naïve calculation only counts the $\\ce{H+}$ from the acid and ignores the $\\ce{H+}$ that **water itself** supplies. That is fine for ordinary concentrations, but here the acid is **extremely dilute** ($10^{-8}\\text{ mol dm}^{-3}$).\n\n' +
                  'At this dilution the acid contributes only $10^{-8}\\text{ mol L}^{-1}$ of $\\ce{H+}$, which is **smaller** than the $\\approx 10^{-7}\\text{ mol L}^{-1}$ that pure water already provides. So the water’s contribution is **no longer negligible** and must be added in.\n\n' +
                  'Adding both sources gives a total $[\\ce{H+}]$ **just above** $10^{-7}$, which makes the pH come out **just below 7** — not 8. An acidic solution can never have pH greater than 7, so the answer of 8 was impossible; correcting for water fixes it.',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q30',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q30',
                prompt: 'pH of a solution of a strong acid is $5.0$. What will be the pH of the solution obtained after diluting the given solution $100$ times?',
                answer: 'pH ≈ 6.70',
                solution: '**Start.** pH $= 5.0$, so $[\\ce{H+}] = 10^{-5}\\text{ mol L}^{-1}$.\n\n' +
                  '**Dilute 100×.** Naïvely the acid’s $[\\ce{H+}]$ drops to $10^{-5}/100 = 10^{-7}\\text{ mol L}^{-1}$, which would give pH $= 7$. But a pH of exactly 7 is **impossible for an acid** — it signals the solution is now so dilute that **water’s own $\\ce{H+}$** must be counted.\n\n' +
                  '**Add the water contribution.** Total $[\\ce{H+}]$ = (from acid) + (from water) $= 10^{-7} + 10^{-7} = 2 \\times 10^{-7}\\text{ mol L}^{-1}$.\n\n' +
                  '$$\\text{pH} = -\\log(2 \\times 10^{-7}) = 7 - \\log 2 = 7 - 0.3010 = 6.699.$$\n\n' +
                  '**Answer:** pH $\\approx 6.70$ — still acidic, just below 7, as it must be.',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q33',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q33',
                prompt: 'Calculate the pH of a solution formed by mixing equal volumes of two solutions A and B of a strong acid having $\\text{pH} = 6$ and $\\text{pH} = 4$ respectively.',
                answer: 'pH = 4.3',
                solution: '**Find $[\\ce{H+}]$ in each solution.**\n\n' +
                  '- Solution A: pH $= 6 \\Rightarrow [\\ce{H+}] = 10^{-6}\\text{ mol L}^{-1}$.\n' +
                  '- Solution B: pH $= 4 \\Rightarrow [\\ce{H+}] = 10^{-4}\\text{ mol L}^{-1}$.\n\n' +
                  '**Mix equal volumes** (take 1 L of each, total 2 L). Total moles of $\\ce{H+}$ = $10^{-6} + 10^{-4} = 10^{-4}(1 + 0.01) = 1.01 \\times 10^{-4}$ mol, spread over 2 L:\n\n' +
                  '$$[\\ce{H+}] = \\frac{1.01 \\times 10^{-4}}{2} \\approx 0.5 \\times 10^{-4} = 5 \\times 10^{-5}\\text{ mol L}^{-1}.$$\n\n' +
                  '**Take the pH.**\n\n' +
                  '$$\\text{pH} = -\\log(5 \\times 10^{-5}) = 5 - \\log 5 = 5 - 0.6990 = 4.3010.$$\n\n' +
                  '**Answer:** pH $= 4.3$.',
              },
            ],
          },
          {
            id: 'sec-hydrolysis',
            title: 'Salt Hydrolysis & Buffers',
            blurb: 'Buffer composition, pH of salt solutions, ordering by hydrolysis, and assertion-reason on buffers.',
            items: [
              {
                kind: 'mcq',
                id: 'ieq-ex-q11',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q11',
                prompt: 'Which of the following will produce a buffer solution when mixed in equal volumes?',
                options: [
                  '$0.1\\text{ mol dm}^{-3}$ $\\ce{NH4OH}$ and $0.1\\text{ mol dm}^{-3}$ $\\ce{HCl}$',
                  '$0.05\\text{ mol dm}^{-3}$ $\\ce{NH4OH}$ and $0.1\\text{ mol dm}^{-3}$ $\\ce{HCl}$',
                  '$0.1\\text{ mol dm}^{-3}$ $\\ce{NH4OH}$ and $0.05\\text{ mol dm}^{-3}$ $\\ce{HCl}$',
                  '$0.1\\text{ mol dm}^{-3}$ $\\ce{CH3COONa}$ and $0.1\\text{ mol dm}^{-3}$ $\\ce{NaOH}$',
                ],
                correct_index: 2,
                explanation: 'A basic buffer needs a **weak base left over** together with **its salt**. Compare moles after the acid neutralises the base:\n\n' +
                  '- **(iii)** $0.1$ $\\ce{NH4OH}$ + $0.05$ $\\ce{HCl}$: the acid is in **deficit**, so it converts only half the base to $\\ce{NH4Cl}$ and leaves **excess $\\ce{NH4OH}$**. Weak base + its salt → **buffer**. ✓\n' +
                  '- (i) Equal moles → all base neutralised, no base left → just $\\ce{NH4Cl}$, not a buffer.\n' +
                  '- (ii) Acid in excess → leftover strong acid, not a buffer.\n' +
                  '- (iv) $\\ce{CH3COONa}$ + $\\ce{NaOH}$ → a salt + a strong base, not a weak-acid/salt pair.\n\n' +
                  'So option (iii) gives a buffer.',
              },
              {
                kind: 'mcq',
                id: 'ieq-ex-q14',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q14',
                prompt: '$K_a$ for $\\ce{CH3COOH}$ is $1.8 \\times 10^{-5}$ and $K_b$ for $\\ce{NH4OH}$ is $1.8 \\times 10^{-5}$. The pH of ammonium acetate will be:',
                options: ['7.005', '4.75', '7.0', 'Between 6 and 7'],
                correct_index: 2,
                explanation: 'Ammonium acetate is a salt of a **weak acid and a weak base**. Its pH is given by\n\n' +
                  '$$\\text{pH} = 7 + \\tfrac{1}{2}(pK_a - pK_b).$$\n\n' +
                  'Here $K_a = K_b = 1.8 \\times 10^{-5}$, so $pK_a = pK_b$ and the bracket is zero:\n\n' +
                  '$$\\text{pH} = 7 + \\tfrac{1}{2}(0) = 7.0.$$\n\n' +
                  'So the solution is exactly **neutral**, pH $= 7.0$ → option (iii).',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q27',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q27',
                prompt: 'Arrange the following in increasing order of pH.\n\n' +
                  '$$\\ce{KNO3(aq)},\\ \\ce{CH3COONa(aq)},\\ \\ce{NH4Cl(aq)},\\ \\ce{C6H5COONH4(aq)}$$',
                answer: 'NH₄Cl < C₆H₅COONH₄ < KNO₃ < CH₃COONa',
                solution: 'Classify each salt by the strength of the acid and base it came from — that fixes whether its solution is acidic, neutral, or basic:\n\n' +
                  '- **$\\ce{NH4Cl}$** — strong acid ($\\ce{HCl}$) + weak base ($\\ce{NH4OH}$) → **acidic**, **lowest** pH.\n' +
                  '- **$\\ce{C6H5COONH4}$** — weak acid + weak base, with the acid slightly stronger here → **slightly acidic / near-neutral**, just above $\\ce{NH4Cl}$.\n' +
                  '- **$\\ce{KNO3}$** — strong acid ($\\ce{HNO3}$) + strong base ($\\ce{KOH}$) → **neutral**, pH $\\approx 7$.\n' +
                  '- **$\\ce{CH3COONa}$** — weak acid ($\\ce{CH3COOH}$) + strong base ($\\ce{NaOH}$) → **basic**, **highest** pH.\n\n' +
                  '**Increasing order of pH:** $\\ce{NH4Cl} < \\ce{C6H5COONH4} < \\ce{KNO3} < \\ce{CH3COONa}$.',
              },
              {
                kind: 'mcq',
                id: 'ieq-ex-q45',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q45',
                prompt: '**Assertion (A):** A solution containing a mixture of acetic acid and sodium acetate maintains a constant value of pH on addition of small amounts of acid or alkali.\n\n' +
                  '**Reason (R):** A solution containing a mixture of acetic acid and sodium acetate acts as a buffer solution around pH 4.75.',
                options: [
                  'Both A and R are true and R is the correct explanation of A.',
                  'Both A and R are true but R is not the correct explanation of A.',
                  'A is true but R is false.',
                  'Both A and R are false.',
                ],
                correct_index: 0,
                explanation: 'Assertion is **true**: acetic acid + sodium acetate is a classic **acidic buffer**, so its pH barely changes when small amounts of acid or alkali are added. Reason is **true and is the explanation**: it works precisely **because** it is a buffer, centred near pH 4.75 (the $pK_a$ of acetic acid). So both true and R explains A → option (i).',
              },
              {
                kind: 'mcq',
                id: 'ieq-ex-q46',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q46',
                prompt: '**Assertion (A):** The ionisation of hydrogen sulphide in water is low in the presence of hydrochloric acid.\n\n' +
                  '**Reason (R):** Hydrogen sulphide is a weak acid.',
                options: [
                  'Both A and R are true and R is correct explanation of A.',
                  'Both A and R are true but R is not correct explanation of A.',
                  'A is true but R is false.',
                  'Both A and R are false.',
                ],
                correct_index: 1,
                explanation: 'Assertion is **true**: $\\ce{HCl}$ supplies a large amount of $\\ce{H+}$, which **suppresses** the ionisation of $\\ce{H2S}$ by the **common-ion effect**. Reason is **true** as a standalone fact: $\\ce{H2S}$ is indeed a weak acid. **But R is not the correct explanation** — the suppression is caused by the *common-ion effect* of the added $\\ce{H+}$, not merely by $\\ce{H2S}$ being weak. So both true, R not the explanation → option (ii).',
              },
              {
                kind: 'mcq',
                id: 'ieq-ex-q48',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q48',
                prompt: '**Assertion (A):** Aqueous solution of ammonium carbonate is basic.\n\n' +
                  '**Reason (R):** Acidic/basic nature of a salt solution of a salt of weak acid and weak base depends on $K_a$ and $K_b$ value of the acid and the base forming it.',
                options: [
                  'Both A and R are true and R is the correct explanation of A.',
                  'Both A and R are true but R is not the correct explanation of A.',
                  'A is true but R is false.',
                  'Both A and R are false.',
                ],
                correct_index: 0,
                explanation: 'Assertion is **true**: ammonium carbonate is the salt of a **weak acid** ($\\ce{H2CO3}$) and a **weak base** ($\\ce{NH4OH}$); since the base is relatively stronger than the acid ($K_b > K_a$), the solution comes out **basic**. Reason is **true and explains it**: for a weak-acid–weak-base salt, whether the solution is acidic or basic is decided exactly by comparing $K_a$ with $K_b$. So both true and R explains A → option (i).',
              },
              {
                kind: 'mcq',
                id: 'ieq-ex-q49',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q49',
                prompt: '**Assertion (A):** An aqueous solution of ammonium acetate can act as a buffer.\n\n' +
                  '**Reason (R):** Acetic acid is a weak acid and $\\ce{NH4OH}$ is a weak base.',
                options: [
                  'Both A and R are true and R is the correct explanation of A.',
                  'Both A and R are true but R is not the correct explanation of A.',
                  'A is false but R is true.',
                  'Both A and R are false.',
                ],
                correct_index: 2,
                explanation: 'Assertion is **false**: ammonium acetate is the **salt of a weak acid and a weak base** — it is **not** a buffer. A buffer needs a weak acid together with its conjugate base (or a weak base with its conjugate acid) in comparable amounts; ammonium acetate is neither of those pairs. Reason is **true**: acetic acid is indeed a weak acid and $\\ce{NH4OH}$ a weak base. So A false, R true → option (iii).\n\n*Note:* for this question option (iii) reads "A is false but R is true" (different from the usual phrasing), and it is the correct choice.',
              },
            ],
          },
          {
            id: 'sec-ksp',
            title: 'Solubility & Ksp',
            blurb: 'Solubility product, the common-ion effect on solubility, pH from a sparingly soluble hydroxide, and the general Ksp–S relation.',
            items: [
              {
                kind: 'mcq',
                id: 'ieq-ex-q12',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q12',
                prompt: 'In which of the following solvents is silver chloride most soluble?',
                options: [
                  '$0.1\\text{ mol dm}^{-3}$ $\\ce{AgNO3}$ solution',
                  '$0.1\\text{ mol dm}^{-3}$ $\\ce{HCl}$ solution',
                  '$\\ce{H2O}$',
                  'Aqueous ammonia',
                ],
                correct_index: 3,
                explanation: 'In **aqueous ammonia**, $\\ce{AgCl}$ dissolves because $\\ce{Ag+}$ is pulled out of solution as the soluble complex $\\ce{[Ag(NH3)2]+}$. Removing $\\ce{Ag+}$ shifts the dissolution equilibrium forward, so **more $\\ce{AgCl}$ dissolves**.\n\n' +
                  'In $\\ce{AgNO3}$ (common ion $\\ce{Ag+}$) and in $\\ce{HCl}$ (common ion $\\ce{Cl-}$), solubility is **suppressed** by the common-ion effect; in plain water it is just its small intrinsic value. So $\\ce{AgCl}$ is most soluble in **aqueous ammonia** → option (iv).',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q31',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q31',
                prompt: 'A sparingly soluble salt gets precipitated only when the product of concentration of its ions in the solution ($Q_{sp}$) becomes greater than its solubility product. If the solubility of $\\ce{BaSO4}$ in water is $8 \\times 10^{-4}\\text{ mol dm}^{-3}$, calculate its solubility in $0.01\\text{ mol dm}^{-3}$ of $\\ce{H2SO4}$.',
                answer: 'S ≈ 6.4×10⁻⁵ mol dm⁻³',
                solution: '**Step 1 — get $K_{sp}$ from the water solubility.** For $\\ce{BaSO4(s) <=> Ba^2+ + SO4^2-}$, in pure water $[\\ce{Ba^2+}] = [\\ce{SO4^2-}] = S = 8 \\times 10^{-4}$, so\n\n' +
                  '$$K_{sp} = S^2 = (8 \\times 10^{-4})^2 = 6.4 \\times 10^{-7}.$$\n\n' +
                  '**Step 2 — apply the common ion in $\\ce{H2SO4}$.** $0.01\\text{ mol dm}^{-3}$ $\\ce{H2SO4}$ already supplies $[\\ce{SO4^2-}] \\approx 0.01$. Let the new solubility be $S$; then $[\\ce{Ba^2+}] = S$ and the total $[\\ce{SO4^2-}] \\approx 0.01$ (the tiny $S$ added is negligible):\n\n' +
                  '$$K_{sp} = [\\ce{Ba^2+}][\\ce{SO4^2-}] = S \\times 0.01.$$\n\n' +
                  '$$S = \\frac{K_{sp}}{0.01} = \\frac{6.4 \\times 10^{-7}}{0.01} = 6.4 \\times 10^{-5}\\text{ mol dm}^{-3}.$$\n\n' +
                  '**Answer:** $S \\approx 6.4 \\times 10^{-5}\\text{ mol dm}^{-3}$.\n\n' +
                  '*Note:* the official Exemplar key prints $6 \\times 10^{-4}$, but that is **incorrect** — it carries a power-of-ten slip while solving the quadratic. A common-ion concentration of $0.01\\text{ M}$ must push the solubility **well below** the $8 \\times 10^{-4}$ water value, not leave it essentially unchanged. The correct value is $\\approx 6.4 \\times 10^{-5}$.',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q34',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q34',
                prompt: 'The solubility product of $\\ce{Al(OH)3}$ is $2.7 \\times 10^{-11}$. Calculate its solubility in $\\text{g L}^{-1}$ and also find out pH of this solution. (Atomic mass of $\\ce{Al} = 27$ u).',
                answer: 'S = 10⁻³ mol/L = 7.8×10⁻² g/L; pH = 11 + log 3 = 11.48',
                solution: '**Step 1 — molar solubility.** For $\\ce{Al(OH)3(s) <=> Al^3+ + 3OH-}$ with solubility $S$: $[\\ce{Al^3+}] = S$, $[\\ce{OH-}] = 3S$, so\n\n' +
                  '$$K_{sp} = [\\ce{Al^3+}][\\ce{OH-}]^3 = (S)(3S)^3 = 27S^4.$$\n\n' +
                  '$$S^4 = \\frac{K_{sp}}{27} = \\frac{2.7 \\times 10^{-11}}{27} = 1 \\times 10^{-12} \\quad\\Rightarrow\\quad S = 1 \\times 10^{-3}\\text{ mol L}^{-1}.$$\n\n' +
                  '**Step 2 — convert to $\\text{g L}^{-1}$.** Molar mass of $\\ce{Al(OH)3} = 27 + 3(16+1) = 78\\text{ g mol}^{-1}$:\n\n' +
                  '$$S = 1 \\times 10^{-3} \\times 78 = 7.8 \\times 10^{-2}\\text{ g L}^{-1}.$$\n\n' +
                  '**Step 3 — pH.** $[\\ce{OH-}] = 3S = 3 \\times 10^{-3}$, so\n\n' +
                  '$$\\text{pOH} = -\\log(3 \\times 10^{-3}) = 3 - \\log 3 \\quad\\Rightarrow\\quad \\text{pH} = 14 - \\text{pOH} = 11 + \\log 3 = 11.48.$$\n\n' +
                  '**Answer:** $S = 7.8 \\times 10^{-2}\\text{ g L}^{-1}$ and pH $= 11.48$.',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q35',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q35',
                prompt: 'Calculate the volume of water required to dissolve $0.1\\text{ g}$ lead (II) chloride to get a saturated solution. ($K_{sp}$ of $\\ce{PbCl2} = 3.2 \\times 10^{-8}$, atomic mass of $\\ce{Pb} = 207$ u).',
                answer: 'V ≈ 0.2 L',
                solution: '**Step 1 — molar solubility.** For $\\ce{PbCl2(s) <=> Pb^2+ + 2Cl-}$ with solubility $S$: $[\\ce{Pb^2+}] = S$, $[\\ce{Cl-}] = 2S$, so\n\n' +
                  '$$K_{sp} = [\\ce{Pb^2+}][\\ce{Cl-}]^2 = (S)(2S)^2 = 4S^3.$$\n\n' +
                  '$$S^3 = \\frac{K_{sp}}{4} = \\frac{3.2 \\times 10^{-8}}{4} = 8 \\times 10^{-9} \\quad\\Rightarrow\\quad S = 2 \\times 10^{-3}\\text{ mol L}^{-1}.$$\n\n' +
                  '**Step 2 — convert to $\\text{g L}^{-1}$.** Molar mass of $\\ce{PbCl2} = 207 + 2(35.5) = 278\\text{ g mol}^{-1}$:\n\n' +
                  '$$S = 2 \\times 10^{-3} \\times 278 = 0.556\\text{ g L}^{-1}.$$\n\n' +
                  '**Step 3 — volume for $0.1\\text{ g}$.** A saturated solution holds $0.556\\text{ g}$ per litre, so $0.1\\text{ g}$ needs\n\n' +
                  '$$V = \\frac{0.1}{0.556} = 0.1798\\text{ L} \\approx 0.2\\text{ L}.$$\n\n' +
                  '**Answer:** about **0.2 L** of water.',
              },
              {
                kind: 'numerical',
                id: 'ieq-ex-q53',
                source: 'ncert_exemplar',
                source_label: 'Exemplar Q53',
                prompt: 'A sparingly soluble salt having general formula $\\ce{A_{x}B_{y}}$ ($\\ce{A^{p+}}$, $\\ce{B^{q-}}$) and molar solubility $S$ is in equilibrium with its saturated solution. Derive a relationship between the solubility and solubility product for such a salt.',
                answer: 'Ksp = xˣ · yʸ · S^(x+y)',
                solution: '**Write the dissolution equilibrium.** One formula unit gives $x$ cations and $y$ anions:\n\n' +
                  '$$\\ce{A_{x}B_{y}(s) <=> x\\,A^{p+}(aq) + y\\,B^{q-}(aq)}$$\n\n' +
                  '**Express the ion concentrations in terms of $S$.** If $S$ moles per litre dissolve, then each formula unit releases $x$ of $\\ce{A^{p+}}$ and $y$ of $\\ce{B^{q-}}$:\n\n' +
                  '$$[\\ce{A^{p+}}] = xS, \\qquad [\\ce{B^{q-}}] = yS.$$\n\n' +
                  '**Substitute into the solubility-product expression.**\n\n' +
                  '$$K_{sp} = [\\ce{A^{p+}}]^x\\,[\\ce{B^{q-}}]^y = (xS)^x (yS)^y.$$\n\n' +
                  'Collecting the powers of $S$:\n\n' +
                  '$$\\boxed{K_{sp} = x^x\\,y^y\\,S^{(x+y)}.}$$\n\n' +
                  'This is the general link between solubility $S$ and solubility product $K_{sp}$. (For example, with $x=1, y=2$ it gives $K_{sp} = 4S^3$, the $\\ce{PbCl2}$ case.)',
              },
            ],
          },
    ];
    // Merge NCERT textbook exercises into each section (textbook questions first, then Exemplar).
    for (const s of sections) if (ncert[s.id]) s.items = [...ncert[s.id], ...s.items];
    return [
      h.bank(
        'Practice — Ionic Equilibrium',
        'Every NCERT textbook exercise and NCERT Exemplar question for this chapter, organised by sub-topic. Pick a section on the left. The longer questions reveal a full worked solution; MCQs and assertion-reason check instantly.',
        sections
      ),
    ];
  },
};
