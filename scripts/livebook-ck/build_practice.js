'use strict';
/* Chemical Kinetics — page 38: NCERT Practice (section-navigated practice_bank).
 * 39 questions: all 30 end-of-chapter Exercises (4.1–4.30) + 9 Intext Questions (4.1–4.9),
 * solved, classified into 5 sections. Source = ncert_exercise. published:false. */
const { B, page, pnum, psec, buildPages } = require('./_lib');
const exemplar = require('./exemplar_items');

// ── Section A — Rate of Reaction ────────────────────────────────────────────
const sectionA = psec('rate-of-reaction', 'A · Rate of Reaction',
  'Average and instantaneous rate, and the factors that change it.',
  [
    pnum('NCERT Intext 4.1',
      'For the reaction $\\ce{R -> P}$, the concentration of a reactant changes from $0.03$ M to $0.02$ M in 25 minutes. Calculate the average rate of reaction in units of minutes and seconds.',
      '$4\\times10^{-4}$ mol L⁻¹ min⁻¹ $= 6.66\\times10^{-6}$ mol L⁻¹ s⁻¹',
      'Average rate $= -\\dfrac{\\Delta[\\ce{R}]}{\\Delta t} = \\dfrac{0.03 - 0.02}{25} = 4\\times10^{-4}\\ \\text{mol L}^{-1}\\text{min}^{-1}$.\n\nIn seconds: $\\dfrac{4\\times10^{-4}}{60} = 6.66\\times10^{-6}\\ \\text{mol L}^{-1}\\text{s}^{-1}$.'),
    pnum('NCERT Intext 4.2',
      'In a reaction $\\ce{2A -> products}$, the concentration of A decreases from $0.5$ mol L⁻¹ to $0.4$ mol L⁻¹ in 10 minutes. Calculate the rate during this interval.',
      'Rate of reaction $= 5\\times10^{-3}$ mol L⁻¹ min⁻¹',
      'Rate of reaction $= -\\dfrac{1}{2}\\dfrac{\\Delta[\\ce{A}]}{\\Delta t} = -\\dfrac{1}{2}\\cdot\\dfrac{0.4 - 0.5}{10} = \\dfrac{1}{2}\\times0.01 = 5\\times10^{-3}\\ \\text{mol L}^{-1}\\text{min}^{-1}$.\n\n(The rate of disappearance of A itself is $0.01\\ \\text{mol L}^{-1}\\text{min}^{-1}$.)'),
    pnum('NCERT Exercise 4.5',
      'Mention the factors that affect the rate of a chemical reaction.',
      undefined,
      'The main factors are:\n\n- **Concentration** of the reactants (pressure, for gases).\n- **Temperature** — rate rises sharply with temperature.\n- **Catalyst** — a catalyst speeds the reaction by lowering the activation energy.\n- **Surface area / physical state** of the reactants (finely divided solids react faster).\n- **Nature of the reactants** (bonds to be broken/formed).\n- **Radiation / light**, for photochemical reactions.'),
  ]);

// ── Section B — Rate Law, Order & Molecularity ──────────────────────────────
const sectionB = psec('rate-law-and-order', 'B · Rate Law, Order & Molecularity',
  'Order and the dimensions of the rate constant; finding the rate law from data.',
  [
    pnum('NCERT Exercise 4.1',
      'From the rate expression for the following reactions, determine the order of reaction and the dimensions of the rate constant.\n\n(i) $\\ce{3NO(g) -> N2O(g)}$, Rate $= k[\\ce{NO}]^2$\n\n(ii) $\\ce{H2O2(aq) + 3I^- + 2H^+ -> 2H2O + I3^-}$, Rate $= k[\\ce{H2O2}][\\ce{I^-}]$\n\n(iii) $\\ce{CH3CHO(g) -> CH4(g) + CO(g)}$, Rate $= k[\\ce{CH3CHO}]^{3/2}$\n\n(iv) $\\ce{C2H5Cl(g) -> C2H4(g) + HCl(g)}$, Rate $= k[\\ce{C2H5Cl}]$',
      undefined,
      '**(i)** Order $= 2$; $k = \\dfrac{\\text{mol L}^{-1}\\text{s}^{-1}}{(\\text{mol L}^{-1})^2} = \\text{mol}^{-1}\\text{L s}^{-1}$.\n\n**(ii)** Order $= 1 + 1 = 2$; $k = \\text{mol}^{-1}\\text{L s}^{-1}$.\n\n**(iii)** Order $= \\tfrac{3}{2}$; $k = (\\text{mol L}^{-1})^{1-3/2}\\text{s}^{-1} = \\text{mol}^{-1/2}\\text{L}^{1/2}\\text{s}^{-1}$.\n\n**(iv)** Order $= 1$; $k = \\text{s}^{-1}$.'),
    pnum('NCERT Exercise 4.2',
      'For the reaction $\\ce{2A + B -> A2B}$ the rate $= k[\\ce{A}][\\ce{B}]^2$ with $k = 2.0\\times10^{-6}\\ \\text{mol}^{-2}\\text{L}^2\\text{s}^{-1}$. Calculate the initial rate when $[\\ce{A}] = 0.1$, $[\\ce{B}] = 0.2\\ \\text{mol L}^{-1}$, and the rate after $[\\ce{A}]$ is reduced to $0.06\\ \\text{mol L}^{-1}$.',
      'Initial rate $= 8\\times10^{-9}$; after $= 3.89\\times10^{-9}$ mol L⁻¹ s⁻¹',
      '**Initial rate:** $k[\\ce{A}][\\ce{B}]^2 = 2.0\\times10^{-6}\\times0.1\\times(0.2)^2 = 8\\times10^{-9}\\ \\text{mol L}^{-1}\\text{s}^{-1}$.\n\n**After $[\\ce{A}] = 0.06$:** A consumed $= 0.04$, so B consumed $= 0.04/2 = 0.02$, giving $[\\ce{B}] = 0.18$.\n\nRate $= 2.0\\times10^{-6}\\times0.06\\times(0.18)^2 = 3.89\\times10^{-9}\\ \\text{mol L}^{-1}\\text{s}^{-1}$.'),
    pnum('NCERT Exercise 4.3',
      'The decomposition of $\\ce{NH3}$ on a platinum surface is a zero-order reaction. What are the rates of production of $\\ce{N2}$ and $\\ce{H2}$ if $k = 2.5\\times10^{-4}\\ \\text{mol L}^{-1}\\text{s}^{-1}$?',
      'Rate of reaction $= 2.5\\times10^{-4}$; $\\ce{N2}: 2.5\\times10^{-4}$; $\\ce{H2}: 7.5\\times10^{-4}$ mol L⁻¹ s⁻¹',
      'For $\\ce{2NH3 -> N2 + 3H2}$, rate of reaction $= k = 2.5\\times10^{-4}\\ \\text{mol L}^{-1}\\text{s}^{-1}$ (zero order).\n\nRate $= \\dfrac{d[\\ce{N2}]}{dt} = \\dfrac{1}{3}\\dfrac{d[\\ce{H2}]}{dt}$.\n\nSo $\\dfrac{d[\\ce{N2}]}{dt} = 2.5\\times10^{-4}$ and $\\dfrac{d[\\ce{H2}]}{dt} = 3\\times2.5\\times10^{-4} = 7.5\\times10^{-4}\\ \\text{mol L}^{-1}\\text{s}^{-1}$.'),
    pnum('NCERT Exercise 4.6',
      'A reaction is second order with respect to a reactant. How is the rate affected if the concentration of the reactant is (i) doubled, (ii) reduced to half?',
      '(i) becomes 4×; (ii) becomes ¼×',
      'Rate $\\propto [\\ce{A}]^2$.\n\n**(i)** Doubling: $(2)^2 = 4$, so the rate becomes **4 times**.\n\n**(ii)** Halving: $(\\tfrac12)^2 = \\tfrac14$, so the rate becomes **one-fourth**.'),
    pnum('NCERT Exercise 4.9',
      'A reaction is first order in A and second order in B. (i) Write the differential rate equation. (ii) How is the rate affected on increasing $[\\ce{B}]$ three times? (iii) How is the rate affected when both $[\\ce{A}]$ and $[\\ce{B}]$ are doubled?',
      undefined,
      '**(i)** $-\\dfrac{d[\\ce{R}]}{dt} = k[\\ce{A}][\\ce{B}]^2$.\n\n**(ii)** $[\\ce{B}]$ tripled: rate $\\times 3^2 = 9$ — rate becomes **9 times**.\n\n**(iii)** Both doubled: rate $\\times 2^1 \\times 2^2 = 8$ — rate becomes **8 times**.'),
    pnum('NCERT Exercise 4.10',
      'In a reaction between A and B, the initial rate $r_0$ was measured for different initial concentrations:\n\n| $[\\ce{A}]$/mol L⁻¹ | 0.20 | 0.20 | 0.40 |\n|---|---|---|---|\n| $[\\ce{B}]$/mol L⁻¹ | 0.30 | 0.10 | 0.05 |\n| $r_0$/mol L⁻¹ s⁻¹ | $5.07\\times10^{-5}$ | $5.07\\times10^{-5}$ | $1.43\\times10^{-4}$ |\n\nWhat is the order with respect to A and B?',
      'Order in A $= 1.5$, order in B $= 0$ (overall 1.5)',
      '**Order in B:** compare experiments 1 and 2 — $[\\ce{A}]$ fixed at 0.20, $[\\ce{B}]$ changes 0.30 → 0.10 but $r_0$ is unchanged. So order in B $= 0$.\n\n**Order in A:** compare experiments 2 and 3 (B has no effect). $[\\ce{A}]$: 0.20 → 0.40 (×2); $r_0$: $5.07\\times10^{-5} \\to 1.43\\times10^{-4}$ (×2.82). So $2^m = 2.82 \\Rightarrow m = \\dfrac{\\log 2.82}{\\log 2} \\approx 1.5$.\n\n**Order in A $= 1.5$, order in B $= 0$.**'),
    pnum('NCERT Exercise 4.11',
      'For $\\ce{2A + B -> C + D}$, the following data were obtained:\n\n| Exp | $[\\ce{A}]$ | $[\\ce{B}]$ | Initial rate of formation of D (mol L⁻¹ min⁻¹) |\n|---|---|---|---|\n| I | 0.1 | 0.1 | $6.0\\times10^{-3}$ |\n| II | 0.3 | 0.2 | $7.2\\times10^{-2}$ |\n| III | 0.3 | 0.4 | $2.88\\times10^{-1}$ |\n| IV | 0.4 | 0.1 | $2.40\\times10^{-2}$ |\n\nDetermine the rate law and the rate constant.',
      'Rate $= k[\\ce{A}][\\ce{B}]^2$; $k = 6.0\\ \\text{mol}^{-2}\\text{L}^2\\text{min}^{-1}$',
      '**Order in B:** Exp II → III, $[\\ce{A}]$ fixed; $[\\ce{B}]$ ×2, rate ×4 $\\Rightarrow$ order 2.\n\n**Order in A:** Exp I → IV, $[\\ce{B}]$ fixed; $[\\ce{A}]$ ×4, rate ×4 $\\Rightarrow$ order 1.\n\n**Rate law:** Rate $= k[\\ce{A}][\\ce{B}]^2$.\n\n**Rate constant** (from Exp I): $6.0\\times10^{-3} = k(0.1)(0.1)^2 = k\\times10^{-3}$, so $k = 6.0\\ \\text{mol}^{-2}\\text{L}^2\\text{min}^{-1}$.'),
    pnum('NCERT Exercise 4.12',
      'The reaction between A and B is first order in A and zero order in B. Fill in the blanks:\n\n| Exp | $[\\ce{A}]$ | $[\\ce{B}]$ | Initial rate (mol L⁻¹ min⁻¹) |\n|---|---|---|---|\n| I | 0.1 | 0.1 | $2.0\\times10^{-2}$ |\n| II | — | 0.2 | $4.0\\times10^{-2}$ |\n| III | 0.4 | 0.4 | — |\n| IV | — | 0.2 | $2.0\\times10^{-2}$ |',
      'II: $[\\ce{A}]=0.2$; III: rate $=8.0\\times10^{-2}$; IV: $[\\ce{A}]=0.1$',
      'Rate $= k[\\ce{A}]$ (zero order in B). From Exp I: $k = \\dfrac{2.0\\times10^{-2}}{0.1} = 0.2\\ \\text{min}^{-1}$.\n\n**Exp II:** $[\\ce{A}] = \\dfrac{4.0\\times10^{-2}}{0.2} = 0.2$.\n\n**Exp III:** rate $= 0.2\\times0.4 = 8.0\\times10^{-2}$.\n\n**Exp IV:** $[\\ce{A}] = \\dfrac{2.0\\times10^{-2}}{0.2} = 0.1$.'),
    pnum('NCERT Intext 4.3',
      'For a reaction $\\ce{A + B -> Product}$, the rate law is $r = k[\\ce{A}]^{1/2}[\\ce{B}]^2$. What is the order of the reaction?',
      'Order $= 2.5$',
      'Order $=$ sum of the exponents $= \\dfrac{1}{2} + 2 = \\dfrac{5}{2} = 2.5$.'),
    pnum('NCERT Intext 4.4',
      'The conversion of molecules X to Y follows second-order kinetics. If the concentration of X is increased to three times, how will the rate of formation of Y change?',
      'Rate becomes 9 times',
      'Rate $= k[\\ce{X}]^2$. Tripling $[\\ce{X}]$: rate $\\times 3^2 = 9$. The rate of formation of Y increases **9 times**.'),
  ]);

// ── Section C — Integrated Rate Laws (Zero & First Order) ───────────────────
const sectionC = psec('integrated-rate-laws', 'C · Integrated Rate Laws (Zero & First Order)',
  'Half-life, completion times, and the rate constant from concentration data.',
  [
    pnum('NCERT Exercise 4.4',
      'The decomposition of dimethyl ether gives $\\ce{CH4}$, $\\ce{H2}$ and $\\ce{CO}$, with rate $= k\\,(p_{\\ce{CH3OCH3}})^{3/2}$, the rate being followed by the increase in pressure. If pressure is in bar and time in minutes, what are the units of rate and of the rate constant?',
      'Rate: bar min⁻¹; $k$: bar⁻¹ᐟ² min⁻¹',
      'Rate $=$ pressure/time $= \\text{bar min}^{-1}$.\n\n$k = \\dfrac{\\text{rate}}{(p)^{3/2}} = \\dfrac{\\text{bar min}^{-1}}{\\text{bar}^{3/2}} = \\text{bar}^{-1/2}\\,\\text{min}^{-1}$.'),
    pnum('NCERT Exercise 4.8',
      'In a pseudo first-order hydrolysis of ester in water the following results were obtained:\n\n| $t$/s | 0 | 30 | 60 | 90 |\n|---|---|---|---|---|\n| [Ester]/mol L⁻¹ | 0.55 | 0.31 | 0.17 | 0.085 |\n\n(i) Calculate the average rate between 30 and 60 s. (ii) Calculate the pseudo first-order rate constant.',
      '(i) $4.67\\times10^{-3}$ mol L⁻¹ s⁻¹; (ii) $k \\approx 1.98\\times10^{-2}$ s⁻¹',
      '**(i)** Average rate $= -\\dfrac{0.17 - 0.31}{60 - 30} = \\dfrac{0.14}{30} = 4.67\\times10^{-3}\\ \\text{mol L}^{-1}\\text{s}^{-1}$.\n\n**(ii)** $k = \\dfrac{2.303}{t}\\log\\dfrac{C_0}{C}$.\n\nAt 30 s: $k = \\dfrac{2.303}{30}\\log\\dfrac{0.55}{0.31} = 1.91\\times10^{-2}$.\n\nAt 60 s: $k = \\dfrac{2.303}{60}\\log\\dfrac{0.55}{0.17} = 1.96\\times10^{-2}$.\n\nAt 90 s: $k = \\dfrac{2.303}{90}\\log\\dfrac{0.55}{0.085} = 2.07\\times10^{-2}$.\n\nAverage $k \\approx 1.98\\times10^{-2}\\ \\text{s}^{-1}$.'),
    pnum('NCERT Exercise 4.13',
      'Calculate the half-life of a first-order reaction from each rate constant: (i) $200\\ \\text{s}^{-1}$; (ii) $2\\ \\text{min}^{-1}$; (iii) $4\\ \\text{year}^{-1}$.',
      '(i) $3.47\\times10^{-3}$ s; (ii) $0.347$ min; (iii) $0.173$ year',
      '$t_{1/2} = \\dfrac{0.693}{k}$.\n\n**(i)** $\\dfrac{0.693}{200} = 3.47\\times10^{-3}\\ \\text{s}$.\n\n**(ii)** $\\dfrac{0.693}{2} = 0.347\\ \\text{min}$.\n\n**(iii)** $\\dfrac{0.693}{4} = 0.173\\ \\text{year}$.'),
    pnum('NCERT Exercise 4.16',
      'The rate constant for a first-order reaction is $60\\ \\text{s}^{-1}$. How much time will it take to reduce the initial concentration of the reactant to its $1/16$th value?',
      '$t = 4.62\\times10^{-2}$ s',
      '$\\dfrac{1}{16} = \\dfrac{1}{2^4}$, i.e. 4 half-lives.\n\n$t_{1/2} = \\dfrac{0.693}{60} = 1.155\\times10^{-2}\\ \\text{s}$, so $t = 4\\times1.155\\times10^{-2} = 4.62\\times10^{-2}\\ \\text{s}$.\n\n(Equivalently $t = \\dfrac{2.303}{60}\\log 16 = 4.62\\times10^{-2}\\ \\text{s}$.)'),
    pnum('NCERT Exercise 4.18',
      'For a first-order reaction, show that the time required for 99% completion is twice the time required for 90% completion.',
      '$t_{99\\%} = 2\\,t_{90\\%}$',
      '$t = \\dfrac{2.303}{k}\\log\\dfrac{[\\ce{R}]_0}{[\\ce{R}]}$.\n\n**99% complete** ($[\\ce{R}] = 0.01[\\ce{R}]_0$): $t_{99} = \\dfrac{2.303}{k}\\log 100 = \\dfrac{2.303\\times2}{k}$.\n\n**90% complete** ($[\\ce{R}] = 0.1[\\ce{R}]_0$): $t_{90} = \\dfrac{2.303}{k}\\log 10 = \\dfrac{2.303}{k}$.\n\n$\\dfrac{t_{99}}{t_{90}} = 2$, so $t_{99\\%} = 2\\,t_{90\\%}$.'),
    pnum('NCERT Exercise 4.19',
      'A first-order reaction takes 40 minutes for 30% decomposition. Calculate $t_{1/2}$.',
      '$t_{1/2} \\approx 77.7$ min',
      '30% decomposed $\\Rightarrow$ 70% remains.\n\n$k = \\dfrac{2.303}{40}\\log\\dfrac{100}{70} = \\dfrac{2.303}{40}\\times0.1549 = 8.92\\times10^{-3}\\ \\text{min}^{-1}$.\n\n$t_{1/2} = \\dfrac{0.693}{8.92\\times10^{-3}} \\approx 77.7\\ \\text{min}$.'),
    pnum('NCERT Exercise 4.24',
      'Consider a reaction $\\ce{A -> Products}$ with $k = 2.0\\times10^{-2}\\ \\text{s}^{-1}$. Calculate the concentration of A remaining after 100 s if the initial concentration of A is $1.0\\ \\text{mol L}^{-1}$.',
      '$[\\ce{A}] = 0.135$ mol L⁻¹',
      'The units of $k$ ($\\text{s}^{-1}$) show this is **first order**.\n\n$[\\ce{A}] = [\\ce{A}]_0\\,e^{-kt} = 1.0\\times e^{-(2.0\\times10^{-2})(100)} = e^{-2} = 0.135\\ \\text{mol L}^{-1}$.'),
    pnum('NCERT Exercise 4.25',
      'Sucrose decomposes in acid solution into glucose and fructose following first-order kinetics with $t_{1/2} = 3.00$ hours. What fraction of a sample of sucrose remains after 8 hours?',
      'About $0.158$ (≈ 15.8%)',
      '$k = \\dfrac{0.693}{3.00} = 0.231\\ \\text{h}^{-1}$.\n\n$\\dfrac{[\\ce{R}]}{[\\ce{R}]_0} = e^{-kt} = e^{-0.231\\times8} = e^{-1.848} = 0.158$.\n\nSo about **15.8%** of the sucrose remains.'),
    pnum('NCERT Intext 4.5',
      'A first-order reaction has a rate constant $1.15\\times10^{-3}\\ \\text{s}^{-1}$. How long will 5 g of this reactant take to reduce to 3 g?',
      '$t = 444$ s',
      '$t = \\dfrac{2.303}{k}\\log\\dfrac{[\\ce{R}]_0}{[\\ce{R}]} = \\dfrac{2.303}{1.15\\times10^{-3}}\\log\\dfrac{5}{3}$.\n\n$= 2002.6\\times\\log 1.667 = 2002.6\\times0.2218 = 444\\ \\text{s}$.'),
    pnum('NCERT Intext 4.6',
      'Time required to decompose $\\ce{SO2Cl2}$ to half of its initial amount is 60 minutes. If the decomposition is first order, calculate the rate constant.',
      '$k = 1.925\\times10^{-4}$ s⁻¹',
      '$k = \\dfrac{0.693}{t_{1/2}} = \\dfrac{0.693}{60\\ \\text{min}} = 0.01155\\ \\text{min}^{-1}$.\n\nIn seconds: $\\dfrac{0.01155}{60} = 1.925\\times10^{-4}\\ \\text{s}^{-1}$.'),
  ]);

// ── Section D — Gas-Phase & Radioactive First Order ─────────────────────────
const sectionD = psec('gas-phase-and-radioactive', 'D · Gas-Phase & Radioactive First Order',
  'Following first-order reactions by pressure, and radioactive decay.',
  [
    pnum('NCERT Exercise 4.14',
      'The half-life for radioactive decay of $\\ce{^{14}C}$ is 5730 years. An archaeological artifact containing wood had only 80% of the $\\ce{^{14}C}$ found in a living tree. Estimate the age of the sample.',
      'About 1845 years',
      '$k = \\dfrac{0.693}{5730} = 1.209\\times10^{-4}\\ \\text{year}^{-1}$.\n\n$t = \\dfrac{2.303}{k}\\log\\dfrac{100}{80} = \\dfrac{2.303}{1.209\\times10^{-4}}\\times0.0969 \\approx 1845\\ \\text{years}$.'),
    pnum('NCERT Exercise 4.15',
      'The decomposition of $\\ce{N2O5}$ ($\\ce{2N2O5 -> 4NO2 + O2}$) at 318 K gives the data:\n\n| $t$/s | 0 | 400 | 800 | 1200 | 1600 | 2000 | 2400 | 2800 | 3200 |\n|---|---|---|---|---|---|---|---|---|---|\n| $10^2[\\ce{N2O5}]$ | 1.63 | 1.36 | 1.14 | 0.93 | 0.78 | 0.64 | 0.53 | 0.43 | 0.35 |\n\nFind: the half-life, the order/rate law, and the rate constant.',
      'First order; $k \\approx 4.6\\times10^{-4}$ s⁻¹; $t_{1/2} \\approx 1500$ s',
      'A plot of $\\log[\\ce{N2O5}]$ vs $t$ is a straight line $\\Rightarrow$ **first order**, so rate law $=$ $k[\\ce{N2O5}]$.\n\n$k = \\dfrac{2.303}{t}\\log\\dfrac{[\\ce{N2O5}]_0}{[\\ce{N2O5}]}$. At $t = 400$: $k = \\dfrac{2.303}{400}\\log\\dfrac{1.63}{1.36} = 4.53\\times10^{-4}$; at $t = 800$: $4.47\\times10^{-4}$; averaging the data $k \\approx 4.6\\times10^{-4}\\ \\text{s}^{-1}$.\n\n$t_{1/2} = \\dfrac{0.693}{k} \\approx \\dfrac{0.693}{4.6\\times10^{-4}} \\approx 1500\\ \\text{s}$ — consistent with the graph (the concentration halves from 1.63 to ≈0.81 at roughly this time).'),
    pnum('NCERT Exercise 4.17',
      'During a nuclear explosion one product is $\\ce{^{90}Sr}$ with half-life 28.1 years. If 1 μg of $\\ce{^{90}Sr}$ was absorbed in the bones of a newborn, how much remains after 10 years and after 60 years if it is not lost metabolically?',
      'After 10 y: ≈ 0.78 μg; after 60 y: ≈ 0.23 μg',
      '$k = \\dfrac{0.693}{28.1} = 0.02466\\ \\text{year}^{-1}$.\n\n**After 10 y:** $w = 1\\times e^{-0.02466\\times10} = e^{-0.2466} = 0.78\\ \\mu g$.\n\n**After 60 y:** $w = 1\\times e^{-0.02466\\times60} = e^{-1.48} = 0.23\\ \\mu g$.'),
    pnum('NCERT Exercise 4.20',
      'For the first-order decomposition of azoisopropane to hexane and nitrogen at 543 K, the pressure data are:\n\n| $t$/s | 0 | 360 | 720 |\n|---|---|---|---|\n| $P$/mm Hg | 35.0 | 54.0 | 63.0 |\n\nCalculate the rate constant.',
      '$k \\approx 2.2\\times10^{-3}$ s⁻¹',
      'For $\\text{(reactant)} \\to \\text{hexane} + \\ce{N2}$ (1 mol → 2 mol), if reactant pressure falls by $x$, total $P_t = P_0 + x$, so the reactant left $= P_0 - x = 2P_0 - P_t$.\n\n**At $t = 360$:** reactant $= 2(35) - 54 = 16$; $k = \\dfrac{2.303}{360}\\log\\dfrac{35}{16} = 2.18\\times10^{-3}$.\n\n**At $t = 720$:** reactant $= 70 - 63 = 7$; $k = \\dfrac{2.303}{720}\\log\\dfrac{35}{7} = 2.23\\times10^{-3}$.\n\n$k \\approx 2.2\\times10^{-3}\\ \\text{s}^{-1}$.'),
    pnum('NCERT Exercise 4.21',
      'The first-order thermal decomposition $\\ce{SO2Cl2(g) -> SO2(g) + Cl2(g)}$ at constant volume gives total pressure 0.5 atm at $t=0$ and 0.6 atm at $t=100$ s. Calculate the rate of the reaction when the total pressure is 0.65 atm.',
      'Rate $\\approx 7.8\\times10^{-4}$ atm s⁻¹',
      '1 mol → 2 mol, so reactant pressure left $= 2P_0 - P_t$.\n\n**Find $k$:** at $t = 100$, reactant $= 1.0 - 0.6 = 0.4$; $k = \\dfrac{2.303}{100}\\log\\dfrac{0.5}{0.4} = 2.23\\times10^{-3}\\ \\text{s}^{-1}$.\n\n**Rate at $P_t = 0.65$:** reactant $= 1.0 - 0.65 = 0.35$ atm; rate $= k\\,p_{\\ce{SO2Cl2}} = 2.23\\times10^{-3}\\times0.35 = 7.8\\times10^{-4}\\ \\text{atm s}^{-1}$.'),
  ]);

// ── Section E — Temperature, Arrhenius & Catalysis ──────────────────────────
const sectionE = psec('temperature-arrhenius-catalysis', 'E · Temperature, Arrhenius & Catalysis',
  'Activation energy, the Arrhenius equation, and the effect of temperature.',
  [
    pnum('NCERT Exercise 4.7',
      'What is the effect of temperature on the rate constant of a reaction? How can this temperature effect be represented quantitatively?',
      undefined,
      'The rate constant **increases** with temperature (roughly doubling for a 10 °C rise for many reactions). Quantitatively it is given by the **Arrhenius equation** $k = A\\,e^{-E_a/RT}$, and the comparison at two temperatures by $\\log\\dfrac{k_2}{k_1} = \\dfrac{E_a}{2.303R}\\left[\\dfrac{1}{T_1} - \\dfrac{1}{T_2}\\right]$.'),
    pnum('NCERT Exercise 4.22',
      'The rate constant for the decomposition of $\\ce{N2O5}$ at various temperatures is:\n\n| $T$/°C | 0 | 20 | 40 | 60 | 80 |\n|---|---|---|---|---|---|\n| $10^5\\,k$/s⁻¹ | 0.0787 | 1.70 | 25.7 | 178 | 2140 |\n\nDraw $\\ln k$ vs $1/T$ and find $A$ and $E_a$.',
      '$E_a \\approx 100$ kJ mol⁻¹',
      'A plot of $\\ln k$ vs $1/T$ is a straight line of slope $-E_a/R$ and intercept $\\ln A$.\n\nUsing the end points $T_1 = 273$ K ($k = 7.87\\times10^{-7}$) and $T_2 = 353$ K ($k = 2.14\\times10^{-2}$):\n\n$\\log\\dfrac{k_2}{k_1} = \\dfrac{E_a}{2.303R}\\left[\\dfrac{T_2-T_1}{T_1 T_2}\\right] \\Rightarrow 4.43 = \\dfrac{E_a}{19.15}\\times8.30\\times10^{-4}$.\n\n$E_a \\approx 1.02\\times10^{5}\\ \\text{J} \\approx 100\\ \\text{kJ mol}^{-1}$; $A$ is read from the intercept ($\\ln A$). The rate constants at 30 °C and 50 °C are then read off the fitted line.'),
    pnum('NCERT Exercise 4.23',
      'The rate constant for the decomposition of hydrocarbons is $2.418\\times10^{-5}\\ \\text{s}^{-1}$ at 546 K. If the activation energy is 179.9 kJ/mol, what is the value of the pre-exponential factor?',
      '$A \\approx 3.9\\times10^{12}$ s⁻¹',
      '$A = k\\,e^{E_a/RT}$ where $\\dfrac{E_a}{RT} = \\dfrac{179900}{8.314\\times546} = 39.63$.\n\n$A = 2.418\\times10^{-5}\\times e^{39.63} \\approx 2.418\\times10^{-5}\\times1.6\\times10^{17} \\approx 3.9\\times10^{12}\\ \\text{s}^{-1}$.'),
    pnum('NCERT Exercise 4.26',
      'The decomposition of a hydrocarbon follows $k = (4.5\\times10^{11}\\ \\text{s}^{-1})\\,e^{-28000\\,\\text{K}/T}$. Calculate $E_a$.',
      '$E_a \\approx 232.8$ kJ mol⁻¹',
      'Comparing with $k = A\\,e^{-E_a/RT}$: $\\dfrac{E_a}{R} = 28000\\ \\text{K}$.\n\n$E_a = 28000\\times8.314 = 232792\\ \\text{J} \\approx 232.8\\ \\text{kJ mol}^{-1}$.'),
    pnum('NCERT Exercise 4.27',
      'The rate constant for the first-order decomposition of $\\ce{H2O2}$ is given by $\\log k = 14.34 - \\dfrac{1.25\\times10^4\\,\\text{K}}{T}$. Calculate $E_a$, and the temperature at which the half-life is 256 minutes.',
      '$E_a \\approx 239.3$ kJ mol⁻¹; $T \\approx 669$ K',
      'Comparing with $\\log k = \\log A - \\dfrac{E_a}{2.303RT}$: $\\dfrac{E_a}{2.303R} = 1.25\\times10^{4}$.\n\n$E_a = 1.25\\times10^{4}\\times2.303\\times8.314 = 239340\\ \\text{J} \\approx 239.3\\ \\text{kJ mol}^{-1}$.\n\nFor $t_{1/2} = 256\\ \\text{min} = 15360\\ \\text{s}$: $k = \\dfrac{0.693}{15360} = 4.51\\times10^{-5}\\ \\text{s}^{-1}$, so $\\log k = -4.345$.\n\n$-4.345 = 14.34 - \\dfrac{1.25\\times10^4}{T} \\Rightarrow \\dfrac{1.25\\times10^4}{T} = 18.69 \\Rightarrow T \\approx 669\\ \\text{K}$.'),
    pnum('NCERT Exercise 4.28',
      'The decomposition of A into product has $k = 4.5\\times10^{3}\\ \\text{s}^{-1}$ at 10 °C and an activation energy of 60 kJ mol⁻¹. At what temperature would $k = 1.5\\times10^{4}\\ \\text{s}^{-1}$?',
      '$T \\approx 297$ K (≈ 24 °C)',
      '$\\log\\dfrac{k_2}{k_1} = \\dfrac{E_a}{2.303R}\\left[\\dfrac{1}{T_1} - \\dfrac{1}{T_2}\\right]$ with $T_1 = 283$ K.\n\n$\\log\\dfrac{1.5\\times10^4}{4.5\\times10^3} = \\log 3.33 = 0.523 = \\dfrac{60000}{19.147}\\left[\\dfrac{1}{283} - \\dfrac{1}{T_2}\\right]$.\n\n$\\dfrac{1}{283} - \\dfrac{1}{T_2} = 1.67\\times10^{-4} \\Rightarrow \\dfrac{1}{T_2} = 3.367\\times10^{-3} \\Rightarrow T_2 \\approx 297\\ \\text{K}$.'),
    pnum('NCERT Exercise 4.29',
      'The time required for 10% completion of a first-order reaction at 298 K is equal to that required for its 25% completion at 308 K. If $A = 4\\times10^{10}\\ \\text{s}^{-1}$, calculate $k$ at 318 K and $E_a$.',
      '$E_a \\approx 76.6$ kJ mol⁻¹; $k_{318} \\approx 1.0\\times10^{-2}$ s⁻¹',
      'Equal times: $\\dfrac{2.303}{k_{298}}\\log\\dfrac{100}{90} = \\dfrac{2.303}{k_{308}}\\log\\dfrac{100}{75}$, so $\\dfrac{k_{308}}{k_{298}} = \\dfrac{0.1249}{0.0458} = 2.73$.\n\n$\\log 2.73 = 0.436 = \\dfrac{E_a}{19.147}\\left[\\dfrac{1}{298} - \\dfrac{1}{308}\\right]$, giving $E_a \\approx 76.6\\ \\text{kJ mol}^{-1}$.\n\nThen $k_{318} = A\\,e^{-E_a/RT} = 4\\times10^{10}\\times e^{-76600/(8.314\\times318)} \\approx 1.0\\times10^{-2}\\ \\text{s}^{-1}$.'),
    pnum('NCERT Exercise 4.30',
      'The rate of a reaction quadruples when the temperature changes from 293 K to 313 K. Calculate the activation energy, assuming it does not change with temperature.',
      '$E_a \\approx 52.9$ kJ mol⁻¹',
      '$\\dfrac{k_2}{k_1} = 4$, so $\\log 4 = 0.602 = \\dfrac{E_a}{2.303R}\\left[\\dfrac{1}{293} - \\dfrac{1}{313}\\right] = \\dfrac{E_a}{19.147}\\times2.181\\times10^{-4}$.\n\n$E_a = \\dfrac{0.602\\times19.147}{2.181\\times10^{-4}} = 52852\\ \\text{J} \\approx 52.9\\ \\text{kJ mol}^{-1}$.'),
    pnum('NCERT Intext 4.7',
      'What is the effect of temperature on the rate constant of a reaction?',
      undefined,
      'The rate constant increases markedly with temperature — for many reactions it nearly doubles for every 10 °C rise. The dependence follows the Arrhenius equation $k = A\\,e^{-E_a/RT}$: a higher $T$ shrinks the magnitude of the negative exponent, so a larger fraction of collisions clears the activation barrier and $k$ rises.'),
    pnum('NCERT Intext 4.8',
      'The rate of a chemical reaction doubles for an increase of 10 K in absolute temperature from 298 K. Calculate $E_a$.',
      '$E_a \\approx 52.9$ kJ mol⁻¹',
      '$\\dfrac{k_2}{k_1} = 2$ for $T_1 = 298$ K, $T_2 = 308$ K.\n\n$\\log 2 = 0.301 = \\dfrac{E_a}{2.303R}\\left[\\dfrac{1}{298} - \\dfrac{1}{308}\\right] = \\dfrac{E_a}{19.147}\\times1.0895\\times10^{-4}$.\n\n$E_a = \\dfrac{0.301\\times19.147}{1.0895\\times10^{-4}} \\approx 52900\\ \\text{J} \\approx 52.9\\ \\text{kJ mol}^{-1}$.\n\n**Note:** some printed answer keys give 26.43 kJ/mol — that is half the correct value (a factor-of-2 slip); the calculation above gives ≈ 52.9 kJ/mol.'),
    pnum('NCERT Intext 4.9',
      'The activation energy for $\\ce{2HI(g) -> H2(g) + I2(g)}$ is 209.5 kJ mol⁻¹ at 581 K. Calculate the fraction of molecules of reactants having energy equal to or greater than the activation energy.',
      'Fraction $\\approx 1.46\\times10^{-19}$',
      'The required fraction is $e^{-E_a/RT}$.\n\n$\\dfrac{E_a}{RT} = \\dfrac{209500}{8.314\\times581} = 43.37$.\n\nFraction $= e^{-43.37} = 1.46\\times10^{-19}$.'),
  ]);

// Append the NCERT Exemplar items after the NCERT-exercise items within each section.
sectionA.items.push(...exemplar.A);
sectionB.items.push(...exemplar.B);
sectionC.items.push(...exemplar.C);
sectionD.items.push(...exemplar.D);
sectionE.items.push(...exemplar.E);

const pages = [
  page(38, 'chemical-kinetics-practice',
    'Chemical Kinetics — NCERT Practice',
    'Every NCERT exercise, intext question and NCERT Exemplar problem from the chapter, sorted into five sections you can navigate. Try each, then tap to reveal the worked solution.',
    ['chemical-kinetics', 'practice', 'ncert', 'exemplar', 'exercises', 'revision'],
    [
      B.hero(
        'A neat grid of NCERT problem cards organised into five labelled columns, each column a different topic of the chapter, with a magnifier suggesting worked solutions',
        'Ultra-wide cinematic banner (16:5 ratio). A neat grid of problem cards organised into five labelled vertical columns, each a different shade, suggesting five topic sections of a practice bank; a faint magnifier hovers over one card hinting at a worked solution beneath. Clean, organised, studious. Deep near-black background, orange accents, clean cinematic technical style. No text.'
      ),
      B.text(
        'This is the full NCERT question set for the chapter — all 30 end-of-chapter Exercises, all 9 Intext Questions, and all 66 NCERT Exemplar problems — solved and sorted into five sections. Pick a section, work each problem, then reveal the step-by-step solution. Every answer has been independently checked; where a printed NCERT or Exemplar answer looked off, the corrected value is used and flagged.'
      ),
      B.bank('NCERT & Exemplar Practice — Chemical Kinetics',
        'Navigate the five sections; each problem reveals a full worked solution.',
        [sectionA, sectionB, sectionC, sectionD, sectionE]),
    ]
  ),
];

buildPages(pages)
  .then(() => { console.log('\npractice bank done.'); process.exit(0); })
  .catch((e) => { console.error(e); process.exit(1); });
