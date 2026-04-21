/**
 * Insert creative Physical Chemistry flashcards tailored for
 * JEE / NEET / BITSAT revision. Each card tests reasoning or
 * calculation, not mere recall.
 *
 * Usage:
 *   node scripts/insert_physical_additions.js           # dry run
 *   node scripts/insert_physical_additions.js --apply   # write to DB
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');
const START_ID = 390; // next FLASH-PHY-XXXX after consolidation

const CH = {
  solutions:       { id: 'ch12_solutions',       name: 'Solutions',         category: 'Physical Chemistry' },
  electro:         { id: 'ch12_electrochemistry',name: 'Electrochemistry',  category: 'Physical Chemistry' },
  kinetics:        { id: 'ch12_kinetics',        name: 'Chemical Kinetics', category: 'Physical Chemistry' },
  atom:            { id: 'ch11_atom',            name: 'Atomic Structure',  category: 'Physical Chemistry' },
  surface:         { id: 'ch12_surface',         name: 'Surface Chemistry', category: 'Physical Chemistry' },
  solid:           { id: 'ch12_solid_state',     name: 'Solid State',       category: 'Physical Chemistry' },
};

// ─── Cards (each: {chap, topicName, topicOrder, q, a, difficulty?, tags?}) ──
const CARDS = [

  // ══════════════ SOLUTIONS (10) ══════════════
  { chap: 'solutions', topicName: 'Raoult\'s Law', topicOrder: 4, difficulty: 'hard',
    q: 'A solution of $ \\ce{CHCl3} $ and acetone shows a *negative* deviation from Raoult\'s law. What intermolecular interaction causes this and how does $ \\Delta H_{mix} $ compare to zero?',
    a: 'Hydrogen bonding between $ \\ce{Cl3C-H} $ and the $ \\ce{C=O} $ of acetone creates new A–B interactions *stronger* than A–A or B–B. Hence $ \\Delta H_{mix} < 0 $ and $ \\Delta V_{mix} < 0 $; a *maximum-boiling* azeotrope forms.' },

  { chap: 'solutions', topicName: 'Raoult\'s Law', topicOrder: 4, difficulty: 'hard',
    q: 'Which pair shows the largest *positive* deviation from Raoult\'s law: (i) ethanol + acetone, (ii) $ \\ce{CHCl3} $ + acetone, (iii) $ \\ce{n-hexane} $ + ethanol, (iv) water + $ \\ce{HNO3} $? Give the structural reason.',
    a: '(iii) $ \\ce{n-hexane} $ + ethanol. Ethanol\'s H-bond network is broken by the non-polar hexane but no new A–B interaction compensates, so $ \\Delta H_{mix} > 0 $ and the vapour pressure rises above the ideal line. A minimum-boiling azeotrope (~78.2 °C) forms.' },

  { chap: 'solutions', topicName: 'Van\'t Hoff Factor & Abnormal Masses', topicOrder: 8, difficulty: 'hard',
    q: '$ 0.1\\,m $ $ \\ce{K4[Fe(CN)6]} $ solution shows an observed depression in freezing point of $ 0.80\\,\\text{K} $. Taking $ K_f = 1.86\\,\\text{K kg mol}^{-1} $ for water, find the degree of dissociation $ \\alpha $.',
    a: 'Observed $ i = \\Delta T_f / (K_f \\cdot m) = 0.80 / (1.86 \\times 0.1) = 4.30 $. For $ \\ce{K4[Fe(CN)6] -> 4K+ + [Fe(CN)6]^{4-}} $, $ n = 5 $. $ \\alpha = (i-1)/(n-1) = 3.30/4 = 0.825 $, i.e. 82.5% dissociated.' },

  { chap: 'solutions', topicName: 'Osmosis & Osmotic Pressure', topicOrder: 7, difficulty: 'medium',
    q: 'Why is osmotic pressure preferred over other colligative properties for determining the molar mass of a *protein*?',
    a: 'Proteins have very high molar mass (>10 000 g/mol), giving extremely small $ \\Delta T_b $, $ \\Delta T_f $, and $ \\Delta P $ — within measurement error. Osmotic pressure, however, gives a measurable $ \\pi $ (mm of Hg) at low concentration and is measured at room temperature, avoiding thermal denaturation.' },

  { chap: 'solutions', topicName: 'Boiling Point Elevation & Freezing Point Depression', topicOrder: 6, difficulty: 'medium',
    q: 'Rank in decreasing order of freezing-point depression for equal molality: (a) glucose, (b) $ \\ce{KCl} $, (c) $ \\ce{K2SO4} $, (d) $ \\ce{Al2(SO4)3} $.',
    a: '$ \\ce{Al2(SO4)3} $ (i=5) > $ \\ce{K2SO4} $ (i=3) > $ \\ce{KCl} $ (i=2) > glucose (i=1). $ \\Delta T_f \\propto i $ at equal molality.' },

  { chap: 'solutions', topicName: 'Concentration Terms', topicOrder: 2, difficulty: 'medium',
    q: 'Concentrated $ \\ce{H2SO4} $ is $ 98\\% $ (w/w) with density $ 1.84\\,\\text{g mL}^{-1} $. What is its molarity?',
    a: '100 g solution has 98 g $ \\ce{H2SO4} $ ($ M = 98 $) = 1 mol and occupies $ 100/1.84 = 54.35\\,\\text{mL} $. $ \\text{Molarity} = 1 / 0.05435 = 18.4\\,\\text{M} $.' },

  { chap: 'solutions', topicName: 'Henry\'s Law', topicOrder: 5, difficulty: 'medium',
    q: 'Why do deep-sea divers use a helium-oxygen mixture instead of nitrogen-oxygen (air) for breathing at depth?',
    a: 'At high pressure, $ \\ce{N2} $ dissolves in blood (Henry\'s law: $ p = K_H x $) and releases violently on ascent → nitrogen narcosis / the bends. Helium has a *much higher* $ K_H $ (lower solubility), so little gas dissolves, preventing embolism on decompression.' },

  { chap: 'solutions', topicName: 'Vapour Pressure', topicOrder: 3, difficulty: 'hard',
    q: 'The vapour pressure of pure benzene is $ 100\\,\\text{mm Hg} $ at 25 °C. When $ 2\\,\\text{g} $ of a non-volatile solute is dissolved in $ 78\\,\\text{g} $ of benzene, the vapour pressure falls to $ 99\\,\\text{mm Hg} $. Calculate the solute\'s molar mass.',
    a: 'Moles of benzene = $ 78/78 = 1.0 $. Relative lowering $ = (100-99)/100 = 0.01 = n_{solute}/(n_{solute}+1) $. $ n_{solute} \\approx 0.01 $. Molar mass $ = 2 / 0.01 = 200\\,\\text{g mol}^{-1} $.' },

  { chap: 'solutions', topicName: 'Van\'t Hoff Factor & Abnormal Masses', topicOrder: 8, difficulty: 'hard',
    q: 'Benzoic acid in benzene gives an *abnormally high* molar mass by cryoscopy. Explain and give the van\'t Hoff factor.',
    a: 'Benzoic acid dimerises via H-bonding ($ \\ce{2PhCOOH <=> (PhCOOH)2} $) in non-polar benzene, halving the effective number of particles. $ i \\approx 0.5 $ (for complete dimerisation), so observed molar mass = $ M_{true}/i \\approx 2 \\times 122 = 244\\,\\text{g/mol} $.' },

  { chap: 'solutions', topicName: 'Classification of Solutions', topicOrder: 1, difficulty: 'easy',
    q: 'Distinguish between an *ideal* solution and an *azeotrope* in one sentence each, and state whether an azeotrope can be separated by fractional distillation.',
    a: 'An ideal solution obeys Raoult\'s law at all compositions ($ \\Delta H_{mix} = 0, \\Delta V_{mix} = 0 $). An azeotrope is a non-ideal mixture whose vapour has the same composition as the liquid — *cannot* be separated by simple fractional distillation.' },


  // ══════════════ ELECTROCHEMISTRY (10) ══════════════
  { chap: 'electro', topicName: 'Nernst Equation & Thermodynamics', topicOrder: 2, difficulty: 'hard',
    q: 'For a *concentration cell* $ \\ce{Cu | Cu^{2+}(0.01 M) || Cu^{2+}(0.1 M) | Cu} $ at 298 K, calculate the EMF.',
    a: '$ E_{cell} = -\\frac{0.0591}{n}\\log\\frac{[\\text{anode}]}{[\\text{cathode}]} = -\\frac{0.0591}{2}\\log\\frac{0.01}{0.10} = +0.0296\\,\\text{V} $. Concentration cells have $ E^{\\circ}_{cell}=0 $; EMF arises solely from the concentration gradient.' },

  { chap: 'electro', topicName: 'Nernst Equation & Thermodynamics', topicOrder: 2, difficulty: 'hard',
    q: 'Given $ E^{\\circ}_{\\ce{Zn^{2+}/Zn}} = -0.76\\,\\text{V} $ and $ E^{\\circ}_{\\ce{Cu^{2+}/Cu}} = +0.34\\,\\text{V} $, find $ \\Delta G^{\\circ} $ and $ K_{eq} $ for the Daniell cell at 298 K.',
    a: '$ E^{\\circ}_{cell} = 0.34-(-0.76) = 1.10\\,\\text{V} $. $ \\Delta G^{\\circ} = -nFE^{\\circ} = -2 \\times 96500 \\times 1.10 = -2.12 \\times 10^{5}\\,\\text{J/mol} $. $ \\log K = nE^{\\circ}/0.0591 = 37.2 $, so $ K \\approx 1.6 \\times 10^{37} $ — reaction goes essentially to completion.' },

  { chap: 'electro', topicName: 'Conductance & Molar Conductivity', topicOrder: 3, difficulty: 'medium',
    q: 'Using Kohlrausch\'s law, calculate $ \\Lambda^{\\circ}_m $ of $ \\ce{CH3COOH} $ from: $ \\Lambda^{\\circ}(\\ce{HCl}) = 426 $, $ \\Lambda^{\\circ}(\\ce{CH3COONa}) = 91 $, $ \\Lambda^{\\circ}(\\ce{NaCl}) = 126 $ (S cm² mol⁻¹).',
    a: '$ \\Lambda^{\\circ}(\\ce{CH3COOH}) = \\Lambda^{\\circ}(\\ce{HCl}) + \\Lambda^{\\circ}(\\ce{CH3COONa}) - \\Lambda^{\\circ}(\\ce{NaCl}) = 426 + 91 - 126 = 391\\,\\text{S cm}^2\\,\\text{mol}^{-1} $.' },

  { chap: 'electro', topicName: 'Conductance & Molar Conductivity', topicOrder: 3, difficulty: 'hard',
    q: 'Why does the molar conductivity of a *strong* electrolyte decrease slightly on dilution, while that of a *weak* electrolyte increases sharply?',
    a: 'Strong electrolyte: already fully dissociated; dilution only reduces inter-ionic attractions (Debye-Hückel-Onsager) → slight rise in mobility. Weak electrolyte: degree of dissociation $ \\alpha $ rises rapidly with dilution (Ostwald), and $ \\Lambda_m = \\alpha \\Lambda^{\\circ}_m $, so $ \\Lambda_m $ increases sharply near infinite dilution.' },

  { chap: 'electro', topicName: 'Electrolysis & Faraday\'s Laws', topicOrder: 4, difficulty: 'medium',
    q: 'A current of $ 5\\,\\text{A} $ is passed for $ 30\\,\\text{min} $ through molten $ \\ce{AlCl3} $. Calculate the mass of Al deposited. ($ M_{Al}=27 $)',
    a: '$ Q = 5 \\times 1800 = 9000\\,\\text{C} $. For $ \\ce{Al^{3+} + 3e- -> Al} $, equivalent weight $ = 27/3 = 9 $. Mass $ = (9 \\times 9000)/96500 = 0.839\\,\\text{g} $.' },

  { chap: 'electro', topicName: 'Galvanic Cells & Electrode Potentials', topicOrder: 1, difficulty: 'medium',
    q: 'Why is the SHE (Standard Hydrogen Electrode) difficult to maintain experimentally, and what is its replacement as a reference?',
    a: 'SHE requires (i) 1 atm pure $ \\ce{H2} $, (ii) $ 1\\,\\text{M}\\,\\ce{H+} $, (iii) inert Pt catalyst that is easily poisoned. In practice, the *calomel electrode* ($ \\ce{Hg|Hg2Cl2|KCl} $) is used — compact, stable, and its potential (+0.2412 V vs SHE for saturated KCl) is well tabulated.' },

  { chap: 'electro', topicName: 'Batteries & Fuel Cells', topicOrder: 5, difficulty: 'medium',
    q: 'In a lead-acid battery, what is the *specific gravity* of the electrolyte used to indicate state of charge, and why does it fall on discharge?',
    a: 'Fully charged SG ≈ 1.28 (38% $ \\ce{H2SO4} $). On discharge, $ \\ce{Pb + PbO2 + 2H2SO4 -> 2PbSO4 + 2H2O} $ consumes $ \\ce{H2SO4} $ and produces water, *diluting* the electrolyte; SG falls to ~1.10 when flat.' },

  { chap: 'electro', topicName: 'Corrosion & Prevention', topicOrder: 6, difficulty: 'medium',
    q: 'Why does galvanised iron (Zn-coated) resist corrosion even after the coating is scratched, while tin-plated iron corrodes faster once scratched?',
    a: 'Zn ($ E^{\\circ} = -0.76 $) is *more* easily oxidised than Fe ($ -0.44 $), so Zn acts as a *sacrificial anode* — it corrodes in place of the iron even through a scratch. Sn ($ +0.14 $) is *less* easily oxidised than Fe, so once scratched Fe becomes the anode and rusts *faster* than bare iron would (galvanic cell accelerates it).' },

  { chap: 'electro', topicName: 'Batteries & Fuel Cells', topicOrder: 5, difficulty: 'hard',
    q: 'Why is a hydrogen-oxygen fuel cell considered a \'pollution-free\' energy source, and what is its theoretical maximum efficiency compared with a heat engine?',
    a: 'Product is only $ \\ce{H2O} $. Efficiency $ = \\Delta G / \\Delta H $ (electrochemical) ≈ 83% for $ \\ce{H2/O2} $ at 298 K — not limited by Carnot ($ \\eta = 1 - T_c/T_h $, typically <40% for heat engines).' },

  { chap: 'electro', topicName: 'Galvanic Cells & Electrode Potentials', topicOrder: 1, difficulty: 'hard',
    q: 'For which of the following will $ E^{\\circ} $ be most positive: (a) $ \\ce{F2/F-} $, (b) $ \\ce{Li+/Li} $, (c) $ \\ce{Au^{3+}/Au} $, (d) $ \\ce{MnO4-/Mn^{2+}} $? Give the strongest oxidising and strongest reducing species from this list.',
    a: '$ \\ce{F2/F-} $ has $ E^{\\circ} = +2.87\\,\\text{V} $ — most positive → strongest oxidising agent: $ \\ce{F2} $. $ \\ce{Li+/Li} $ has $ E^{\\circ} = -3.04\\,\\text{V} $ — most negative → strongest reducing agent: Li.' },


  // ══════════════ KINETICS (10) ══════════════
  { chap: 'kinetics', topicName: 'First Order Kinetics', topicOrder: 5, difficulty: 'medium',
    q: 'A first-order reaction is 25% complete in 40 minutes. Calculate its *half-life*.',
    a: '$ k = \\frac{2.303}{40}\\log\\frac{100}{75} = \\frac{2.303}{40}\\times 0.125 = 7.19 \\times 10^{-3}\\,\\text{min}^{-1} $. $ t_{1/2} = 0.693/k = 96.4\\,\\text{min} $.' },

  { chap: 'kinetics', topicName: 'Arrhenius Equation & Activation Energy', topicOrder: 7, difficulty: 'hard',
    q: 'Rate of a reaction doubles when temperature rises from $ 300\\,\\text{K} $ to $ 310\\,\\text{K} $. Find the activation energy $ E_a $ (use $ R = 8.314 $).',
    a: '$ \\log\\frac{k_2}{k_1} = \\frac{E_a}{2.303 R}\\left[\\frac{T_2-T_1}{T_1 T_2}\\right] $. $ \\log 2 = \\frac{E_a}{2.303 \\times 8.314} \\times \\frac{10}{300 \\times 310} $. $ E_a = 53.6\\,\\text{kJ mol}^{-1} $.' },

  { chap: 'kinetics', topicName: 'Zero Order Kinetics', topicOrder: 4, difficulty: 'medium',
    q: 'Why is the decomposition of $ \\ce{NH3} $ on a hot platinum surface *zero-order* above a certain pressure?',
    a: 'At high $ p(\\ce{NH3}) $, the Pt surface is *saturated* with adsorbed $ \\ce{NH3} $; further increase in pressure does not change the surface coverage. Rate depends only on the number of active sites, which is constant → rate = $ k $, independent of $ [\\ce{NH3}] $.' },

  { chap: 'kinetics', topicName: 'Rate Law & Order of Reaction', topicOrder: 2, difficulty: 'hard',
    q: 'For $ \\ce{A + B -> C} $, doubling $ [A] $ doubles the rate, and tripling $ [B] $ makes the rate 9× larger. Write the rate law and state the overall order.',
    a: 'Order in A: $ 2 = 2^x \\Rightarrow x=1 $. Order in B: $ 9 = 3^y \\Rightarrow y=2 $. Rate $ = k[A][B]^2 $; overall order = 3.' },

  { chap: 'kinetics', topicName: 'Collision Theory & Molecularity', topicOrder: 6, difficulty: 'medium',
    q: 'Explain why the observed rate constant is much smaller than the collision frequency $ Z $ even when all collisions have $ E \\geq E_a $.',
    a: 'Not every energetically sufficient collision leads to products — molecules must also be correctly *oriented*. The **steric factor** $ P $ (<1) corrects for this: $ k = P \\cdot Z \\cdot e^{-E_a/RT} $. For complex molecules, $ P $ can be as small as $ 10^{-5} $.' },

  { chap: 'kinetics', topicName: 'Factors Influencing Rate', topicOrder: 3, difficulty: 'medium',
    q: 'A reaction has $ E_a = 100\\,\\text{kJ/mol} $ without a catalyst and $ 75\\,\\text{kJ/mol} $ with one, at 300 K. By what factor does the catalyst increase the rate?',
    a: '$ \\frac{k_{cat}}{k_{uncat}} = e^{(E_a - E_a\')/RT} = e^{25000/(8.314 \\times 300)} = e^{10.02} \\approx 2.24 \\times 10^{4} $. Rate ~22 400× faster.' },

  { chap: 'kinetics', topicName: 'First Order Kinetics', topicOrder: 5, difficulty: 'medium',
    q: 'Why is the hydrolysis of ethyl acetate in excess water called a *pseudo*-first-order reaction, even though its true molecularity is 2?',
    a: '$ \\ce{CH3COOC2H5 + H2O ->[H+] CH3COOH + C2H5OH} $. Water is in vast excess; $ [\\ce{H2O}] $ stays essentially constant, so it gets absorbed into $ k $: rate $ = k\'[\\text{ester}] $ where $ k\' = k[\\ce{H2O}] $. Apparent order 1, true molecularity 2.' },

  { chap: 'kinetics', topicName: 'Rate of Chemical Reaction', topicOrder: 1, difficulty: 'hard',
    q: 'For $ \\ce{2N2O5 -> 4NO2 + O2} $, the rate of disappearance of $ \\ce{N2O5} $ is $ 2.5 \\times 10^{-4}\\,\\text{mol L}^{-1}\\,\\text{s}^{-1} $. Give the rate of appearance of $ \\ce{NO2} $ and $ \\ce{O2} $.',
    a: 'Rate $ = -\\frac{1}{2}\\frac{d[\\ce{N2O5}]}{dt} = \\frac{1}{4}\\frac{d[\\ce{NO2}]}{dt} = \\frac{d[\\ce{O2}]}{dt} $. $ d[\\ce{NO2}]/dt = 2 \\times 2.5 \\times 10^{-4} = 5.0 \\times 10^{-4} $. $ d[\\ce{O2}]/dt = 0.5 \\times 2.5 \\times 10^{-4} = 1.25 \\times 10^{-4}\\,\\text{mol L}^{-1}\\,\\text{s}^{-1} $.' },

  { chap: 'kinetics', topicName: 'Arrhenius Equation & Activation Energy', topicOrder: 7, difficulty: 'hard',
    q: 'On an Arrhenius plot of $ \\ln k $ vs $ 1/T $, what do the slope and y-intercept represent?',
    a: '$ \\ln k = \\ln A - E_a/RT $. **Slope** $ = -E_a/R $ (negative → positive $ E_a $). **Y-intercept** $ = \\ln A $, where $ A $ is the pre-exponential (frequency) factor. A steeper negative slope means a larger activation energy.' },

  { chap: 'kinetics', topicName: 'First Order Kinetics', topicOrder: 5, difficulty: 'medium',
    q: 'Carbon-14 has a half-life of 5730 years. A wooden artifact shows 25% of the $ \\ce{^14C} $ activity of a freshly cut tree. How old is the artifact?',
    a: '25% means 2 half-lives have elapsed: $ \\ce{100\\% -> 50\\% -> 25\\%} $. Age $ = 2 \\times 5730 = 11\\,460 $ years. Formal check: $ t = (2.303/k)\\log(100/25) = (5730/0.693)\\log 4 = 11460\\,\\text{yr} $.' },


  // ══════════════ ATOMIC STRUCTURE (10) ══════════════
  { chap: 'atom', topicName: 'Quantum Numbers & Orbital Shapes', topicOrder: 5, difficulty: 'hard',
    q: 'For a $ 4f $ orbital, give the number of (i) radial nodes, (ii) angular nodes, (iii) total nodes.',
    a: '$ n=4, l=3 $. Radial nodes $ = n - l - 1 = 4 - 3 - 1 = 0 $. Angular nodes $ = l = 3 $. Total nodes $ = n - 1 = 3 $. (4f orbitals have *no* radial nodes — a signature feature.)' },

  { chap: 'atom', topicName: 'Electronic Configuration & Spectral Effects', topicOrder: 6, difficulty: 'hard',
    q: 'Using Slater\'s rules, calculate the effective nuclear charge $ Z_{eff} $ experienced by a $ 3d $ electron in $ \\ce{Fe} $ ($ Z = 26 $, config $ [Ar]3d^6 4s^2 $).',
    a: 'For a $ 3d $ electron: (i) other 3d electrons shield by 0.35 each (5 others) $ = 1.75 $. (ii) 4s electrons shield by 0 (higher shell). (iii) electrons in $ n-1 $ and inner: 18 electrons $ \\times $ 1.00 $ = 18 $. $ S = 1.75 + 18 = 19.75 $. $ Z_{eff} = 26 - 19.75 = 6.25 $.' },

  { chap: 'atom', topicName: 'Bohr\'s Model & Hydrogen Spectrum', topicOrder: 3, difficulty: 'hard',
    q: 'The first line of the Balmer series of H appears at $ 656.3\\,\\text{nm} $. Predict (without Rydberg constant) the wavelength of the first Lyman line.',
    a: 'Balmer-1: $ n=3 \\to 2 $, $ 1/\\lambda_B = R(1/4 - 1/9) = 5R/36 $. Lyman-1: $ n=2 \\to 1 $, $ 1/\\lambda_L = R(1 - 1/4) = 3R/4 $. $ \\lambda_L/\\lambda_B = (5R/36)/(3R/4) = 5/27 $. $ \\lambda_L = 656.3 \\times 5/27 = 121.5\\,\\text{nm} $ — in the UV, matches known value.' },

  { chap: 'atom', topicName: 'Dual Nature, Uncertainty & QM Model', topicOrder: 4, difficulty: 'hard',
    q: 'Calculate the de Broglie wavelength of an electron accelerated through $ 100\\,\\text{V} $. ($ m_e = 9.1 \\times 10^{-31}\\,\\text{kg}, h = 6.626 \\times 10^{-34}\\,\\text{J s} $)',
    a: '$ eV = \\tfrac{1}{2}mv^2 \\Rightarrow v = \\sqrt{2eV/m} = 5.93 \\times 10^{6}\\,\\text{m/s} $. $ \\lambda = h/mv = 6.626 \\times 10^{-34} / (9.1 \\times 10^{-31} \\times 5.93 \\times 10^{6}) = 1.23\\,\\text{Å} $. Quick form: $ \\lambda(\\text{Å}) = \\sqrt{150/V} = \\sqrt{1.5} = 1.23\\,\\text{Å} $.' },

  { chap: 'atom', topicName: 'Dual Nature, Uncertainty & QM Model', topicOrder: 4, difficulty: 'hard',
    q: 'An electron\'s position is known to within $ 0.1\\,\\text{Å} $. What is the minimum uncertainty in its velocity?',
    a: '$ \\Delta x \\cdot \\Delta p \\geq h/(4\\pi) $. $ \\Delta v \\geq h/(4\\pi m \\Delta x) = 6.626 \\times 10^{-34} / (4\\pi \\times 9.1 \\times 10^{-31} \\times 10^{-11}) = 5.8 \\times 10^{6}\\,\\text{m/s} $ — comparable to orbital speeds, proving electrons cannot have classical trajectories inside atoms.' },

  { chap: 'atom', topicName: 'EM Radiation & Photoelectric Effect', topicOrder: 1, difficulty: 'hard',
    q: 'Light of wavelength $ 300\\,\\text{nm} $ ejects electrons from a metal with work function $ \\phi = 2.0\\,\\text{eV} $. Find the maximum KE of the photoelectrons.',
    a: 'Photon energy $ = hc/\\lambda = 1240/300 = 4.13\\,\\text{eV} $. $ KE_{max} = h\\nu - \\phi = 4.13 - 2.0 = 2.13\\,\\text{eV} $. Stopping potential $ V_0 = 2.13\\,\\text{V} $.' },

  { chap: 'atom', topicName: 'Bohr\'s Model & Hydrogen Spectrum', topicOrder: 3, difficulty: 'medium',
    q: 'For a hydrogen-like species ($ \\ce{He+}, Z=2 $) in the ground state, find the radius and energy. Compare with H.',
    a: '$ r_n = 0.529 n^2/Z\\,\\text{Å} $. For $ \\ce{He+} $ ($ n=1, Z=2 $): $ r = 0.2645\\,\\text{Å} $ — half of H\'s $ a_0 $. $ E_n = -13.6 Z^2/n^2\\,\\text{eV} = -54.4\\,\\text{eV} $ — four times deeper than H. Higher $ Z $ → smaller, more tightly bound orbit.' },

  { chap: 'atom', topicName: 'Electronic Configuration & Spectral Effects', topicOrder: 6, difficulty: 'medium',
    q: 'Why is the configuration of $ \\ce{Cr} $ written as $ [Ar]3d^5 4s^1 $ rather than $ [Ar]3d^4 4s^2 $, and of $ \\ce{Cu} $ as $ [Ar]3d^{10} 4s^1 $ rather than $ [Ar]3d^9 4s^2 $?',
    a: 'Half-filled ($ d^5 $) and fully-filled ($ d^{10} $) sets have extra stability from (i) symmetrical electron distribution and (ii) maximum *exchange energy* — more parallel-spin pairs can exchange, lowering energy more than the tiny $ 4s $-$ 3d $ gap. The anomaly disappears for other 3d elements.' },

  { chap: 'atom', topicName: 'Quantum Numbers & Orbital Shapes', topicOrder: 5, difficulty: 'medium',
    q: 'State the set of quantum numbers disallowed by the Pauli exclusion principle for two electrons in the same atom, with an example.',
    a: 'No two electrons can share all four identical quantum numbers $ (n, l, m_l, m_s) $. Example: both electrons $ (1, 0, 0, +\\tfrac{1}{2}) $ — forbidden. Two 1s electrons must differ in $ m_s $: one $ +\\tfrac{1}{2} $, one $ -\\tfrac{1}{2} $.' },

  { chap: 'atom', topicName: 'EM Radiation & Photoelectric Effect', topicOrder: 1, difficulty: 'medium',
    q: 'Why does increasing the *intensity* of light above the threshold frequency raise the *number* of photoelectrons but not their *kinetic energy*?',
    a: 'One photon ejects one electron. Intensity = photons per second, so more photons → more electrons. But each individual photon\'s energy is $ h\\nu $ — fixed by frequency, not intensity. $ KE_{max} = h\\nu - \\phi $ depends only on $ \\nu $, disproving the classical wave picture.' },


  // ══════════════ SURFACE CHEMISTRY (10) ══════════════
  { chap: 'surface', topicName: 'Adsorption & Thermodynamics', topicOrder: 1, difficulty: 'medium',
    q: 'Adsorption is always exothermic. Use $ \\Delta G = \\Delta H - T\\Delta S $ to justify this without citing the enthalpy sign directly.',
    a: 'Adsorption *decreases* the randomness of the adsorbate (3D gas → 2D film), so $ \\Delta S < 0 $. For spontaneous adsorption, $ \\Delta G < 0 $. Since $ -T\\Delta S > 0 $, $ \\Delta H $ *must* be negative (and larger in magnitude than $ T\\Delta S $) → exothermic.' },

  { chap: 'surface', topicName: 'Adsorption Isotherms', topicOrder: 2, difficulty: 'hard',
    q: 'Write the Freundlich isotherm and explain how the value of $ 1/n $ indicates whether adsorption is favourable.',
    a: '$ x/m = k P^{1/n} $. $ 1/n = 0 $ → constant loading (saturation). $ 1/n = 1 $ → linear (Henry\'s region, low $ P $). $ 0 < 1/n < 1 $ → favourable, log-log plot gives slope $ 1/n $. Real gases on charcoal typically give $ 1/n \\approx 0.1$–$0.5 $.' },

  { chap: 'surface', topicName: 'Catalysis', topicOrder: 3, difficulty: 'medium',
    q: 'According to the adsorption theory of heterogeneous catalysis, why does a *moderately* active surface bond work best — too-weak or too-strong binding both fail?',
    a: 'Too *weak*: reactants rarely adsorb → low rate. Too *strong*: surface becomes blocked (poisoned) and products cannot desorb. Optimum is intermediate, giving the volcano curve of activity vs adsorption enthalpy (Sabatier principle). E.g. Pt, Pd, Ni lie near the peak for $ \\ce{H2} $ activation.' },

  { chap: 'surface', topicName: 'Catalysis', topicOrder: 3, difficulty: 'hard',
    q: 'Why is *shape-selectivity* of zeolites such as ZSM-5 considered a molecular form of catalysis, and give one industrial example.',
    a: 'Zeolites have pore diameters (~5 Å) comparable to molecular sizes. Only molecules that *fit* the pore can enter / leave → controls reactant, product, or transition-state geometry. Example: ZSM-5 converts methanol to gasoline (MTG process) preferentially to C₅–C₁₀ hydrocarbons.' },

  { chap: 'surface', topicName: 'Classification of Colloids', topicOrder: 4, difficulty: 'medium',
    q: 'Contrast lyophilic and lyophobic sols in terms of (i) preparation, (ii) stability, (iii) reversibility.',
    a: '**Lyophilic** (starch, gelatin): form spontaneously; stable due to solvation shell; reversible — can be reconstituted. **Lyophobic** ($ \\ce{As2S3} $, $ \\ce{Fe(OH)3} $ sols): need special methods (Bredig\'s arc, peptization); stable only due to surface charge; irreversible — once coagulated cannot re-form by adding solvent.' },

  { chap: 'surface', topicName: 'Properties of Colloids', topicOrder: 6, difficulty: 'medium',
    q: 'The *zeta potential* of a colloid becomes very small (<25 mV in magnitude). What happens to the sol and why?',
    a: 'The electrical double-layer repulsion falls below van der Waals attraction → particles collide and aggregate → *coagulation / flocculation*. Adding electrolyte compresses the double layer and lowers zeta potential (Schulze-Hardy rule) — the basis of alum treatment of muddy water.' },

  { chap: 'surface', topicName: 'Coagulation & Emulsions', topicOrder: 7, difficulty: 'hard',
    q: 'Arrange $ \\ce{NaCl, BaCl2, AlCl3, [Fe(CN)6]^{4-}} $ (as ions) by increasing coagulating power for a *positive* $ \\ce{Fe(OH)3} $ sol. Which rule governs this?',
    a: '**Hardy-Schulze rule**: higher charge of the *oppositely* charged ion → greater coagulating power. For a positive sol, coagulation depends on the anion charge: $ \\ce{Cl-} < \\ce{SO4^{2-}} < \\ce{[Fe(CN)6]^{4-}} $. Among the given, charges of anions: $ \\ce{Cl-} (-1) $ in first three, $ \\ce{[Fe(CN)6]^{4-}} (-4) $. So $ \\ce{NaCl} \\approx \\ce{BaCl2} \\approx \\ce{AlCl3} < \\ce{K4[Fe(CN)6]} $ (hexacyanoferrate ~1000× more potent).' },

  { chap: 'surface', topicName: 'Preparation & Purification of Colloids', topicOrder: 5, difficulty: 'medium',
    q: 'What is *peptization* and give one example of converting a freshly precipitated $ \\ce{Fe(OH)3} $ into a stable sol by this method.',
    a: 'Peptization: dispersing a freshly prepared precipitate into colloidal form by adding a small amount of an electrolyte containing a common ion ($ \\ce{FeCl3} $ here). The $ \\ce{Fe^{3+}} $ ions adsorb on the precipitate, give it a positive surface charge, and the mutual repulsion breaks the aggregate into colloidal $ \\ce{Fe(OH)3} $ sol.' },

  { chap: 'surface', topicName: 'Properties of Colloids', topicOrder: 6, difficulty: 'medium',
    q: 'A $ \\ce{As2S3} $ sol is *negatively* charged. Which electrolyte will have the *lowest* coagulation value (most potent): $ \\ce{AlCl3}, \\ce{MgCl2}, $ or $ \\ce{NaCl} $?',
    a: 'The *cation* charge matters for a negative sol (Hardy-Schulze). $ \\ce{Al^{3+}} $ > $ \\ce{Mg^{2+}} $ > $ \\ce{Na+} $ in coagulating power → $ \\ce{AlCl3} $ has the lowest coagulation value (< 1 mmol/L) — highly potent.' },

  { chap: 'surface', topicName: 'Coagulation & Emulsions', topicOrder: 7, difficulty: 'medium',
    q: 'What is the role of soap in forming a stable oil-in-water emulsion (e.g. milk)?',
    a: 'Soap acts as an *emulsifier*. Hydrophobic tails embed in oil droplets; ionic heads face water and give each droplet a surface charge. Electrostatic repulsion + lower interfacial tension prevent droplets from merging. Without emulsifier the oil-water system separates into two phases within minutes.' },


  // ══════════════ SOLID STATE (10) ══════════════
  { chap: 'solid', topicName: 'Packing Efficiency, Voids & Calculations', topicOrder: 3, difficulty: 'hard',
    q: 'An element crystallises in a BCC lattice with $ a = 300\\,\\text{pm} $ and density $ 7.2\\,\\text{g cm}^{-3} $. Find its atomic mass. ($ N_A = 6.022 \\times 10^{23} $)',
    a: 'BCC $ Z = 2 $. $ \\rho = Z M / (N_A a^3) \\Rightarrow M = \\rho N_A a^3 / Z $. $ a^3 = (3 \\times 10^{-8})^3 = 2.7 \\times 10^{-23}\\,\\text{cm}^3 $. $ M = 7.2 \\times 6.022 \\times 10^{23} \\times 2.7 \\times 10^{-23} / 2 = 58.5\\,\\text{g mol}^{-1} $ (likely Ni).' },

  { chap: 'solid', topicName: 'Packing Efficiency, Voids & Calculations', topicOrder: 3, difficulty: 'hard',
    q: 'Compare the packing efficiency of FCC, BCC, and SC, and show why FCC = HCP.',
    a: 'SC: $ Z=1, r=a/2 $, PE $ = \\pi/6 = 52.4\\% $. BCC: $ Z=2 $, body diagonal $ = 4r = a\\sqrt{3} $, PE $ = \\pi\\sqrt{3}/8 = 68.0\\% $. FCC: $ Z=4 $, face diagonal $ = 4r = a\\sqrt{2} $, PE $ = \\pi/(3\\sqrt{2}) = 74.0\\% $. FCC and HCP both pack via ABCABC… / ABAB… stackings of close-packed layers; same local geometry → same PE = 74%.' },

  { chap: 'solid', topicName: 'Point Defects in Crystals', topicOrder: 4, difficulty: 'medium',
    q: 'How do *Schottky* and *Frenkel* defects differ in their effect on the density of the crystal?',
    a: '**Schottky**: paired cation + anion vacancies → fewer atoms in same volume → **density decreases** (e.g. $ \\ce{NaCl} $, $ \\ce{KCl} $). **Frenkel**: ion displaced to an interstitial site → same number of atoms → **density unchanged** (e.g. $ \\ce{AgCl} $, $ \\ce{ZnS} $).' },

  { chap: 'solid', topicName: 'Electrical Properties & Semiconductors', topicOrder: 5, difficulty: 'medium',
    q: 'In terms of band theory, why does Si conduct *better* at 500 K than at 300 K, whereas Cu does the opposite?',
    a: 'Si is an intrinsic semiconductor: band gap $ \\sim 1.1\\,\\text{eV} $. Higher $ T $ promotes more electrons from valence → conduction band; $ \\sigma $ rises (~exponential in $ 1/T $). Cu is a metal (bands overlap): thermal excitation does not add carriers but *increases phonon scattering* → resistance rises with $ T $.' },

  { chap: 'solid', topicName: 'Electrical Properties & Semiconductors', topicOrder: 5, difficulty: 'medium',
    q: 'To make a p-type semiconductor from pure Si, which group of dopant is used and why?',
    a: 'Group 13 (e.g. B, Ga, In). Each dopant has 3 valence electrons — one *short* of Si\'s 4 — creating a positively charged *hole* in the valence band. Conduction occurs by holes moving opposite to the electric field. n-type uses group 15 (P, As) which contribute an extra electron.' },

  { chap: 'solid', topicName: 'Magnetic Properties', topicOrder: 6, difficulty: 'hard',
    q: 'Distinguish *ferromagnetic*, *antiferromagnetic*, and *ferrimagnetic* behaviour in terms of domain alignment, and give one solid example of each.',
    a: '**Ferro** (e.g. Fe, $ \\ce{CrO2} $): all domains parallel → strong net moment. **Antiferro** (e.g. $ \\ce{MnO} $): adjacent spins antiparallel, equal magnitudes → *zero* net moment. **Ferri** (e.g. $ \\ce{Fe3O4} $, magnetite): antiparallel but *unequal* magnitudes → small net moment. Above Curie/Néel $ T $ all become paramagnetic.' },

  { chap: 'solid', topicName: 'Classification & Types of Crystals', topicOrder: 1, difficulty: 'medium',
    q: 'Diamond and graphite are both carbon allotropes with similar composition but radically different properties. Account for the differences in hardness and electrical conductivity.',
    a: 'Diamond: each C is $ sp^3 $, bonded to 4 others in a rigid 3-D tetrahedral network — no free electrons → extremely hard, electrical insulator. Graphite: each C is $ sp^2 $, forms layered hexagonal sheets with a delocalised $ \\pi $-electron cloud → slippery (layers slide) and a good in-plane conductor.' },

  { chap: 'solid', topicName: 'Packing Efficiency, Voids & Calculations', topicOrder: 3, difficulty: 'hard',
    q: 'In a close-packed arrangement of N spheres, how many tetrahedral and octahedral voids exist, and why do ionic solids like $ \\ce{NaCl} $ fill only the octahedral holes?',
    a: '$ 2N $ tetrahedral + $ N $ octahedral voids per $ N $ spheres. For $ \\ce{NaCl} $, radius ratio $ r_{\\ce{Na+}}/r_{\\ce{Cl-}} = 0.52 $ — falls in the octahedral range (0.414–0.732), so $ \\ce{Na+} $ occupies octahedral holes formed by $ \\ce{Cl-} $. Tetrahedral holes (ratio 0.225–0.414) are too small.' },

  { chap: 'solid', topicName: 'Unit Cells & Lattices', topicOrder: 2, difficulty: 'medium',
    q: 'How many atoms are there per unit cell in (i) simple cubic, (ii) body-centred cubic, (iii) face-centred cubic? Show the corner/edge/face/interior contributions.',
    a: 'SC: $ 8 \\times \\tfrac{1}{8} = 1 $. BCC: $ 8 \\times \\tfrac{1}{8} + 1 $ (body) $ = 2 $. FCC: $ 8 \\times \\tfrac{1}{8} + 6 \\times \\tfrac{1}{2} = 4 $. Corners contribute $ 1/8 $, face centres $ 1/2 $, edge $ 1/4 $, interior $ 1 $.' },

  { chap: 'solid', topicName: 'Point Defects in Crystals', topicOrder: 4, difficulty: 'hard',
    q: 'Why does pure $ \\ce{NaCl} $ heated in $ \\ce{Na} $ vapour acquire a yellow colour, and what is this defect called?',
    a: '**F-centre** (*Farbenzentrum*): $ \\ce{Na} $ atoms deposit on the surface, lose an electron to give $ \\ce{Na+} $, and the displaced $ \\ce{Cl-} $ anion vacancy is filled by the *free electron*. This trapped electron absorbs visible light (yellow/green for NaCl), producing colour. This is a metal-excess (non-stoichiometric) defect.' },

];

// ─── Insert ──────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  // Confirm no clashes
  const newIdStart = START_ID;
  const newIdEnd   = START_ID + CARDS.length - 1;
  const existing = await coll.findOne({
    flashcard_id: { $in: Array.from({length: CARDS.length},
      (_, i) => `FLASH-PHY-${String(newIdStart + i).padStart(4,'0')}`) }
  });
  if (existing) throw new Error(`Collision with existing ID: ${existing.flashcard_id}`);

  const now = new Date();
  const docs = CARDS.map((c, i) => {
    const chap = CH[c.chap];
    const flashcard_id = `FLASH-PHY-${String(newIdStart + i).padStart(4,'0')}`;
    return {
      _id: uuidv4(),
      flashcard_id,
      chapter: { id: chap.id, name: chap.name, category: chap.category },
      topic:   { name: c.topicName, order: c.topicOrder },
      question: c.q,
      answer:   c.a,
      metadata: {
        difficulty: c.difficulty || 'medium',
        tags: c.tags || [c.topicName, chap.name],
        source: 'Canvas Chemistry',
        class_num: c.chap === 'atom' ? 11 : 12,
        created_at: now,
        updated_at: now,
      },
      deleted_at: null,
    };
  });

  // Summary
  const byChap = {};
  docs.forEach(d => { byChap[d.chapter.id] = (byChap[d.chapter.id] || 0) + 1; });
  console.log(`Prepared ${docs.length} new cards (FLASH-PHY-${String(newIdStart).padStart(4,'0')}–FLASH-PHY-${String(newIdEnd).padStart(4,'0')})`);
  for (const [id, n] of Object.entries(byChap)) console.log(`  · ${id}: ${n}`);

  if (APPLY) {
    const res = await coll.insertMany(docs, { ordered: false });
    console.log(`\n✅ Inserted ${res.insertedCount} cards.`);
  } else {
    console.log('\n(dry run — pass --apply to insert)');
    // Log a few sample questions for sanity
    console.log('\n── Sample cards ──');
    [0, 10, 20, 30, 40, 50].forEach(i => {
      if (docs[i]) console.log(`[${docs[i].flashcard_id}] ${docs[i].topic.name}\n  Q: ${docs[i].question.slice(0,120)}…`);
    });
  }

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
