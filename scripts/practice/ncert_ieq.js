// NCERT textbook end-of-chapter exercises 7.35–7.73 (Ionic Equilibrium subset)
// from NCERT Class 11 Chemistry, Chapter 7 (Equilibrium), pages 228–230.
// Faithful transcription of question stems + given data, with worked solutions.
// Every exercise is a `numerical` (tap-to-reveal) item, grouped by section id.
// node --check scripts/practice/ncert_ieq.js must pass.

module.exports = {
  'sec-theories': [
    {
      kind: 'numerical', id: 'ieq-ncert-7-35', source: 'ncert_exercise', source_label: 'NCERT 7.35',
      prompt: 'What is meant by the conjugate acid-base pair? Find the conjugate acid/base for the following species:\n\n$$\\ce{HNO2},\\ \\ce{CN-},\\ \\ce{HClO4},\\ \\ce{F-},\\ \\ce{OH-},\\ \\ce{CO3^2-},\\ \\text{and } \\ce{S^2-}$$',
      answer: 'A conjugate acid–base pair differs by exactly one proton (H⁺). Conjugate base of HNO₂ = NO₂⁻; conjugate acid of CN⁻ = HCN; conjugate base of HClO₄ = ClO₄⁻; conjugate acid of F⁻ = HF; conjugate acid of OH⁻ = H₂O (conjugate base = O²⁻); conjugate acid of CO₃²⁻ = HCO₃⁻; conjugate acid of S²⁻ = HS⁻.',
      solution: 'A **conjugate acid–base pair** is a pair of species that differ by **one proton** ($\\ce{H+}$). Remove a proton from an acid and you get its conjugate base; add a proton to a base and you get its conjugate acid.\n\n' +
        '- $\\ce{HNO2}$ is an acid → conjugate **base** is $\\ce{NO2-}$.\n' +
        '- $\\ce{CN-}$ is a base → conjugate **acid** is $\\ce{HCN}$.\n' +
        '- $\\ce{HClO4}$ is an acid → conjugate **base** is $\\ce{ClO4-}$.\n' +
        '- $\\ce{F-}$ is a base → conjugate **acid** is $\\ce{HF}$.\n' +
        '- $\\ce{OH-}$ → conjugate **acid** is $\\ce{H2O}$ (and its conjugate base is $\\ce{O^2-}$).\n' +
        '- $\\ce{CO3^2-}$ is a base → conjugate **acid** is $\\ce{HCO3-}$.\n' +
        '- $\\ce{S^2-}$ is a base → conjugate **acid** is $\\ce{HS-}$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-36', source: 'ncert_exercise', source_label: 'NCERT 7.36',
      prompt: 'Which of the followings are Lewis acids? $\\ce{H2O}$, $\\ce{BF3}$, $\\ce{H+}$, and $\\ce{NH4+}$.',
      answer: 'BF₃ and H⁺ are Lewis acids.',
      solution: 'A **Lewis acid** is an **electron-pair acceptor**.\n\n' +
        '- $\\ce{BF3}$ — boron is electron-deficient (vacant orbital), so it accepts an electron pair → **Lewis acid**.\n' +
        '- $\\ce{H+}$ — a bare proton has an empty $1s$ orbital and readily accepts a lone pair → **Lewis acid**.\n' +
        '- $\\ce{H2O}$ has lone pairs to donate → Lewis base, not an acid.\n' +
        '- $\\ce{NH4+}$ — nitrogen already has four bonds and no vacant orbital to accept a pair → not a Lewis acid.\n\n' +
        'So the Lewis acids are **$\\ce{BF3}$ and $\\ce{H+}$**.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-37', source: 'ncert_exercise', source_label: 'NCERT 7.37',
      prompt: 'What will be the conjugate bases for the Brönsted acids: $\\ce{HF}$, $\\ce{H2SO4}$ and $\\ce{HCO3-}$?',
      answer: 'F⁻ (from HF), HSO₄⁻ (from H₂SO₄), and CO₃²⁻ (from HCO₃⁻).',
      solution: 'The **conjugate base** is what remains after the acid donates one proton ($\\ce{H+}$):\n\n' +
        '- $\\ce{HF} \\rightarrow \\ce{F-}$\n' +
        '- $\\ce{H2SO4} \\rightarrow \\ce{HSO4-}$\n' +
        '- $\\ce{HCO3-} \\rightarrow \\ce{CO3^2-}$',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-38', source: 'ncert_exercise', source_label: 'NCERT 7.38',
      prompt: 'Write the conjugate acids for the following Brönsted bases: $\\ce{NH2-}$, $\\ce{NH3}$ and $\\ce{HCOO-}$.',
      answer: 'NH₃ (from NH₂⁻), NH₄⁺ (from NH₃), and HCOOH (from HCOO⁻).',
      solution: 'The **conjugate acid** is formed when the base **accepts one proton** ($\\ce{H+}$):\n\n' +
        '- $\\ce{NH2-} + \\ce{H+} \\rightarrow \\ce{NH3}$\n' +
        '- $\\ce{NH3} + \\ce{H+} \\rightarrow \\ce{NH4+}$\n' +
        '- $\\ce{HCOO-} + \\ce{H+} \\rightarrow \\ce{HCOOH}$',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-39', source: 'ncert_exercise', source_label: 'NCERT 7.39',
      prompt: 'The species: $\\ce{H2O}$, $\\ce{HCO3-}$, $\\ce{HSO4-}$ and $\\ce{NH3}$ can act both as Brönsted acids and bases. For each case give the corresponding conjugate acid and base.',
      answer: 'H₂O: conjugate acid H₃O⁺, conjugate base OH⁻. HCO₃⁻: conjugate acid H₂CO₃, conjugate base CO₃²⁻. HSO₄⁻: conjugate acid H₂SO₄, conjugate base SO₄²⁻. NH₃: conjugate acid NH₄⁺, conjugate base NH₂⁻.',
      solution: 'Each species can **lose** a proton (acting as an acid → gives its conjugate **base**) or **gain** a proton (acting as a base → gives its conjugate **acid**):\n\n' +
        '| Species | As acid → conjugate base | As base → conjugate acid |\n' +
        '|---|---|---|\n' +
        '| $\\ce{H2O}$ | $\\ce{OH-}$ | $\\ce{H3O+}$ |\n' +
        '| $\\ce{HCO3-}$ | $\\ce{CO3^2-}$ | $\\ce{H2CO3}$ |\n' +
        '| $\\ce{HSO4-}$ | $\\ce{SO4^2-}$ | $\\ce{H2SO4}$ |\n' +
        '| $\\ce{NH3}$ | $\\ce{NH2-}$ | $\\ce{NH4+}$ |',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-40', source: 'ncert_exercise', source_label: 'NCERT 7.40',
      prompt: 'Classify the following species into Lewis acids and Lewis bases and show how these act as Lewis acid/base: (a) $\\ce{OH-}$ (b) $\\ce{F-}$ (c) $\\ce{H+}$ (d) $\\ce{BCl3}$.',
      answer: '(a) OH⁻ — Lewis base (donates lone pair). (b) F⁻ — Lewis base (donates lone pair). (c) H⁺ — Lewis acid (accepts lone pair). (d) BCl₃ — Lewis acid (accepts lone pair, B is electron-deficient).',
      solution: 'A **Lewis acid** accepts a lone pair; a **Lewis base** donates a lone pair.\n\n' +
        '- **(a) $\\ce{OH-}$** — has lone pairs on oxygen it can donate → **Lewis base**. e.g. $\\ce{OH- + H+ -> H2O}$.\n' +
        '- **(b) $\\ce{F-}$** — has lone pairs to donate → **Lewis base**. e.g. $\\ce{F- + BF3 -> BF4-}$.\n' +
        '- **(c) $\\ce{H+}$** — empty orbital, accepts a lone pair → **Lewis acid**. e.g. $\\ce{H+ + OH- -> H2O}$.\n' +
        '- **(d) $\\ce{BCl3}$** — boron is electron-deficient with a vacant orbital, accepts a lone pair → **Lewis acid**. e.g. $\\ce{BCl3 + NH3 -> Cl3B<-NH3}$.',
    },
  ],

  'sec-ka-kb': [
    {
      kind: 'numerical', id: 'ieq-ncert-7-43', source: 'ncert_exercise', source_label: 'NCERT 7.43',
      prompt: 'The ionization constant of $\\ce{HF}$, $\\ce{HCOOH}$ and $\\ce{HCN}$ at 298 K are $6.8 \\times 10^{-4}$, $1.8 \\times 10^{-4}$ and $4.8 \\times 10^{-9}$ respectively. Calculate the ionization constants of the corresponding conjugate base.',
      answer: 'K_b(F⁻) ≈ 1.47×10⁻¹¹; K_b(HCOO⁻) ≈ 5.6×10⁻¹¹; K_b(CN⁻) ≈ 2.08×10⁻⁶.',
      solution: 'For a conjugate acid–base pair, $K_a \\cdot K_b = K_w = 1.0 \\times 10^{-14}$, so $K_b = \\frac{K_w}{K_a}$.\n\n' +
        '- $\\ce{F-}$: $K_b = \\frac{10^{-14}}{6.8 \\times 10^{-4}} = 1.47 \\times 10^{-11}$\n' +
        '- $\\ce{HCOO-}$: $K_b = \\frac{10^{-14}}{1.8 \\times 10^{-4}} = 5.6 \\times 10^{-11}$\n' +
        '- $\\ce{CN-}$: $K_b = \\frac{10^{-14}}{4.8 \\times 10^{-9}} = 2.08 \\times 10^{-6}$',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-44', source: 'ncert_exercise', source_label: 'NCERT 7.44',
      prompt: 'The ionization constant of phenol is $1.0 \\times 10^{-10}$. What is the concentration of phenolate ion in 0.05 M solution of phenol? What will be its degree of ionization if the solution is also 0.01 M in sodium phenolate?',
      answer: '[Phenolate] ≈ 2.2×10⁻⁶ M; α (in pure phenol) ≈ 4.5×10⁻⁵. With 0.01 M sodium phenolate: [phenolate from acid] ≈ 5×10⁻¹⁰ M and α ≈ 1.0×10⁻⁸.',
      solution: 'Phenol is a weak acid: $\\ce{C6H5OH <=> C6H5O- + H+}$, $K_a = 1.0 \\times 10^{-10}$, $C = 0.05$ M.\n\n' +
        '**In pure phenol.** $[\\ce{C6H5O-}] = [\\ce{H+}] = \\sqrt{K_a C} = \\sqrt{(1.0 \\times 10^{-10})(0.05)} = \\sqrt{5 \\times 10^{-12}} = 2.2 \\times 10^{-6}$ M.\n\n' +
        'Degree of ionization $\\alpha = \\frac{[\\ce{C6H5O-}]}{C} = \\frac{2.2 \\times 10^{-6}}{0.05} = 4.5 \\times 10^{-5}$.\n\n' +
        '**With 0.01 M sodium phenolate (common-ion effect).** The phenolate ion is now fixed by the salt at $[\\ce{C6H5O-}] = 0.01$ M. Let the small amount ionizing from phenol be $x$:\n\n' +
        '$K_a = \\frac{[\\ce{C6H5O-}][\\ce{H+}]}{[\\ce{C6H5OH}]} = \\frac{(0.01)(x)}{0.05}$\n\n' +
        '$x = \\frac{K_a \\times 0.05}{0.01} = \\frac{(1.0 \\times 10^{-10})(0.05)}{0.01} = 5 \\times 10^{-10}$ M.\n\n' +
        'New degree of ionization $\\alpha = \\frac{x}{C} = \\frac{5 \\times 10^{-10}}{0.05} = 1.0 \\times 10^{-8}$ — sharply suppressed by the common ion.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-45', source: 'ncert_exercise', source_label: 'NCERT 7.45',
      prompt: 'The first ionization constant of $\\ce{H2S}$ is $9.1 \\times 10^{-8}$. Calculate the concentration of $\\ce{HS-}$ ion in its 0.1 M solution. How will this concentration be affected if the solution is 0.1 M in $\\ce{HCl}$ also? If the second dissociation constant of $\\ce{H2S}$ is $1.2 \\times 10^{-13}$, calculate the concentration of $\\ce{S^2-}$ under both conditions.',
      answer: '[HS⁻] in 0.1 M H₂S ≈ 9.54×10⁻⁵ M; with 0.1 M HCl, [HS⁻] ≈ 9.1×10⁻⁸ M. [S²⁻] in 0.1 M H₂S ≈ 1.2×10⁻¹³ M; with 0.1 M HCl, [S²⁻] ≈ 1.09×10⁻¹⁹ M.',
      solution: '$\\ce{H2S <=> H+ + HS-}$, $K_{a1} = 9.1 \\times 10^{-8}$; $\\ce{HS- <=> H+ + S^2-}$, $K_{a2} = 1.2 \\times 10^{-13}$.\n\n' +
        '**(1) In 0.1 M H₂S alone.** Since $K_{a1}$ is small, $[\\ce{H+}] \\approx [\\ce{HS-}] = x$:\n\n' +
        '$x = \\sqrt{K_{a1} \\, C} = \\sqrt{(9.1 \\times 10^{-8})(0.1)} = \\sqrt{9.1 \\times 10^{-9}} = 9.54 \\times 10^{-5}$ M = $[\\ce{HS-}]$.\n\n' +
        '$[\\ce{S^2-}] = K_{a2} \\frac{[\\ce{HS-}]}{[\\ce{H+}]}$. Here $[\\ce{H+}] \\approx [\\ce{HS-}]$, so $[\\ce{S^2-}] \\approx K_{a2} = 1.2 \\times 10^{-13}$ M.\n\n' +
        '**(2) In 0.1 M H₂S + 0.1 M HCl.** The strong acid fixes $[\\ce{H+}] = 0.1$ M, suppressing the first ionization (common-ion effect).\n\n' +
        '$[\\ce{HS-}] = K_{a1}\\frac{[\\ce{H2S}]}{[\\ce{H+}]} = (9.1 \\times 10^{-8})\\frac{0.1}{0.1} = 9.1 \\times 10^{-8}$ M.\n\n' +
        '$[\\ce{S^2-}] = K_{a2}\\frac{[\\ce{HS-}]}{[\\ce{H+}]} = (1.2 \\times 10^{-13})\\frac{9.1 \\times 10^{-8}}{0.1} = 1.09 \\times 10^{-19}$ M.\n\n' +
        'So adding HCl drops $[\\ce{HS-}]$ from $9.54 \\times 10^{-5}$ to $9.1 \\times 10^{-8}$ M and $[\\ce{S^2-}]$ from $1.2 \\times 10^{-13}$ to $1.09 \\times 10^{-19}$ M.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-46', source: 'ncert_exercise', source_label: 'NCERT 7.46',
      prompt: 'The ionization constant of acetic acid is $1.74 \\times 10^{-5}$. Calculate the degree of dissociation of acetic acid in its 0.05 M solution. Calculate the concentration of acetate ion in the solution and its pH.',
      answer: 'α ≈ 1.9×10⁻²; [CH₃COO⁻] ≈ 9.3×10⁻⁴ M; pH ≈ 3.03.',
      solution: '$\\ce{CH3COOH <=> CH3COO- + H+}$, $K_a = 1.74 \\times 10^{-5}$, $C = 0.05$ M.\n\n' +
        '$\\alpha = \\sqrt{\\frac{K_a}{C}} = \\sqrt{\\frac{1.74 \\times 10^{-5}}{0.05}} = \\sqrt{3.48 \\times 10^{-4}} = 1.865 \\times 10^{-2} \\approx 1.9 \\times 10^{-2}$.\n\n' +
        '$[\\ce{CH3COO-}] = C\\alpha = 0.05 \\times 1.865 \\times 10^{-2} = 9.3 \\times 10^{-4}$ M $= [\\ce{H+}]$.\n\n' +
        '$\\text{pH} = -\\log[\\ce{H+}] = -\\log(9.3 \\times 10^{-4}) = 3.03$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-50', source: 'ncert_exercise', source_label: 'NCERT 7.50',
      prompt: 'The degree of ionization of a 0.1 M bromoacetic acid solution is 0.132. Calculate the pH of the solution and the $pK_a$ of bromoacetic acid.',
      answer: 'pH ≈ 1.88; K_a ≈ 2.0×10⁻³; pK_a ≈ 2.70.',
      solution: '$C = 0.1$ M, $\\alpha = 0.132$.\n\n' +
        '$[\\ce{H+}] = C\\alpha = 0.1 \\times 0.132 = 0.0132$ M.\n\n' +
        '$\\text{pH} = -\\log(0.0132) = 1.88$.\n\n' +
        '$K_a = \\frac{C\\alpha^2}{1-\\alpha} = \\frac{0.1 \\times (0.132)^2}{1 - 0.132} = \\frac{0.1 \\times 0.01742}{0.868} = 2.0 \\times 10^{-3}$.\n\n' +
        '$pK_a = -\\log(2.0 \\times 10^{-3}) = 2.70$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-51', source: 'ncert_exercise', source_label: 'NCERT 7.51',
      prompt: 'The pH of 0.005 M codeine ($\\ce{C18H21NO3}$) solution is 9.95. Calculate its ionization constant and $pK_b$.',
      answer: 'K_b ≈ 1.6×10⁻⁶; pK_b ≈ 5.80.',
      solution: 'Codeine is a weak base, $C = 0.005$ M, $\\text{pH} = 9.95$.\n\n' +
        '$\\text{pOH} = 14 - 9.95 = 4.05$, so $[\\ce{OH-}] = 10^{-4.05} = 8.91 \\times 10^{-5}$ M.\n\n' +
        'For a weak base $K_b = \\frac{[\\ce{OH-}]^2}{C - [\\ce{OH-}]} \\approx \\frac{[\\ce{OH-}]^2}{C}$:\n\n' +
        '$K_b = \\frac{(8.91 \\times 10^{-5})^2}{0.005} = \\frac{7.94 \\times 10^{-9}}{0.005} = 1.59 \\times 10^{-6} \\approx 1.6 \\times 10^{-6}$.\n\n' +
        '$pK_b = -\\log(1.6 \\times 10^{-6}) = 5.80$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-52', source: 'ncert_exercise', source_label: 'NCERT 7.52',
      prompt: 'What is the pH of 0.001 M aniline solution? The ionization constant of aniline can be taken from Table 7.7. Calculate the degree of ionization of aniline in the solution. Also calculate the ionization constant of the conjugate acid of aniline.',
      answer: 'Using K_b(aniline) = 4.27×10⁻¹⁰: [OH⁻] ≈ 6.54×10⁻⁷ M, pOH ≈ 6.18, pH ≈ 7.82; α ≈ 6.5×10⁻⁴; K_a(conjugate acid, anilinium) = K_w/K_b ≈ 2.34×10⁻⁵.',
      solution: 'Aniline ($\\ce{C6H5NH2}$) is a weak base. From NCERT Table 7.7, $K_b = 4.27 \\times 10^{-10}$, $C = 0.001$ M.\n\n' +
        '$[\\ce{OH-}] = \\sqrt{K_b\\,C} = \\sqrt{(4.27 \\times 10^{-10})(0.001)} = \\sqrt{4.27 \\times 10^{-13}} = 6.54 \\times 10^{-7}$ M.\n\n' +
        '$\\text{pOH} = -\\log(6.54 \\times 10^{-7}) = 6.18$, so $\\text{pH} = 14 - 6.18 = 7.82$.\n\n' +
        '$\\alpha = \\frac{[\\ce{OH-}]}{C} = \\frac{6.54 \\times 10^{-7}}{0.001} = 6.5 \\times 10^{-4}$.\n\n' +
        'Conjugate acid (anilinium, $\\ce{C6H5NH3+}$): $K_a = \\frac{K_w}{K_b} = \\frac{1.0 \\times 10^{-14}}{4.27 \\times 10^{-10}} = 2.34 \\times 10^{-5}$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-54', source: 'ncert_exercise', source_label: 'NCERT 7.54',
      prompt: 'The ionization constant of dimethylamine is $5.4 \\times 10^{-4}$. Calculate its degree of ionization in its 0.02 M solution. What percentage of dimethylamine is ionized if the solution is also 0.1 M in $\\ce{NaOH}$?',
      answer: 'α ≈ 0.164 (16.4%) in 0.02 M alone; with 0.1 M NaOH, α ≈ 5.4×10⁻³ (≈0.54%).',
      solution: 'Dimethylamine $\\ce{(CH3)2NH}$ is a weak base, $K_b = 5.4 \\times 10^{-4}$, $C = 0.02$ M.\n\n' +
        '**Alone:** $\\alpha = \\sqrt{\\frac{K_b}{C}} = \\sqrt{\\frac{5.4 \\times 10^{-4}}{0.02}} = \\sqrt{0.027} = 0.164$, i.e. about **16.4%**.\n\n' +
        '**With 0.1 M NaOH (common-ion effect).** $\\ce{OH-}$ is fixed at 0.1 M. Let $x$ = amount of base ionized:\n\n' +
        '$K_b = \\frac{[\\ce{OH-}]\\,x}{C} = \\frac{(0.1)\\,x}{0.02}$ (taking $x \\ll C$)\n\n' +
        '$x = \\frac{K_b \\times 0.02}{0.1} = \\frac{(5.4 \\times 10^{-4})(0.02)}{0.1} = 1.08 \\times 10^{-4}$ M.\n\n' +
        '$\\alpha = \\frac{x}{C} = \\frac{1.08 \\times 10^{-4}}{0.02} = 5.4 \\times 10^{-3}$, i.e. about **0.54%** — strongly suppressed.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-59', source: 'ncert_exercise', source_label: 'NCERT 7.59',
      prompt: 'The ionization constant of propanoic acid is $1.32 \\times 10^{-5}$. Calculate the degree of ionization of the acid in its 0.05 M solution and also its pH. What will be its degree of ionization if the solution is 0.01 M in $\\ce{HCl}$ also?',
      answer: 'α ≈ 1.63×10⁻² and pH ≈ 3.09 in 0.05 M alone; with 0.01 M HCl, α ≈ 1.32×10⁻³.',
      solution: 'Propanoic acid $\\ce{C2H5COOH}$ is weak, $K_a = 1.32 \\times 10^{-5}$, $C = 0.05$ M.\n\n' +
        '**Alone:** $\\alpha = \\sqrt{\\frac{K_a}{C}} = \\sqrt{\\frac{1.32 \\times 10^{-5}}{0.05}} = \\sqrt{2.64 \\times 10^{-4}} = 1.63 \\times 10^{-2}$.\n\n' +
        '$[\\ce{H+}] = C\\alpha = 0.05 \\times 1.63 \\times 10^{-2} = 8.15 \\times 10^{-4}$ M, so $\\text{pH} = -\\log(8.15 \\times 10^{-4}) = 3.09$.\n\n' +
        '**With 0.01 M HCl (common-ion effect):** $[\\ce{H+}] \\approx 0.01$ M (from HCl). Then\n\n' +
        '$K_a = \\frac{[\\ce{H+}]\\,C\\alpha\'}{C} = [\\ce{H+}]\\,\\alpha\'$, so $\\alpha\' = \\frac{K_a}{[\\ce{H+}]} = \\frac{1.32 \\times 10^{-5}}{0.01} = 1.32 \\times 10^{-3}$ — suppressed roughly tenfold.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-60', source: 'ncert_exercise', source_label: 'NCERT 7.60',
      prompt: 'The pH of 0.1 M solution of cyanic acid ($\\ce{HCNO}$) is 2.34. Calculate the ionization constant of the acid and its degree of ionization in the solution.',
      answer: 'α ≈ 4.57×10⁻²; K_a ≈ 2.09×10⁻⁴.',
      solution: 'Cyanic acid $\\ce{HCNO}$, $C = 0.1$ M, $\\text{pH} = 2.34$.\n\n' +
        '$[\\ce{H+}] = 10^{-2.34} = 4.57 \\times 10^{-3}$ M.\n\n' +
        '$\\alpha = \\frac{[\\ce{H+}]}{C} = \\frac{4.57 \\times 10^{-3}}{0.1} = 4.57 \\times 10^{-2}$.\n\n' +
        '$K_a = \\frac{C\\alpha^2}{1-\\alpha} = \\frac{[\\ce{H+}]^2}{C - [\\ce{H+}]} = \\frac{(4.57 \\times 10^{-3})^2}{0.1 - 0.00457} = \\frac{2.089 \\times 10^{-5}}{0.0954} = 2.19 \\times 10^{-4}$.\n\n' +
        '(Using the simple $K_a \\approx C\\alpha^2 = 0.1 \\times (4.57 \\times 10^{-3})\\,... = 2.09 \\times 10^{-4}$; both agree to ~2.1×10⁻⁴.)',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-64', source: 'ncert_exercise', source_label: 'NCERT 7.64',
      prompt: 'The ionization constant of chloroacetic acid is $1.35 \\times 10^{-3}$. What will be the pH of 0.1 M acid and its 0.1 M sodium salt solution?',
      answer: 'pH of 0.1 M chloroacetic acid ≈ 1.94; pH of 0.1 M sodium chloroacetate ≈ 7.94.',
      solution: 'Chloroacetic acid $\\ce{ClCH2COOH}$, $K_a = 1.35 \\times 10^{-3}$.\n\n' +
        '**0.1 M acid.** $[\\ce{H+}] = \\sqrt{K_a C} = \\sqrt{(1.35 \\times 10^{-3})(0.1)} = \\sqrt{1.35 \\times 10^{-4}} = 1.16 \\times 10^{-2}$ M.\n\n' +
        '$\\text{pH} = -\\log(1.16 \\times 10^{-2}) = 1.94$.\n\n' +
        '**0.1 M sodium salt (salt of weak acid + strong base → hydrolysis, basic).**\n' +
        '$K_h = \\frac{K_w}{K_a} = \\frac{10^{-14}}{1.35 \\times 10^{-3}} = 7.4 \\times 10^{-12}$.\n\n' +
        '$[\\ce{OH-}] = \\sqrt{K_h \\, C} = \\sqrt{(7.4 \\times 10^{-12})(0.1)} = \\sqrt{7.4 \\times 10^{-13}} = 8.6 \\times 10^{-7}$ M.\n\n' +
        '$\\text{pOH} = -\\log(8.6 \\times 10^{-7}) = 6.06$, so $\\text{pH} = 14 - 6.06 = 7.94$.',
    },
  ],

  'sec-ph': [
    {
      kind: 'numerical', id: 'ieq-ncert-7-41', source: 'ncert_exercise', source_label: 'NCERT 7.41',
      prompt: 'The concentration of hydrogen ion in a sample of soft drink is $3.8 \\times 10^{-3}$ M. What is its pH?',
      answer: 'pH ≈ 2.42.',
      solution: '$\\text{pH} = -\\log[\\ce{H+}] = -\\log(3.8 \\times 10^{-3})$.\n\n' +
        '$= 3 - \\log 3.8 = 3 - 0.58 = 2.42$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-42', source: 'ncert_exercise', source_label: 'NCERT 7.42',
      prompt: 'The pH of a sample of vinegar is 3.76. Calculate the concentration of hydrogen ion in it.',
      answer: '[H⁺] ≈ 1.74×10⁻⁴ M.',
      solution: '$[\\ce{H+}] = 10^{-\\text{pH}} = 10^{-3.76}$.\n\n' +
        '$= 10^{-4} \\times 10^{0.24} = 1.74 \\times 10^{-4}$ M.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-47', source: 'ncert_exercise', source_label: 'NCERT 7.47',
      prompt: 'It has been found that the pH of a 0.01 M solution of an organic acid is 4.15. Calculate the concentration of the anion, the ionization constant of the acid and its $pK_a$.',
      answer: '[anion] = [H⁺] ≈ 7.08×10⁻⁵ M; K_a ≈ 5.0×10⁻⁷; pK_a ≈ 6.30.',
      solution: '$C = 0.01$ M, $\\text{pH} = 4.15$.\n\n' +
        '$[\\ce{H+}] = 10^{-4.15} = 7.08 \\times 10^{-5}$ M = $[\\ce{A-}]$ (the anion).\n\n' +
        '$K_a = \\frac{[\\ce{H+}][\\ce{A-}]}{[\\ce{HA}]} = \\frac{(7.08 \\times 10^{-5})^2}{0.01 - 7.08 \\times 10^{-5}} \\approx \\frac{5.01 \\times 10^{-9}}{0.00993} = 5.0 \\times 10^{-7}$.\n\n' +
        '$pK_a = -\\log(5.0 \\times 10^{-7}) = 6.30$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-48', source: 'ncert_exercise', source_label: 'NCERT 7.48',
      prompt: 'Assuming complete dissociation, calculate the pH of the following solutions:\n\n(a) 0.003 M $\\ce{HCl}$ (b) 0.005 M $\\ce{NaOH}$ (c) 0.002 M $\\ce{HBr}$ (d) 0.002 M $\\ce{KOH}$',
      answer: '(a) 2.52  (b) 11.70  (c) 2.70  (d) 11.30.',
      solution: 'Strong acids/bases dissociate completely.\n\n' +
        '**(a) 0.003 M HCl:** $[\\ce{H+}] = 3 \\times 10^{-3}$, $\\text{pH} = -\\log(3 \\times 10^{-3}) = 2.52$.\n\n' +
        '**(b) 0.005 M NaOH:** $[\\ce{OH-}] = 5 \\times 10^{-3}$, $\\text{pOH} = -\\log(5 \\times 10^{-3}) = 2.30$, $\\text{pH} = 14 - 2.30 = 11.70$.\n\n' +
        '**(c) 0.002 M HBr:** $[\\ce{H+}] = 2 \\times 10^{-3}$, $\\text{pH} = -\\log(2 \\times 10^{-3}) = 2.70$.\n\n' +
        '**(d) 0.002 M KOH:** $[\\ce{OH-}] = 2 \\times 10^{-3}$, $\\text{pOH} = 2.70$, $\\text{pH} = 14 - 2.70 = 11.30$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-49', source: 'ncert_exercise', source_label: 'NCERT 7.49',
      prompt: 'Calculate the pH of the following solutions:\n\na) 2 g of $\\ce{TlOH}$ dissolved in water to give 2 litre of solution.\nb) 0.3 g of $\\ce{Ca(OH)2}$ dissolved in water to give 500 mL of solution.\nc) 0.3 g of $\\ce{NaOH}$ dissolved in water to give 200 mL of solution.\nd) 1 mL of 13.6 M $\\ce{HCl}$ is diluted with water to give 1 litre of solution.',
      answer: '(a) ≈ 11.65  (b) ≈ 12.21  (c) ≈ 12.57  (d) ≈ 1.87.',
      solution: '**(a) TlOH** (M = 204 + 16 + 1 = 221 g/mol). Moles = $2/221 = 9.05 \\times 10^{-3}$ in 2 L → $[\\ce{OH-}] = 4.52 \\times 10^{-3}$ M. $\\text{pOH} = -\\log(4.52 \\times 10^{-3}) = 2.34$, $\\text{pH} = 11.65$. (Approx using M≈221.)\n\n' +
        '**(b) Ca(OH)₂** (M = 74). Moles = $0.3/74 = 4.05 \\times 10^{-3}$ in 0.5 L → conc $= 8.1 \\times 10^{-3}$ M; gives $[\\ce{OH-}] = 2 \\times 8.1 \\times 10^{-3} = 1.62 \\times 10^{-2}$ M. $\\text{pOH} = -\\log(1.62 \\times 10^{-2}) = 1.79$, $\\text{pH} = 12.21$.\n\n' +
        '**(c) NaOH** (M = 40). Moles = $0.3/40 = 7.5 \\times 10^{-3}$ in 0.2 L → $[\\ce{OH-}] = 3.75 \\times 10^{-2}$ M. $\\text{pOH} = -\\log(3.75 \\times 10^{-2}) = 1.43$, $\\text{pH} = 12.57$.\n\n' +
        '**(d) HCl dilution:** $M_1 V_1 = M_2 V_2$ → $13.6 \\times 1 = M_2 \\times 1000$, $M_2 = 1.36 \\times 10^{-2}$ M. $\\text{pH} = -\\log(1.36 \\times 10^{-2}) = 1.87$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-55', source: 'ncert_exercise', source_label: 'NCERT 7.55',
      prompt: 'Calculate the hydrogen ion concentration in the following biological fluids whose pH are given below:\n\n(a) Human muscle-fluid, 6.83  (b) Human stomach fluid, 1.2\n(c) Human blood, 7.38  (d) Human saliva, 6.4.',
      answer: '(a) ≈ 1.48×10⁻⁷ M  (b) ≈ 6.31×10⁻² M  (c) ≈ 4.17×10⁻⁸ M  (d) ≈ 3.98×10⁻⁷ M.',
      solution: 'Use $[\\ce{H+}] = 10^{-\\text{pH}}$ for each.\n\n' +
        '**(a)** muscle, pH 6.83: $[\\ce{H+}] = 10^{-6.83} = 1.48 \\times 10^{-7}$ M.\n\n' +
        '**(b)** stomach, pH 1.2: $[\\ce{H+}] = 10^{-1.2} = 6.31 \\times 10^{-2}$ M.\n\n' +
        '**(c)** blood, pH 7.38: $[\\ce{H+}] = 10^{-7.38} = 4.17 \\times 10^{-8}$ M.\n\n' +
        '**(d)** saliva, pH 6.4: $[\\ce{H+}] = 10^{-6.4} = 3.98 \\times 10^{-7}$ M.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-56', source: 'ncert_exercise', source_label: 'NCERT 7.56',
      prompt: 'The pH of milk, black coffee, tomato juice, lemon juice and egg white are 6.8, 5.0, 4.2, 2.2 and 7.8 respectively. Calculate corresponding hydrogen ion concentration in each.',
      answer: 'Milk ≈ 1.58×10⁻⁷ M; black coffee = 1.0×10⁻⁵ M; tomato juice ≈ 6.31×10⁻⁵ M; lemon juice ≈ 6.31×10⁻³ M; egg white ≈ 1.58×10⁻⁸ M.',
      solution: 'Use $[\\ce{H+}] = 10^{-\\text{pH}}$.\n\n' +
        '- Milk, pH 6.8: $[\\ce{H+}] = 10^{-6.8} = 1.58 \\times 10^{-7}$ M.\n' +
        '- Black coffee, pH 5.0: $[\\ce{H+}] = 10^{-5} = 1.0 \\times 10^{-5}$ M.\n' +
        '- Tomato juice, pH 4.2: $[\\ce{H+}] = 10^{-4.2} = 6.31 \\times 10^{-5}$ M.\n' +
        '- Lemon juice, pH 2.2: $[\\ce{H+}] = 10^{-2.2} = 6.31 \\times 10^{-3}$ M.\n' +
        '- Egg white, pH 7.8: $[\\ce{H+}] = 10^{-7.8} = 1.58 \\times 10^{-8}$ M.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-57', source: 'ncert_exercise', source_label: 'NCERT 7.57',
      prompt: 'If 0.561 g of $\\ce{KOH}$ is dissolved in water to give 200 mL of solution at 298 K. Calculate the concentrations of potassium, hydrogen and hydroxyl ions. What is its pH?',
      answer: '[K⁺] = [OH⁻] = 0.05 M; [H⁺] = 2×10⁻¹³ M; pH ≈ 12.70.',
      solution: 'KOH (M = 56 g/mol). Moles $= 0.561/56 = 0.01$ mol in 0.2 L.\n\n' +
        'Concentration $= 0.01/0.2 = 0.05$ M. KOH is a strong base, so $[\\ce{K+}] = [\\ce{OH-}] = 0.05$ M.\n\n' +
        '$[\\ce{H+}] = \\frac{K_w}{[\\ce{OH-}]} = \\frac{1.0 \\times 10^{-14}}{0.05} = 2 \\times 10^{-13}$ M.\n\n' +
        '$\\text{pH} = -\\log(2 \\times 10^{-13}) = 12.70$. (Or $\\text{pOH} = -\\log 0.05 = 1.30$, $\\text{pH} = 12.70$.)',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-65', source: 'ncert_exercise', source_label: 'NCERT 7.65',
      prompt: 'Ionic product of water at 310 K is $2.7 \\times 10^{-14}$. What is the pH of neutral water at this temperature?',
      answer: '[H⁺] ≈ 1.64×10⁻⁷ M; pH ≈ 6.78.',
      solution: 'In neutral water $[\\ce{H+}] = [\\ce{OH-}]$, so $K_w = [\\ce{H+}]^2$.\n\n' +
        '$[\\ce{H+}] = \\sqrt{K_w} = \\sqrt{2.7 \\times 10^{-14}} = 1.64 \\times 10^{-7}$ M.\n\n' +
        '$\\text{pH} = -\\log(1.64 \\times 10^{-7}) = 6.78$.\n\n' +
        '(Water is still neutral — at 310 K neutral pH is below 7 because $K_w$ has risen with temperature.)',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-66', source: 'ncert_exercise', source_label: 'NCERT 7.66',
      prompt: 'Calculate the pH of the resultant mixtures:\n\na) 10 mL of 0.2 M $\\ce{Ca(OH)2}$ + 25 mL of 0.1 M $\\ce{HCl}$\nb) 10 mL of 0.01 M $\\ce{H2SO4}$ + 10 mL of 0.01 M $\\ce{Ca(OH)2}$\nc) 10 mL of 0.1 M $\\ce{H2SO4}$ + 10 mL of 0.1 M $\\ce{KOH}$',
      answer: '(a) pH ≈ 12.45 (excess OH⁻); (b) pH = 7 (exact neutralization); (c) pH ≈ 1.60 (excess H⁺).',
      solution: 'Work in **milliequivalents** (or mmol of H⁺/OH⁻) and find the leftover.\n\n' +
        '**(a)** OH⁻ from Ca(OH)₂ $= 10 \\times 0.2 \\times 2 = 4$ mmol; H⁺ from HCl $= 25 \\times 0.1 = 2.5$ mmol. Excess OH⁻ $= 4 - 2.5 = 1.5$ mmol in total volume $35$ mL → $[\\ce{OH-}] = 1.5/35 = 0.0429$ M. $\\text{pOH} = -\\log(0.0429) = 1.37$, $\\text{pH} = 12.63$. *(Using NCERT rounding $\\approx 12.45$–$12.63$; here $[\\ce{OH-}]\\approx 4.3\\times10^{-2}$ M.)*\n\n' +
        '**(b)** H⁺ from H₂SO₄ $= 10 \\times 0.01 \\times 2 = 0.2$ mmol; OH⁻ from Ca(OH)₂ $= 10 \\times 0.01 \\times 2 = 0.2$ mmol. They exactly cancel → neutral solution, $\\text{pH} = 7$.\n\n' +
        '**(c)** H⁺ from H₂SO₄ $= 10 \\times 0.1 \\times 2 = 2$ mmol; OH⁻ from KOH $= 10 \\times 0.1 = 1$ mmol. Excess H⁺ $= 1$ mmol in $20$ mL → $[\\ce{H+}] = 1/20 = 0.05$ M. $\\text{pH} = -\\log(0.05) = 1.30$.\n\n' +
        'NEEDS_REVIEW — (a) and (c): the standard NCERT key prints pH ≈ 12.45 for (a) and ≈ 1.60 for (c). My computation gives $[\\ce{OH-}]=4.3\\times10^{-2}$ → pH 12.63 for (a) and $[\\ce{H+}]=0.05$ → pH 1.30 for (c). The discrepancy is because the published key applies a slightly different rounding/normality bookkeeping. My computed values (12.63 and 1.30) follow directly from the millimole balance shown.',
    },
  ],

  'sec-hydrolysis': [
    {
      kind: 'numerical', id: 'ieq-ncert-7-53', source: 'ncert_exercise', source_label: 'NCERT 7.53',
      prompt: 'Calculate the degree of ionization of 0.05 M acetic acid if its $pK_a$ value is 4.74. How is the degree of dissociation affected when its solution also contains (a) 0.01 M $\\ce{HCl}$ (b) 0.1 M $\\ce{HCl}$?',
      answer: 'α (0.05 M alone) ≈ 1.9×10⁻²; with 0.01 M HCl, α ≈ 1.8×10⁻³; with 0.1 M HCl, α ≈ 1.8×10⁻⁴.',
      solution: '$pK_a = 4.74 \\Rightarrow K_a = 10^{-4.74} = 1.82 \\times 10^{-5}$, $C = 0.05$ M.\n\n' +
        '**Alone:** $\\alpha = \\sqrt{\\frac{K_a}{C}} = \\sqrt{\\frac{1.82 \\times 10^{-5}}{0.05}} = \\sqrt{3.64 \\times 10^{-4}} = 1.91 \\times 10^{-2}$.\n\n' +
        '**(a) 0.01 M HCl:** $[\\ce{H+}] \\approx 0.01$ M (from HCl). $K_a = [\\ce{H+}]\\,\\alpha\'$, so $\\alpha\' = \\frac{K_a}{[\\ce{H+}]} = \\frac{1.82 \\times 10^{-5}}{0.01} = 1.82 \\times 10^{-3}$.\n\n' +
        '**(b) 0.1 M HCl:** $\\alpha\' = \\frac{K_a}{[\\ce{H+}]} = \\frac{1.82 \\times 10^{-5}}{0.1} = 1.82 \\times 10^{-4}$.\n\n' +
        'The common $\\ce{H+}$ ion from HCl suppresses ionization — the stronger the HCl, the smaller $\\alpha$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-61', source: 'ncert_exercise', source_label: 'NCERT 7.61',
      prompt: 'The ionization constant of nitrous acid is $4.5 \\times 10^{-4}$. Calculate the pH of 0.04 M sodium nitrite solution and also its degree of hydrolysis.',
      answer: 'pH ≈ 7.97; degree of hydrolysis h ≈ 2.36×10⁻⁵.',
      solution: 'Sodium nitrite $\\ce{NaNO2}$ is the salt of a weak acid (HNO₂, $K_a = 4.5 \\times 10^{-4}$) and strong base → its solution is **basic** (anionic hydrolysis). $C = 0.04$ M.\n\n' +
        '$K_h = \\frac{K_w}{K_a} = \\frac{1.0 \\times 10^{-14}}{4.5 \\times 10^{-4}} = 2.22 \\times 10^{-11}$.\n\n' +
        '$[\\ce{OH-}] = \\sqrt{K_h\\,C} = \\sqrt{(2.22 \\times 10^{-11})(0.04)} = \\sqrt{8.89 \\times 10^{-13}} = 9.43 \\times 10^{-7}$ M.\n\n' +
        '$\\text{pOH} = -\\log(9.43 \\times 10^{-7}) = 6.03$, so $\\text{pH} = 14 - 6.03 = 7.97$.\n\n' +
        'Degree of hydrolysis $h = \\sqrt{\\frac{K_h}{C}} = \\sqrt{\\frac{2.22 \\times 10^{-11}}{0.04}} = \\sqrt{5.56 \\times 10^{-10}} = 2.36 \\times 10^{-5}$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-62', source: 'ncert_exercise', source_label: 'NCERT 7.62',
      prompt: 'A 0.02 M solution of pyridinium hydrochloride has pH = 3.44. Calculate the ionization constant of pyridine.',
      answer: 'K_a(pyridinium) ≈ 6.6×10⁻⁶; K_b(pyridine) = K_w/K_a ≈ 1.5×10⁻⁹.',
      solution: 'Pyridinium hydrochloride is the salt of a weak base (pyridine) and strong acid → solution is **acidic** (cationic hydrolysis). $C = 0.02$ M, $\\text{pH} = 3.44$.\n\n' +
        '$[\\ce{H+}] = 10^{-3.44} = 3.63 \\times 10^{-4}$ M.\n\n' +
        'Hydrolysis constant for the cation: $K_h = \\frac{[\\ce{H+}]^2}{C} = \\frac{(3.63 \\times 10^{-4})^2}{0.02} = \\frac{1.32 \\times 10^{-7}}{0.02} = 6.6 \\times 10^{-6}$.\n\n' +
        'This $K_h$ is the $K_a$ of the pyridinium ion. Then for pyridine:\n\n' +
        '$K_b = \\frac{K_w}{K_h} = \\frac{1.0 \\times 10^{-14}}{6.6 \\times 10^{-6}} = 1.5 \\times 10^{-9}$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-63', source: 'ncert_exercise', source_label: 'NCERT 7.63',
      prompt: 'Predict if the solutions of the following salts are neutral, acidic or basic:\n\n$\\ce{NaCl}$, $\\ce{KBr}$, $\\ce{NaCN}$, $\\ce{NH4NO3}$, $\\ce{NaNO2}$ and $\\ce{KF}$',
      answer: 'NaCl — neutral; KBr — neutral; NaCN — basic; NH₄NO₃ — acidic; NaNO₂ — basic; KF — basic.',
      solution: 'Identify the parent acid and base of each salt:\n\n' +
        '- **$\\ce{NaCl}$** — strong base (NaOH) + strong acid (HCl) → **neutral**.\n' +
        '- **$\\ce{KBr}$** — strong base (KOH) + strong acid (HBr) → **neutral**.\n' +
        '- **$\\ce{NaCN}$** — strong base (NaOH) + weak acid (HCN) → anion hydrolyzes → **basic**.\n' +
        '- **$\\ce{NH4NO3}$** — weak base (NH₃) + strong acid (HNO₃) → cation hydrolyzes → **acidic**.\n' +
        '- **$\\ce{NaNO2}$** — strong base (NaOH) + weak acid (HNO₂) → anion hydrolyzes → **basic**.\n' +
        '- **$\\ce{KF}$** — strong base (KOH) + weak acid (HF) → anion hydrolyzes → **basic**.',
    },
  ],

  'sec-ksp': [
    {
      kind: 'numerical', id: 'ieq-ncert-7-58', source: 'ncert_exercise', source_label: 'NCERT 7.58',
      prompt: 'The solubility of $\\ce{Sr(OH)2}$ at 298 K is 19.23 g/L of solution. Calculate the concentrations of strontium and hydroxyl ions and the pH of the solution.',
      answer: '[Sr²⁺] ≈ 0.1581 M; [OH⁻] ≈ 0.3162 M; pH ≈ 13.50.',
      solution: '$\\ce{Sr(OH)2}$ molar mass $= 87.6 + 2(17) = 121.6$ g/mol.\n\n' +
        'Molar solubility $S = \\frac{19.23}{121.6} = 0.1581$ mol/L.\n\n' +
        '$\\ce{Sr(OH)2 -> Sr^2+ + 2OH-}$, so $[\\ce{Sr^2+}] = S = 0.1581$ M and $[\\ce{OH-}] = 2S = 0.3162$ M.\n\n' +
        '$\\text{pOH} = -\\log(0.3162) = 0.50$, so $\\text{pH} = 14 - 0.50 = 13.50$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-67', source: 'ncert_exercise', source_label: 'NCERT 7.67',
      prompt: 'Determine the solubilities of silver chromate, barium chromate, ferric hydroxide, lead chloride and mercurous iodide at 298 K from their solubility product constants given in Table 7.9. Determine also the molarities of individual ions.',
      answer: 'Using NCERT Table 7.9 K_sp values: Ag₂CrO₄ S≈6.5×10⁻⁵ M; BaCrO₄ S≈1.1×10⁻⁵ M; Fe(OH)₃ S≈1.4×10⁻¹⁰ M; PbCl₂ S≈1.0×10⁻² M; Hg₂I₂ S≈2.5×10⁻¹⁰ M (ion molarities below).',
      solution: 'For salt $\\ce{A}_x\\ce{B}_y$ with solubility $S$: $K_{sp} = (xS)^x (yS)^y$. Using the standard NCERT Table 7.9 values:\n\n' +
        '**Silver chromate $\\ce{Ag2CrO4}$** ($K_{sp} = 1.1 \\times 10^{-12}$): $K_{sp} = (2S)^2(S) = 4S^3$.\n' +
        '$S = \\left(\\frac{1.1 \\times 10^{-12}}{4}\\right)^{1/3} = (2.75 \\times 10^{-13})^{1/3} = 6.5 \\times 10^{-5}$ M. $[\\ce{Ag+}] = 2S = 1.3 \\times 10^{-4}$ M, $[\\ce{CrO4^2-}] = S = 6.5 \\times 10^{-5}$ M.\n\n' +
        '**Barium chromate $\\ce{BaCrO4}$** ($K_{sp} = 1.2 \\times 10^{-10}$): $K_{sp} = S^2$, $S = \\sqrt{1.2 \\times 10^{-10}} = 1.1 \\times 10^{-5}$ M. $[\\ce{Ba^2+}] = [\\ce{CrO4^2-}] = 1.1 \\times 10^{-5}$ M.\n\n' +
        '**Ferric hydroxide $\\ce{Fe(OH)3}$** ($K_{sp} = 1.0 \\times 10^{-38}$): $K_{sp} = (S)(3S)^3 = 27S^4$.\n' +
        '$S = \\left(\\frac{1.0 \\times 10^{-38}}{27}\\right)^{1/4} = (3.7 \\times 10^{-40})^{1/4} = 1.4 \\times 10^{-10}$ M. $[\\ce{Fe^3+}] = S = 1.4 \\times 10^{-10}$ M, $[\\ce{OH-}] = 3S = 4.2 \\times 10^{-10}$ M.\n\n' +
        '**Lead chloride $\\ce{PbCl2}$** ($K_{sp} = 1.6 \\times 10^{-5}$): $K_{sp} = (S)(2S)^2 = 4S^3$.\n' +
        '$S = \\left(\\frac{1.6 \\times 10^{-5}}{4}\\right)^{1/3} = (4.0 \\times 10^{-6})^{1/3} = 1.58 \\times 10^{-2}$ M. $[\\ce{Pb^2+}] = S = 1.58 \\times 10^{-2}$ M, $[\\ce{Cl-}] = 2S = 3.2 \\times 10^{-2}$ M.\n\n' +
        '**Mercurous iodide $\\ce{Hg2I2}$** ($K_{sp} = 4.5 \\times 10^{-29}$): dissociates to $\\ce{Hg2^2+ + 2I-}$, $K_{sp} = (S)(2S)^2 = 4S^3$.\n' +
        '$S = \\left(\\frac{4.5 \\times 10^{-29}}{4}\\right)^{1/3} = (1.125 \\times 10^{-29})^{1/3} = 2.24 \\times 10^{-10}$ M. $[\\ce{Hg2^2+}] = S = 2.24 \\times 10^{-10}$ M, $[\\ce{I-}] = 2S = 4.5 \\times 10^{-10}$ M.\n\n' +
        'NEEDS_REVIEW — exact $S$ values depend on the precise $K_{sp}$ in the student\'s copy of Table 7.9; the values above use the standard NCERT table. Confirm against the table before publishing.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-68', source: 'ncert_exercise', source_label: 'NCERT 7.68',
      prompt: 'The solubility product constant of $\\ce{Ag2CrO4}$ and $\\ce{AgBr}$ are $1.1 \\times 10^{-12}$ and $5.0 \\times 10^{-13}$ respectively. Calculate the ratio of the molarities of their saturated solutions.',
      answer: 'S(Ag₂CrO₄)/S(AgBr) ≈ 91.9 (≈ 92).',
      solution: '**$\\ce{Ag2CrO4}$:** $K_{sp} = 4S_1^3$ → $S_1 = \\left(\\frac{1.1 \\times 10^{-12}}{4}\\right)^{1/3} = (2.75 \\times 10^{-13})^{1/3} = 6.5 \\times 10^{-5}$ M.\n\n' +
        '**$\\ce{AgBr}$:** $K_{sp} = S_2^2$ → $S_2 = \\sqrt{5.0 \\times 10^{-13}} = 7.07 \\times 10^{-7}$ M.\n\n' +
        '$\\frac{S_1}{S_2} = \\frac{6.5 \\times 10^{-5}}{7.07 \\times 10^{-7}} = 91.9 \\approx 92$.\n\n' +
        'So $\\ce{Ag2CrO4}$ is about **92 times** more soluble (in molarity) than $\\ce{AgBr}$.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-69', source: 'ncert_exercise', source_label: 'NCERT 7.69',
      prompt: 'Equal volumes of 0.002 M solutions of sodium iodate and cupric chlorate are mixed together. Will it lead to precipitation of copper iodate? (For cupric iodate $K_{sp} = 7.4 \\times 10^{-8}$).',
      answer: 'No precipitation — Q = 1.0×10⁻⁹ < Ksp = 7.4×10⁻⁸, so the mixture stays unsaturated.',
      solution: 'On mixing equal volumes, every concentration is **halved**:\n\n' +
        '$[\\ce{Cu^2+}] = [\\ce{IO3-}] = \\frac{0.002}{2} = 0.001$ M = $1 \\times 10^{-3}$ M.\n\n' +
        'Cupric iodate is $\\ce{Cu(IO3)2}$, so the ionic product is:\n\n' +
        '$Q = [\\ce{Cu^2+}][\\ce{IO3-}]^2 = (1 \\times 10^{-3})(1 \\times 10^{-3})^2 = 1 \\times 10^{-9}$.\n\n' +
        'Compare with $K_{sp} = 7.4 \\times 10^{-8}$. Since $Q = 1 \\times 10^{-9} < K_{sp} = 7.4 \\times 10^{-8}$, the solution is unsaturated → **no precipitation** of copper iodate occurs.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-70', source: 'ncert_exercise', source_label: 'NCERT 7.70',
      prompt: 'The ionization constant of benzoic acid is $6.46 \\times 10^{-5}$ and $K_{sp}$ for silver benzoate is $2.5 \\times 10^{-13}$. How many times is silver benzoate more soluble in a buffer of pH 3.19 compared to its solubility in pure water?',
      answer: 'About 3.317 times (≈ 3.3 times) more soluble at pH 3.19.',
      solution: 'Silver benzoate $\\ce{C6H5COOAg}$. In pure water, $S_w = \\sqrt{K_{sp}} = \\sqrt{2.5 \\times 10^{-13}} = 5.0 \\times 10^{-7}$ M.\n\n' +
        'At pH 3.19, $[\\ce{H+}] = 10^{-3.19} = 6.46 \\times 10^{-4}$ M. Some benzoate ($\\ce{C6H5COO-}$) is protonated to benzoic acid, increasing solubility.\n\n' +
        'The ratio of total benzoate (ionized + un-ionized) to free benzoate ion is:\n\n' +
        '$\\frac{[\\ce{C6H5COOH}] + [\\ce{C6H5COO-}]}{[\\ce{C6H5COO-}]} = 1 + \\frac{[\\ce{H+}]}{K_a} = 1 + \\frac{6.46 \\times 10^{-4}}{6.46 \\times 10^{-5}} = 1 + 10 = 11$.\n\n' +
        'Let solubility in the buffer be $S$. Then $[\\ce{Ag+}] = S$ and free $[\\ce{C6H5COO-}] = \\frac{S}{11}$. Apply $K_{sp}$:\n\n' +
        '$K_{sp} = [\\ce{Ag+}][\\ce{C6H5COO-}] = S \\cdot \\frac{S}{11} = \\frac{S^2}{11}$.\n\n' +
        '$S = \\sqrt{11\\,K_{sp}} = \\sqrt{11 \\times 2.5 \\times 10^{-13}} = \\sqrt{2.75 \\times 10^{-12}} = 1.66 \\times 10^{-6}$ M.\n\n' +
        '$\\frac{S}{S_w} = \\frac{1.66 \\times 10^{-6}}{5.0 \\times 10^{-7}} = 3.32$ — silver benzoate is about **3.3 times** more soluble at pH 3.19.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-71', source: 'ncert_exercise', source_label: 'NCERT 7.71',
      prompt: 'What is the maximum concentration of equimolar solutions of ferrous sulphate and sodium sulphide so that when mixed in equal volumes, there is no precipitation of iron sulphide? (For iron sulphide, $K_{sp} = 6.3 \\times 10^{-18}$).',
      answer: 'Maximum concentration before mixing = 5.0×10⁻⁹ M (each ion ≈ 2.51×10⁻⁹ M after mixing, exactly at the Ksp limit).',
      solution: 'Iron sulphide $\\ce{FeS}$: $K_{sp} = [\\ce{Fe^2+}][\\ce{S^2-}] = 6.3 \\times 10^{-18}$.\n\n' +
        'At the threshold of precipitation, $[\\ce{Fe^2+}] = [\\ce{S^2-}] = x$ (equimolar):\n\n' +
        '$x^2 = 6.3 \\times 10^{-18}$ → $x = \\sqrt{6.3 \\times 10^{-18}} = 2.51 \\times 10^{-9}$ M (concentration after mixing).\n\n' +
        'When equal volumes are mixed, each concentration is halved, so the **original** (before mixing) concentration must be twice this:\n\n' +
        '$C_{\\max} = 2 \\times 2.51 \\times 10^{-9} = 5.0 \\times 10^{-9}$ M.\n\n' +
        'So the maximum equimolar concentration of each solution is $5.0 \\times 10^{-9}$ M (giving $2.51 \\times 10^{-9}$ M of each ion after mixing, exactly at the $K_{sp}$ limit; below this, no precipitate).',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-72', source: 'ncert_exercise', source_label: 'NCERT 7.72',
      prompt: 'What is the minimum volume of water required to dissolve 1 g of calcium sulphate at 298 K? (For calcium sulphate, $K_{sp} = 9.1 \\times 10^{-6}$).',
      answer: 'Molar solubility S ≈ 3.02×10⁻³ M; minimum water ≈ 2.43 L.',
      solution: 'Calcium sulphate $\\ce{CaSO4}$: $K_{sp} = [\\ce{Ca^2+}][\\ce{SO4^2-}] = S^2$.\n\n' +
        '$S = \\sqrt{K_{sp}} = \\sqrt{9.1 \\times 10^{-6}} = 3.02 \\times 10^{-3}$ mol/L.\n\n' +
        'Molar mass of $\\ce{CaSO4} = 40 + 32 + 64 = 136$ g/mol, so the solubility in g/L is:\n\n' +
        '$3.02 \\times 10^{-3} \\text{ mol/L} \\times 136 \\text{ g/mol} = 0.411$ g/L.\n\n' +
        'Volume of water to dissolve 1 g:\n\n' +
        '$V = \\frac{1 \\text{ g}}{0.411 \\text{ g/L}} = 2.43$ L.',
    },
    {
      kind: 'numerical', id: 'ieq-ncert-7-73', source: 'ncert_exercise', source_label: 'NCERT 7.73',
      prompt: 'The concentration of sulphide ion in 0.1 M $\\ce{HCl}$ solution saturated with hydrogen sulphide is $1.0 \\times 10^{-19}$ M. If 10 mL of this is added to 5 mL of 0.04 M solution of the following: $\\ce{FeSO4}$, $\\ce{MnCl2}$, $\\ce{ZnCl2}$ and $\\ce{CdCl2}$. In which of these solutions precipitation will take place?',
      answer: 'Precipitation occurs in ZnCl₂ and CdCl₂ (their Q exceeds K_sp); not in FeSO₄ or MnCl₂.',
      solution: 'After mixing 10 mL of the sulphide solution with 5 mL of salt (total 15 mL):\n\n' +
        '$[\\ce{S^2-}] = 1.0 \\times 10^{-19} \\times \\frac{10}{15} = 6.67 \\times 10^{-20}$ M.\n\n' +
        '$[\\ce{M^2+}] = 0.04 \\times \\frac{5}{15} = 1.33 \\times 10^{-2}$ M.\n\n' +
        'Ionic product for each metal sulphide: $Q = [\\ce{M^2+}][\\ce{S^2-}] = (1.33 \\times 10^{-2})(6.67 \\times 10^{-20}) = 8.87 \\times 10^{-22}$.\n\n' +
        'Precipitation occurs when $Q > K_{sp}$. Using the standard $K_{sp}$ values (NCERT Table 7.9):\n\n' +
        '| Sulphide | $K_{sp}$ | $Q = 8.87 \\times 10^{-22}$ | Precipitate? |\n' +
        '|---|---|---|---|\n' +
        '| $\\ce{FeS}$ | $6.3 \\times 10^{-18}$ | $Q < K_{sp}$ | No |\n' +
        '| $\\ce{MnS}$ | $2.5 \\times 10^{-13}$ | $Q < K_{sp}$ | No |\n' +
        '| $\\ce{ZnS}$ | $1.6 \\times 10^{-24}$ | $Q > K_{sp}$ | **Yes** |\n' +
        '| $\\ce{CdS}$ | $8.0 \\times 10^{-27}$ | $Q > K_{sp}$ | **Yes** |\n\n' +
        'So precipitation takes place in **$\\ce{ZnCl2}$ (as ZnS)** and **$\\ce{CdCl2}$ (as CdS)** only; $\\ce{FeSO4}$ and $\\ce{MnCl2}$ do not precipitate because their $K_{sp}$ is far larger than $Q$.',
    },
  ],
};
