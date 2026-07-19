// Class 11 Chemistry — Live Book Ch.7 "Ionic Equilibrium" — "Practice — NCERT Exercises" page.
// Covers ONLY NCERT Unit 6 "Equilibrium" exercises 6.35–6.73 (the ionic-equilibrium half of the
// unit — Bronsted-Lowry/Lewis acids & bases, pH, Ka/Kb, buffers, hydrolysis, solubility product).
// Exercises 6.1–6.34 (gas-phase equilibrium) belong to Live Book Ch.6 and are authored separately.
// Built by hand per scripts/chem11-book/_practice/CONTRACT.md — standalone module, NOT inserted
// into any database by this file.

module.exports = {
  slug: 'ch7-practice-ncert-exercises',
  title: 'Practice — NCERT Exercises',
  subtitle:
    'All 39 NCERT textbook exercises for the chapter, grouped into 5 revision themes with full worked solutions.',
  page_type: 'lesson',
  tags: ['ncert-exercises', 'practice'],
  blocks: [
    {
      id: '3687e7f2-2b09-4ab6-a5ea-cc46bdcc1cda',
      type: 'image',
      order: 0,
      src: '',
      alt: 'Practice — Ionic Equilibrium: every NCERT exercise, by theme.',
      caption: '',
      width: 'full',
      aspect_ratio: '16:5',
      generation_prompt:
        'A hand-drawn coloured illustration on a deep-charcoal (#121316) near-black background, muted earthy palette ' +
        '(ochre, terracotta, teal, sage green, indigo, cream), no glow / neon / orange-haze / 3D-render look. A study-desk ' +
        '"revision board" scene for ionic equilibrium: a row of test tubes and small beakers holding coloured liquids being ' +
        'tested with strips of litmus paper (one pink, one blue), a simple hand-drawn pH meter dial with a needle pointing to ' +
        'a number on a 0–14 scale, a small sketched pair of hands passing a single dot labelled "H+" between two molecule ' +
        'shapes (a Bronsted-Lowry proton-transfer motif), a labelled buffer flask with a plus/minus balance icon beside it, ' +
        'and one test tube with a cloudy precipitate settling at the bottom with a downward arrow. Neat handwritten ' +
        'chalk-style labels only where needed. Warm, textbook-illustration feel, landscape orientation.',
    },
    {
      id: '65b851d8-d87d-47c2-83d2-4fcef15acc96',
      type: 'text',
      order: 1,
      markdown:
        'You\'ve read the chapter — now drill it. Below are all **39 NCERT textbook exercises (6.35–6.73)** ' +
        'for ionic equilibrium, regrouped from the textbook\'s running order into **5 revision themes**: acid-base theory, ' +
        'pH of strong acids and bases, ionization constants of weak acids and bases, the common-ion effect with salt ' +
        'hydrolysis, and solubility product. Work through a theme at a time — tap any question to reveal the full worked ' +
        'solution, not just the final number.',
    },
    {
      id: '881925b2-9398-4428-94a1-6b850a65980d',
      type: 'practice_bank',
      order: 2,
      title: 'NCERT Exercises 6.35–6.73',
      intro:
        'Every ionic-equilibrium exercise from NCERT Unit 6, grouped by theme rather than by question number. ' +
        'Sections S3 and S2 carry the most questions because ionization constants and pH calculations are where most ' +
        'marks — and most mistakes — live.',
      sections: [
        {
          id: 's1-acid-base-theory',
          title: 'Brønsted-Lowry & Lewis acid-base theory',
          blurb: 'Conjugate acid-base pairs and classifying species as Brønsted or Lewis acids/bases — no calculator needed here, just the definitions.',
          items: [
            {
              kind: 'numerical',
              id: '4eea047a-cf3c-4ab1-be34-96e8d5e96419',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.35',
              prompt:
                'What is meant by the conjugate acid-base pair? Find the conjugate acid/base for the following species:\nHNO2, CN-, HClO4, F-, OH-, CO3^2-, and S2-',
              answer: 'NO2⁻, HCN, ClO4⁻, HF, H2O, HCO3⁻, HS⁻',
              solution:
                'A **conjugate acid-base pair** is a Brønsted-Lowry acid and the base left behind once it has donated one proton (H⁺), or a base and the acid formed once it has accepted one proton. The two members of a pair differ by exactly one H⁺.\n\n' +
                'For each species, ask: is it acting as an acid (does it have an H to give away) or a base (does it have a lone pair to accept an H⁺)?\n\n' +
                '- $\\ce{HNO2}$ is an acid → loses H⁺ → conjugate base $\\ce{NO2^-}$\n' +
                '- $\\ce{CN^-}$ is a base → gains H⁺ → conjugate acid $\\ce{HCN}$\n' +
                '- $\\ce{HClO4}$ is an acid → loses H⁺ → conjugate base $\\ce{ClO4^-}$\n' +
                '- $\\ce{F^-}$ is a base → gains H⁺ → conjugate acid $\\ce{HF}$\n' +
                '- $\\ce{OH^-}$ is a base → gains H⁺ → conjugate acid $\\ce{H2O}$\n' +
                '- $\\ce{CO3^{2-}}$ is a base → gains H⁺ → conjugate acid $\\ce{HCO3^-}$\n' +
                '- $\\ce{S^{2-}}$ is a base → gains H⁺ → conjugate acid $\\ce{HS^-}$',
            },
            {
              kind: 'numerical',
              id: '31474328-edd5-4cd6-87ce-7549d10308d3',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.36',
              prompt: 'Which of the followings are Lewis acids? H2O, BF3, H+, and NH4+',
              answer: 'BF3, H+ and NH4+ are Lewis acids',
              solution:
                'A **Lewis acid** is an electron-pair acceptor — it needs somewhere to put an incoming pair of electrons, either because it has an empty orbital or because it can generate one.\n\n' +
                '- $\\ce{H2O}$: oxygen carries two lone pairs it can donate — this makes water a Lewis **base**, not an acid.\n' +
                '- $\\ce{BF3}$: boron has only 6 electrons around it (an incomplete octet), so it has a genuinely empty orbital ready to accept a pair — a classic Lewis acid.\n' +
                '- $\\ce{H+}$: a bare proton with no electrons of its own — it will accept any available electron pair — Lewis acid.\n' +
                '- $\\ce{NH4+}$: as a Brønsted acid it can donate the H⁺ shown above, and that departing H⁺ is itself a Lewis acid — so $\\ce{NH4+}$ is classed as a Lewis acid too.\n\n' +
                'So $\\ce{BF3}$, $\\ce{H+}$ and $\\ce{NH4+}$ are the Lewis acids; $\\ce{H2O}$ is the Lewis base in this set.',
            },
            {
              kind: 'numerical',
              id: '572651bb-91b4-4be2-b5b4-df51fc4104b2',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.37',
              prompt: 'What will be the conjugate bases for the Brönsted acids: HF, H2SO4 and HCO3-?',
              answer: 'F⁻, HSO4⁻, CO3²⁻',
              solution:
                'Remove one H⁺ from each acid to get its conjugate base:\n\n' +
                '- $\\ce{HF}$ loses H⁺ → $\\ce{F^-}$\n' +
                '- $\\ce{H2SO4}$ loses one H⁺ (it has two, but the conjugate base after donating one) → $\\ce{HSO4^-}$\n' +
                '- $\\ce{HCO3^-}$ loses H⁺ → $\\ce{CO3^{2-}}$',
            },
            {
              kind: 'numerical',
              id: '62b3c1b0-f5ec-4bc6-8889-9ba788a4b6d7',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.38',
              prompt: 'Write the conjugate acids for the following Brönsted bases: NH2-, NH3 and HCOO-.',
              answer: 'NH3, NH4⁺, HCOOH',
              solution:
                'Add one H⁺ to each base to get its conjugate acid:\n\n' +
                '- $\\ce{NH2^-}$ gains H⁺ → $\\ce{NH3}$\n' +
                '- $\\ce{NH3}$ gains H⁺ → $\\ce{NH4^+}$\n' +
                '- $\\ce{HCOO^-}$ gains H⁺ → $\\ce{HCOOH}$',
            },
            {
              kind: 'numerical',
              id: '8f3aa041-99a6-4bee-9498-927bfa96d1ab',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.39',
              prompt:
                'The species: H2O, HCO3-, HSO4- and NH3 can act both as Brönsted acids and bases. For each case give the corresponding conjugate acid and base.',
              answer: 'Each species has one conjugate acid (gain H⁺) and one conjugate base (lose H⁺) — see solution table.',
              solution:
                'A species that can act as both acid and base (an **amphiprotic** species) has two conjugates: donate an H⁺ to get its conjugate base, accept an H⁺ to get its conjugate acid.\n\n' +
                '| Species | Acts as acid → conjugate base | Acts as base → conjugate acid |\n' +
                '|---|---|---|\n' +
                '| $\\ce{H2O}$ | $\\ce{OH^-}$ | $\\ce{H3O+}$ |\n' +
                '| $\\ce{HCO3^-}$ | $\\ce{CO3^{2-}}$ | $\\ce{H2CO3}$ |\n' +
                '| $\\ce{HSO4^-}$ | $\\ce{SO4^{2-}}$ | $\\ce{H2SO4}$ |\n' +
                '| $\\ce{NH3}$ | $\\ce{NH2^-}$ | $\\ce{NH4+}$ |\n\n' +
                'This dual behaviour is exactly why $\\ce{H2O}$ and $\\ce{HCO3^-}$ show up again and again as buffer components — each can neutralise a small addition of either acid or base.',
            },
            {
              kind: 'numerical',
              id: '80323e15-7f7c-427c-9881-1cca92ba7978',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.40',
              prompt: 'Classify the following species into Lewis acids and Lewis bases and show how these act as Lewis acid/base: (a) OH- (b) F- (c) H+ (d) BCl3.',
              answer: 'OH⁻ and F⁻ are Lewis bases; H⁺ and BCl3 are Lewis acids.',
              solution:
                'Sort by whether the species has electrons to give (base) or a gap to fill (acid):\n\n' +
                '(a) $\\ce{OH^-}$ — oxygen carries lone pairs it can donate → **Lewis base**.\n\n' +
                '(b) $\\ce{F^-}$ — carries three lone pairs it can donate → **Lewis base**.\n\n' +
                '(c) $\\ce{H+}$ — a bare proton with an empty 1s orbital, ready to accept a lone pair → **Lewis acid**.\n\n' +
                '(d) $\\ce{BCl3}$ — boron has only 6 electrons in its valence shell (an incomplete octet), leaving an empty p-orbital that readily accepts an incoming lone pair (this is exactly why $\\ce{BCl3}$ reacts so eagerly with $\\ce{NH3}$) → **Lewis acid**.',
            },
          ],
        },
        {
          id: 's2-ph-strong-acids-bases',
          title: 'pH calculations, strong acids/bases & the ionic product of water',
          blurb: 'Converting between [H+], [OH-] and pH — for strong electrolytes, natural fluids, mixtures, and water\'s own equilibrium at different temperatures.',
          items: [
            {
              kind: 'numerical',
              id: '3304aaec-692e-4e06-966e-3b6330849e02',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.41',
              prompt: 'The concentration of hydrogen ion in a sample of soft drink is 3.8 × 10^-3 M. What is its pH?',
              answer: 'pH = 2.42',
              solution:
                '$\\text{pH} = -\\log[\\ce{H+}]$\n\n' +
                'Substitute $[\\ce{H+}] = 3.8 \\times 10^{-3}$ M:\n\n' +
                '$\\text{pH} = -\\log(3.8 \\times 10^{-3}) = -[\\log 3.8 + \\log 10^{-3}] = -[0.58 - 3] = 2.42$\n\n' +
                'A pH of 2.42 is quite acidic — typical for a carbonated soft drink, which is why fizzy drinks taste sharp.',
            },
            {
              kind: 'numerical',
              id: 'a8125795-7c74-4d8c-b91c-acbfee31a943',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.42',
              prompt: 'The pH of a sample of vinegar is 3.76. Calculate the concentration of hydrogen ion in it.',
              answer: '[H+] ≈ 1.7 × 10⁻⁴ M',
              solution:
                'Reverse the pH definition: $[\\ce{H+}] = 10^{-\\text{pH}}$.\n\n' +
                '$[\\ce{H+}] = 10^{-3.76} = 10^{0.24} \\times 10^{-4} = 1.74 \\times 10^{-4}\\ \\text{M} \\approx 1.7 \\times 10^{-4}\\ \\text{M}$\n\n' +
                'Vinegar (dilute acetic acid) sitting at pH 3.76 gives a hydrogen-ion concentration a good deal smaller than a strong acid of the same molarity would — a reminder that acetic acid is only weakly ionised.',
            },
            {
              kind: 'numerical',
              id: '5a0672ba-54c7-4c56-85c8-2a8bb0947d97',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.48',
              prompt: 'Assuming complete dissociation, calculate the pH of the following solutions: (a) 0.003 M HCl (b) 0.005 M NaOH (c) 0.002 M HBr (d) 0.002 M KOH',
              answer: 'a) 2.52  b) 11.70  c) 2.70  d) 11.30',
              solution:
                'All four are strong electrolytes — "complete dissociation" means the molarity of the acid/base equals $[\\ce{H+}]$ or $[\\ce{OH^-}]$ directly.\n\n' +
                '**(a) 0.003 M HCl:** $[\\ce{H+}] = 3 \\times 10^{-3}$ M\n' +
                '$\\text{pH} = -\\log(3\\times10^{-3}) = -(0.48-3) = 2.52$\n\n' +
                '**(b) 0.005 M NaOH:** $[\\ce{OH^-}] = 5\\times10^{-3}$ M\n' +
                '$\\text{pOH} = -\\log(5\\times10^{-3}) = -(0.70-3) = 2.30$, so $\\text{pH} = 14 - 2.30 = 11.70$\n\n' +
                '**(c) 0.002 M HBr:** $[\\ce{H+}] = 2\\times10^{-3}$ M\n' +
                '$\\text{pH} = -\\log(2\\times10^{-3}) = -(0.30-3) = 2.70$\n\n' +
                '**(d) 0.002 M KOH:** $[\\ce{OH^-}] = 2\\times10^{-3}$ M\n' +
                '$\\text{pOH} = -\\log(2\\times10^{-3}) = 2.70$, so $\\text{pH} = 14 - 2.70 = 11.30$',
            },
            {
              kind: 'numerical',
              id: 'c2a9ce49-1ffc-427c-98d8-dd49896623ca',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.49',
              prompt:
                'Calculate the pH of the following solutions:\na) 2 g of TlOH dissolved in water to give 2 litre of solution.\nb) 0.3 g of Ca(OH)2 dissolved in water to give 500 mL of solution.\nc) 0.3 g of NaOH dissolved in water to give 200 mL of solution.\nd) 1mL of 13.6 M HCl is diluted with water to give 1 litre of solution.',
              answer: 'a) 11.65  b) 12.21  c) 12.57  d) 1.87',
              solution:
                'Same skeleton throughout: mass → moles → molarity → $[\\ce{OH^-}]$ or $[\\ce{H+}]$ → pH.\n\n' +
                '**(a) TlOH** (molar mass $= 204 + 16 + 1 = 221$ g/mol), a strong monoacidic base:\n' +
                'moles $= 2/221 = 9.05\\times10^{-3}$ mol; $[\\ce{OH^-}] = 9.05\\times10^{-3}/2 = 4.52\\times10^{-3}$ M\n' +
                '$\\text{pOH} = -\\log(4.52\\times10^{-3}) = 2.35 \\Rightarrow \\text{pH} = 14-2.35 = 11.65$\n\n' +
                '**(b) Ca(OH)₂** (molar mass $= 40+2(17)=74$ g/mol), two $\\ce{OH^-}$ per formula unit:\n' +
                'moles $= 0.3/74 = 4.05\\times10^{-3}$ mol; conc. $= 4.05\\times10^{-3}/0.5 = 8.11\\times10^{-3}$ M\n' +
                '$[\\ce{OH^-}] = 2 \\times 8.11\\times10^{-3} = 1.62\\times10^{-2}$ M\n' +
                '$\\text{pOH} = -\\log(1.62\\times10^{-2}) = 1.79 \\Rightarrow \\text{pH} = 14-1.79 = 12.21$\n\n' +
                '**(c) NaOH** (molar mass $= 40$ g/mol):\n' +
                'moles $= 0.3/40 = 7.5\\times10^{-3}$ mol; $[\\ce{OH^-}] = 7.5\\times10^{-3}/0.2 = 3.75\\times10^{-2}$ M\n' +
                '$\\text{pOH} = -\\log(3.75\\times10^{-2}) = 1.43 \\Rightarrow \\text{pH} = 14-1.43 = 12.57$\n\n' +
                '**(d) Diluted HCl:** moles $= 13.6 \\times 0.001\\ \\text{L} = 0.0136$ mol, now in 1 L, so $[\\ce{H+}] = 0.0136$ M\n' +
                '$\\text{pH} = -\\log(0.0136) = -( -1.87) = 1.87$',
            },
            {
              kind: 'numerical',
              id: '01ef94dd-f647-4d06-ad60-010e3c512659',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.55',
              prompt:
                'Calculate the hydrogen ion concentration in the following biological fluids whose pH are given below:\n(a) Human muscle-fluid, 6.83 (b) Human stomach fluid, 1.2\n(c) Human blood, 7.38 (d) Human saliva, 6.4.',
              answer: 'a) 1.48×10⁻⁷ M  b) 6.31×10⁻² M  c) 4.17×10⁻⁸ M  d) 3.98×10⁻⁷ M',
              solution:
                'In every case, $[\\ce{H+}] = 10^{-\\text{pH}}$.\n\n' +
                '(a) pH 6.83: $10^{-6.83} = 10^{0.17}\\times10^{-7} = 1.48\\times10^{-7}$ M\n\n' +
                '(b) pH 1.2: $10^{-1.2} = 10^{0.8}\\times10^{-2} = 6.31\\times10^{-2}$ M — stomach acid is genuinely strongly acidic, which is exactly why it can digest food.\n\n' +
                '(c) pH 7.38: $10^{-7.38} = 10^{0.62}\\times10^{-8} = 4.17\\times10^{-8}$ M — blood sits just on the alkaline side of neutral, tightly buffered.\n\n' +
                '(d) pH 6.4: $10^{-6.4} = 10^{0.6}\\times10^{-7} = 3.98\\times10^{-7}$ M',
            },
            {
              kind: 'numerical',
              id: 'b5516ec3-3610-467f-86d3-856e674fc7de',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.56',
              prompt:
                'The pH of milk, black coffee, tomato juice, lemon juice and egg white are 6.8, 5.0, 4.2, 2.2 and 7.8 respectively. Calculate corresponding hydrogen ion concentration in each.',
              answer: 'Milk 1.6×10⁻⁷ M, coffee 1.0×10⁻⁵ M, tomato juice 6.31×10⁻⁵ M, lemon juice 6.31×10⁻³ M, egg white 1.6×10⁻⁸ M',
              solution:
                'Same conversion, $[\\ce{H+}]=10^{-\\text{pH}}$, for each fluid:\n\n' +
                '- Milk (pH 6.8): $10^{-6.8} = 1.58\\times10^{-7}\\ \\text{M} \\approx 1.6\\times10^{-7}$ M\n' +
                '- Black coffee (pH 5.0): $10^{-5.0} = 1.0\\times10^{-5}$ M — a clean power of ten since the pH is a whole number.\n' +
                '- Tomato juice (pH 4.2): $10^{-4.2} = 10^{0.8}\\times10^{-5} = 6.31\\times10^{-5}$ M\n' +
                '- Lemon juice (pH 2.2): $10^{-2.2} = 10^{0.8}\\times10^{-3} = 6.31\\times10^{-3}$ M — the most acidic of the set, matching how sharp lemon juice tastes.\n' +
                '- Egg white (pH 7.8): $10^{-7.8} = 10^{0.2}\\times10^{-8} = 1.58\\times10^{-8}\\ \\text{M} \\approx 1.6\\times10^{-8}$ M — the only one on the alkaline side of neutral.',
            },
            {
              kind: 'numerical',
              id: 'a1a9084f-17ab-445c-bb8a-b3725b98e277',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.57',
              prompt: 'If 0.561 g of KOH is dissolved in water to give 200 mL of solution at 298 K. Calculate the concentrations of potassium, hydrogen and hydroxyl ions. What is its pH?',
              answer: '[K+] = [OH-] = 0.05 M, [H+] = 2.0 × 10⁻¹³ M, pH = 12.70',
              solution:
                'Molar mass of $\\ce{KOH} = 39 + 16 + 1 = 56.1$ g/mol.\n\n' +
                'Moles $= 0.561/56.1 = 0.0100$ mol. Molarity $= 0.0100/0.200\\ \\text{L} = 0.05$ M.\n\n' +
                'KOH is a strong base, fully dissociated: $[\\ce{K+}] = [\\ce{OH^-}] = 0.05$ M.\n\n' +
                'Use $K_w = [\\ce{H+}][\\ce{OH^-}] = 1.0\\times10^{-14}$ at 298 K:\n' +
                '$[\\ce{H+}] = \\dfrac{1.0\\times10^{-14}}{0.05} = 2.0\\times10^{-13}$ M\n\n' +
                '$\\text{pH} = -\\log(2.0\\times10^{-13}) = 12.70$',
            },
            {
              kind: 'numerical',
              id: 'b3abb3e2-5cf1-4102-a50e-643b618a6474',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.58',
              prompt: 'The solubility of Sr(OH)2 at 298 K is 19.23 g/L of solution. Calculate the concentrations of strontium and hydroxyl ions and the pH of the solution.',
              answer: '[Sr2+] = 0.158 M, [OH-] = 0.316 M, pH = 13.50',
              solution:
                'Molar mass of $\\ce{Sr(OH)2} = 87.6 + 2(17) = 121.6$ g/mol.\n\n' +
                'Molarity $= 19.23/121.6 = 0.158$ M — this is the concentration of dissolved $\\ce{Sr(OH)2}$, all of it dissociating.\n\n' +
                '$[\\ce{Sr^{2+}}] = 0.158$ M and, since each formula unit releases two $\\ce{OH^-}$: $[\\ce{OH^-}] = 2 \\times 0.158 = 0.316$ M\n\n' +
                '$\\text{pOH} = -\\log(0.316) = 0.50 \\Rightarrow \\text{pH} = 14 - 0.50 = 13.50$',
            },
            {
              kind: 'numerical',
              id: '5d2f881d-52f4-4da1-9793-a550614adff9',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.65',
              prompt: 'Ionic product of water at 310K is 2.7 × 10^-14. What is the pH of neutral water at this temperature?',
              answer: 'pH = 6.78',
              solution:
                'In *neutral* water, $[\\ce{H+}] = [\\ce{OH^-}]$ always — that\'s the definition of neutral, regardless of temperature.\n\n' +
                '$K_w = [\\ce{H+}][\\ce{OH^-}] = [\\ce{H+}]^2 = 2.7\\times10^{-14}$\n\n' +
                '$[\\ce{H+}] = \\sqrt{2.7\\times10^{-14}} = 1.64\\times10^{-7}$ M\n\n' +
                '$\\text{pH} = -\\log(1.64\\times10^{-7}) = 6.78$\n\n' +
                'Notice: neutral water is *not* pH 7 once the temperature isn\'t 298 K, because $K_w$ itself grows with temperature (water\'s self-ionisation is endothermic). Neutral just means $\\text{pH}=\\text{pOH}$, not "pH = 7" specifically.',
            },
            {
              kind: 'numerical',
              id: '937ef355-5bfe-41d7-a514-92824d355a5f',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.66',
              prompt:
                'Calculate the pH of the resultant mixtures: a) 10 mL of 0.2M Ca(OH)2 + 25 mL of 0.1M HCl b) 10 mL of 0.01M H2SO4 + 10 mL of 0.01M Ca(OH)2 c) 10 mL of 0.1M H2SO4 + 10 mL of 0.1M KOH',
              answer: 'a) pH = 12.63  b) pH = 7.00  c) pH = 1.30',
              solution:
                'These are all acid-base neutralisations: find total moles of $\\ce{H+}$ and total moles of $\\ce{OH^-}$, see which is in excess, then divide by the *combined* final volume.\n\n' +
                '**(a)** $\\ce{Ca(OH)2}$ gives 2 $\\ce{OH^-}$ per mole: moles $\\ce{OH^-} = 0.2 \\times 2 \\times 0.010\\ \\text{L} = 4.0\\times10^{-3}$ mol.\n' +
                'moles $\\ce{H+} = 0.1 \\times 0.025\\ \\text{L} = 2.5\\times10^{-3}$ mol.\n' +
                'Excess $\\ce{OH^-} = 4.0\\times10^{-3} - 2.5\\times10^{-3} = 1.5\\times10^{-3}$ mol, total volume $= 35$ mL.\n' +
                '$[\\ce{OH^-}] = 1.5\\times10^{-3}/0.035 = 0.0429$ M $\\Rightarrow \\text{pOH} = 1.37 \\Rightarrow \\text{pH} = 12.63$\n\n' +
                '**(b)** $\\ce{H2SO4}$ is diprotic, $\\ce{Ca(OH)2}$ gives 2 $\\ce{OH^-}$ — so moles $\\ce{H+} = 0.01\\times2\\times0.010 = 2\\times10^{-4}$ mol exactly equals moles $\\ce{OH^-} = 0.01\\times2\\times0.010 = 2\\times10^{-4}$ mol.\n' +
                'Exact neutralisation, and the salt formed ($\\ce{CaSO4}$) is from a strong acid + strong base, so it doesn\'t hydrolyse. $\\text{pH} = 7.00$\n\n' +
                '**(c)** moles $\\ce{H+} = 0.1\\times2\\times0.010 = 2\\times10^{-3}$ mol (diprotic $\\ce{H2SO4}$); moles $\\ce{OH^-} = 0.1\\times0.010 = 1\\times10^{-3}$ mol (monoacidic KOH).\n' +
                'Excess $\\ce{H+} = 1\\times10^{-3}$ mol in a total volume of 20 mL.\n' +
                '$[\\ce{H+}] = 1\\times10^{-3}/0.020 = 0.05$ M $\\Rightarrow \\text{pH} = -\\log(0.05) = 1.30$',
            },
          ],
        },
        {
          id: 's3-ionization-constants',
          title: 'Ionization constants (Ka/Kb) & degree of ionization',
          blurb: 'The Ostwald-dilution-law engine of the chapter — computing Ka, Kb, α and pH for weak acids and bases from each other.',
          items: [
            {
              kind: 'numerical',
              id: 'd6a76739-7a55-4a74-a23c-56361d5f73a4',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.43',
              prompt: 'The ionization constant of HF, HCOOH and HCN at 298K are 6.8 × 10^-4, 1.8 × 10^-4 and 4.8 × 10^-9 respectively. Calculate the ionization constants of the corresponding conjugate base.',
              answer: 'Kb(F⁻) = 1.5×10⁻¹¹, Kb(HCOO⁻) = 5.6×10⁻¹¹, Kb(CN⁻) = 2.08×10⁻⁶',
              solution:
                'For any conjugate acid-base pair, $K_a \\times K_b = K_w = 1.0\\times10^{-14}$ (at 298 K). So $K_b = K_w/K_a$ for each conjugate base.\n\n' +
                '$K_b(\\ce{F^-}) = \\dfrac{1.0\\times10^{-14}}{6.8\\times10^{-4}} = 1.47\\times10^{-11} \\approx 1.5\\times10^{-11}$\n\n' +
                '$K_b(\\ce{HCOO^-}) = \\dfrac{1.0\\times10^{-14}}{1.8\\times10^{-4}} = 5.56\\times10^{-11} \\approx 5.6\\times10^{-11}$\n\n' +
                '$K_b(\\ce{CN^-}) = \\dfrac{1.0\\times10^{-14}}{4.8\\times10^{-9}} = 2.08\\times10^{-6}$\n\n' +
                'Notice the pattern: $\\ce{HCN}$ has the smallest $K_a$ (weakest acid), so $\\ce{CN^-}$ has by far the largest $K_b$ — the weaker the acid, the stronger its conjugate base. This is exactly why cyanide salts are noticeably basic in water.',
            },
            {
              kind: 'numerical',
              id: 'e4fc7bd0-0304-4750-9aef-23ae8d2541dc',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.44',
              prompt:
                'The ionization constant of phenol is 1.0 × 10^-10. What is the concentration of phenolate ion in 0.05 M solution of phenol? What will be its degree of ionization if the solution is also 0.01M in sodium phenolate?',
              answer: '[C6H5O⁻] = 2.2×10⁻⁶ M, α = 4.47×10⁻⁵; with 0.01M sodium phenolate, α = 1.0×10⁻⁸',
              solution:
                'Phenol ionizes as $\\ce{C6H5OH <=> C6H5O- + H+}$, $K_a = 1.0\\times10^{-10}$.\n\n' +
                '**Without common ion:** let $x = [\\ce{C6H5O^-}]$ at equilibrium.\n' +
                '$K_a = \\dfrac{x^2}{0.05} = 1.0\\times10^{-10} \\Rightarrow x^2 = 5.0\\times10^{-12} \\Rightarrow x = 2.24\\times10^{-6}$ M $\\approx 2.2\\times10^{-6}$ M\n\n' +
                'Degree of ionization $\\alpha = x/C = 2.24\\times10^{-6}/0.05 = 4.47\\times10^{-5}$\n\n' +
                '**With 0.01 M sodium phenolate added (common-ion effect):** sodium phenolate is fully ionized, so it already supplies $[\\ce{C6H5O^-}] \\approx 0.01$ M before phenol ionizes at all. Let $y$ = extra ionization from phenol itself.\n' +
                '$K_a = \\dfrac{(0.01+y)(y)}{0.05-y} \\approx \\dfrac{(0.01)(y)}{0.05} = 1.0\\times10^{-10}$\n\n' +
                '$y = \\dfrac{1.0\\times10^{-10}\\times0.05}{0.01} = 5.0\\times10^{-10}$ M\n\n' +
                '$\\alpha = y/C = \\dfrac{5.0\\times10^{-10}}{0.05} = 1.0\\times10^{-8}$\n\n' +
                'The common phenolate ion has pushed the equilibrium hard back to the left — the degree of ionization has dropped by roughly four powers of ten. That collapse is Le Chatelier\'s principle at work: adding a product ($\\ce{C6H5O^-}$) suppresses the forward ionization.',
            },
            {
              kind: 'numerical',
              id: 'e5e11317-7c48-42b9-b594-19df2e647273',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.45',
              prompt:
                'The first ionization constant of H2S is 9.1 × 10^-8. Calculate the concentration of HS- ion in its 0.1M solution. How will this concentration be affected if the solution is 0.1M in HCl also? If the second dissociation constant of H2S is 1.2 × 10^-13, calculate the concentration of S2- under both conditions.',
              answer: '[HS⁻] = 9.54×10⁻⁵ M (no HCl), 9.1×10⁻⁸ M (with 0.1M HCl); [S²⁻] = 1.2×10⁻¹³ M (no HCl), 1.09×10⁻¹⁹ M (with 0.1M HCl)',
              solution:
                'Two dissociation steps: $\\ce{H2S <=> H+ + HS-}$ ($K_{a1}=9.1\\times10^{-8}$) and $\\ce{HS- <=> H+ + S^{2-}}$ ($K_{a2}=1.2\\times10^{-13}$).\n\n' +
                '**Step 1, no HCl.** Let $x = [\\ce{HS^-}] = [\\ce{H+}]$ from this step alone.\n' +
                '$K_{a1} = \\dfrac{x^2}{0.1} = 9.1\\times10^{-8} \\Rightarrow x^2 = 9.1\\times10^{-9} \\Rightarrow x = 9.54\\times10^{-5}$ M $= [\\ce{HS^-}]$\n\n' +
                '**Step 1, with 0.1M HCl.** HCl is a strong acid, so it swamps $[\\ce{H+}]$ at $\\approx 0.1$ M, suppressing $\\ce{H2S}$ ionization (common-ion effect).\n' +
                '$K_{a1} = \\dfrac{(0.1)[\\ce{HS^-}]}{0.1} = [\\ce{HS^-}] \\Rightarrow [\\ce{HS^-}] = 9.1\\times10^{-8}$ M — three orders of magnitude smaller than without HCl.\n\n' +
                '**Step 2, no HCl.** Here $[\\ce{H+}] = [\\ce{HS^-}] = 9.54\\times10^{-5}$ M from step 1 (the tiny extra $\\ce{H+}$ from step 2 is negligible).\n' +
                '$K_{a2} = \\dfrac{[\\ce{H+}][\\ce{S^{2-}}]}{[\\ce{HS^-}]}$, and since $[\\ce{H+}]=[\\ce{HS^-}]$ here, they cancel: $[\\ce{S^{2-}}] = K_{a2} = 1.2\\times10^{-13}$ M.\n\n' +
                '**Step 2, with 0.1M HCl.** Now $[\\ce{H+}]\\approx0.1$ M and $[\\ce{HS^-}]=9.1\\times10^{-8}$ M from above.\n' +
                '$[\\ce{S^{2-}}] = \\dfrac{K_{a2}\\,[\\ce{HS^-}]}{[\\ce{H+}]} = \\dfrac{(1.2\\times10^{-13})(9.1\\times10^{-8})}{0.1} = 1.09\\times10^{-19}$ M\n\n' +
                'Both dissociation steps get pushed back by adding $\\ce{HCl}$ — the added $\\ce{H+}$ suppresses both equilibria simultaneously, which is exactly the trick used to control which metal sulphides precipitate out of an acidified $\\ce{H2S}$ solution (see Q6.73).',
            },
            {
              kind: 'numerical',
              id: '38037db2-0ae9-45fa-b145-8e04ccb8f18e',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.46',
              prompt: 'The ionization constant of acetic acid is 1.74 × 10^-5. Calculate the degree of dissociation of acetic acid in its 0.05 M solution. Calculate the concentration of acetate ion in the solution and its pH.',
              answer: 'α = 0.0187, [CH3COO⁻] = 9.3×10⁻⁴ M, pH = 3.03',
              solution:
                'For a weak acid at concentration $C$ with small $\\alpha$, $\\alpha \\approx \\sqrt{K_a/C}$ (the Ostwald dilution law).\n\n' +
                '$\\alpha = \\sqrt{\\dfrac{1.74\\times10^{-5}}{0.05}} = \\sqrt{3.48\\times10^{-4}} = 0.0187$ (about 1.9% dissociated)\n\n' +
                '$[\\ce{CH3COO^-}] = \\alpha C = 0.0187 \\times 0.05 = 9.3\\times10^{-4}$ M\n\n' +
                'Since $[\\ce{H+}] = [\\ce{CH3COO^-}]$ for a simple weak-acid ionization:\n' +
                '$\\text{pH} = -\\log(9.3\\times10^{-4}) = 3.03$',
            },
            {
              kind: 'numerical',
              id: 'f9c0846b-8519-4705-abd9-6807e615682e',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.47',
              prompt: 'It has been found that the pH of a 0.01M solution of an organic acid is 4.15. Calculate the concentration of the anion, the ionization constant of the acid and its pKa.',
              answer: '[A⁻] = 7.08×10⁻⁵ M, Ka ≈ 5.0×10⁻⁷, pKa ≈ 6.30',
              solution:
                '$[\\ce{H+}] = 10^{-\\text{pH}} = 10^{-4.15} = 7.08\\times10^{-5}$ M.\n\n' +
                'For a monoprotic weak acid $\\ce{HA}$, one $\\ce{H+}$ is produced per $\\ce{A^-}$, so $[\\ce{A^-}] = [\\ce{H+}] = 7.08\\times10^{-5}$ M.\n\n' +
                'The undissociated acid remaining is $C - [\\ce{H+}] = 0.01 - 7.08\\times10^{-5} \\approx 9.93\\times10^{-3}$ M.\n\n' +
                '$K_a = \\dfrac{[\\ce{H+}][\\ce{A^-}]}{[\\ce{HA}]} = \\dfrac{(7.08\\times10^{-5})^2}{9.93\\times10^{-3}} = 5.0\\times10^{-7}$\n\n' +
                '$\\text{p}K_a = -\\log(5.0\\times10^{-7}) = 6.30$',
            },
            {
              kind: 'numerical',
              id: 'ff938826-1cbe-4f9d-944f-5f7a65d78d9f',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.50',
              prompt: 'The degree of ionization of a 0.1M bromoacetic acid solution is 0.132. Calculate the pH of the solution and the pKa of bromoacetic acid.',
              answer: 'pH = 1.88, pKa = 2.70',
              solution:
                '$[\\ce{H+}] = \\alpha C = 0.132 \\times 0.1 = 0.0132$ M\n\n' +
                '$\\text{pH} = -\\log(0.0132) = 1.88$\n\n' +
                'For $K_a$, since $\\alpha$ is not tiny here (13.2%), it\'s worth keeping the $(1-\\alpha)$ term:\n' +
                '$K_a = \\dfrac{C\\alpha^2}{1-\\alpha} = \\dfrac{0.1\\times(0.132)^2}{1-0.132} = \\dfrac{0.1\\times0.01742}{0.868} = 2.0\\times10^{-3}$\n\n' +
                '$\\text{p}K_a = -\\log(2.0\\times10^{-3}) = 2.70$',
            },
            {
              kind: 'numerical',
              id: 'f729d698-2bd9-4e0f-98cf-7862be185d1e',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.51',
              prompt: 'The pH of 0.005M codeine (C18H21NO3) solution is 9.95. Calculate its ionization constant and pKb.',
              answer: 'Kb = 1.6×10⁻⁶, pKb = 5.80',
              solution:
                'Codeine is a weak base, so work in pOH first.\n\n' +
                '$\\text{pOH} = 14 - 9.95 = 4.05$\n\n' +
                '$[\\ce{OH^-}] = 10^{-4.05} = 8.91\\times10^{-5}$ M\n\n' +
                'Treating $[\\ce{OH^-}]$ as small compared with $C$:\n' +
                '$K_b = \\dfrac{[\\ce{OH^-}]^2}{C} = \\dfrac{(8.91\\times10^{-5})^2}{0.005} = 1.59\\times10^{-6} \\approx 1.6\\times10^{-6}$\n\n' +
                '$\\text{p}K_b = -\\log(1.6\\times10^{-6}) = 5.80$',
            },
            {
              kind: 'numerical',
              id: 'ff7af6c1-0468-41f2-bf2e-911b1e05ca19',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.52',
              prompt: 'What is the pH of 0.001M aniline solution? The ionization constant of aniline can be taken from Table 6.7. Calculate the degree of ionization of aniline in the solution. Also calculate the ionization constant of the conjugate acid of aniline.',
              answer: 'pH ≈ 7.82, α = 6.5×10⁻⁴, Ka(anilinium) = 2.3×10⁻⁵',
              solution:
                'From NCERT Table 6.7, $K_b(\\text{aniline}) = 4.27\\times10^{-10}$.\n\n' +
                '$\\alpha = \\sqrt{K_b/C} = \\sqrt{\\dfrac{4.27\\times10^{-10}}{0.001}} = \\sqrt{4.27\\times10^{-7}} = 6.53\\times10^{-4}$\n\n' +
                '$[\\ce{OH^-}] = \\alpha C = 6.53\\times10^{-4}\\times0.001 = 6.53\\times10^{-7}$ M\n\n' +
                '$\\text{pOH} = -\\log(6.53\\times10^{-7}) = 6.19 \\Rightarrow \\text{pH} = 14-6.19 = 7.81$\n\n' +
                'The conjugate acid of aniline is the anilinium ion, $\\ce{C6H5NH3+}$:\n' +
                '$K_a(\\text{anilinium}) = \\dfrac{K_w}{K_b} = \\dfrac{1.0\\times10^{-14}}{4.27\\times10^{-10}} = 2.34\\times10^{-5} \\approx 2.3\\times10^{-5}$',
            },
            {
              kind: 'numerical',
              id: '4d5bebbe-37d6-4847-9df6-fd26d10278c4',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.59',
              prompt: 'The ionization constant of propanoic acid is 1.32 × 10^-5. Calculate the degree of ionization of the acid in its 0.05M solution and also its pH. What will be its degree of ionization if the solution is 0.01M in HCl also?',
              answer: 'α = 0.0163, pH = 3.09 (no HCl); α = 1.32×10⁻³ with 0.01M HCl',
              solution:
                '**Without HCl:**\n' +
                '$\\alpha = \\sqrt{K_a/C} = \\sqrt{\\dfrac{1.32\\times10^{-5}}{0.05}} = \\sqrt{2.64\\times10^{-4}} = 0.0163$\n\n' +
                '$[\\ce{H+}] = \\alpha C = 0.0163\\times0.05 = 8.12\\times10^{-4}$ M $\\Rightarrow \\text{pH} = -\\log(8.12\\times10^{-4}) = 3.09$\n\n' +
                '**With 0.01M HCl (common-ion effect):** $[\\ce{H+}]$ is now dominated by the strong acid, $\\approx 0.01$ M. Let $y$ be the extra ionization contributed by propanoic acid.\n' +
                '$K_a = \\dfrac{(0.01)(y)}{0.05} = 1.32\\times10^{-5} \\Rightarrow y = \\dfrac{1.32\\times10^{-5}\\times0.05}{0.01} = 6.6\\times10^{-5}$ M\n\n' +
                '$\\alpha = y/C = \\dfrac{6.6\\times10^{-5}}{0.05} = 1.32\\times10^{-3}$\n\n' +
                'The degree of ionization dropped from 1.6% to 0.13% — over ten times smaller — purely because the common $\\ce{H+}$ from HCl pushed the propanoic acid equilibrium back toward the undissociated form.',
            },
            {
              kind: 'numerical',
              id: '142e11e1-076a-4944-84bf-a6495f833631',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.60',
              prompt: 'The pH of 0.1M solution of cyanic acid (HCNO) is 2.34. Calculate the ionization constant of the acid and its degree of ionization in the solution.',
              answer: 'α = 0.0457, Ka ≈ 2.09×10⁻⁴',
              solution:
                '$[\\ce{H+}] = 10^{-2.34} = 4.57\\times10^{-3}$ M\n\n' +
                '$\\alpha = [\\ce{H+}]/C = \\dfrac{4.57\\times10^{-3}}{0.1} = 0.0457$\n\n' +
                'With $\\alpha$ this small (about 4.6%), the standard weak-acid approximation $K_a \\approx C\\alpha^2$ (undissociated concentration $\\approx C$) is accurate enough:\n' +
                '$K_a \\approx C\\alpha^2 = 0.1 \\times (0.0457)^2 = 0.1\\times2.09\\times10^{-3} = 2.09\\times10^{-4}$',
            },
            {
              kind: 'numerical',
              id: 'b7e7af60-f378-4751-a52b-27760217ea6e',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.62',
              prompt: 'A 0.02M solution of pyridinium hydrochloride has pH = 3.44. Calculate the ionization constant of pyridine.',
              answer: 'Kb(pyridine) = 1.5×10⁻⁹',
              solution:
                'Pyridinium hydrochloride fully dissociates to give the pyridinium ion $\\ce{C5H5NH+}$, which is the *conjugate acid* of pyridine and behaves as a weak acid in water:\n' +
                '$\\ce{C5H5NH+ <=> C5H5N + H+}$\n\n' +
                '$[\\ce{H+}] = 10^{-3.44} = 3.63\\times10^{-4}$ M\n\n' +
                'Since $[\\ce{H+}]$ is small compared with $C = 0.02$ M:\n' +
                '$K_a(\\text{pyridinium}) \\approx \\dfrac{[\\ce{H+}]^2}{C} = \\dfrac{(3.63\\times10^{-4})^2}{0.02} = 6.59\\times10^{-6}$\n\n' +
                'Now flip to the conjugate base, pyridine itself:\n' +
                '$K_b(\\text{pyridine}) = \\dfrac{K_w}{K_a} = \\dfrac{1.0\\times10^{-14}}{6.59\\times10^{-6}} = 1.5\\times10^{-9}$',
            },
          ],
        },
        {
          id: 's4-hydrolysis-common-ion',
          title: 'Common-ion effect & salt hydrolysis',
          blurb: 'What happens to a weak acid or base\'s ionization when you add a common ion, and how the salt of a weak acid/base itself reacts with water.',
          items: [
            {
              kind: 'numerical',
              id: 'd1c9f9b5-2592-4623-b5d9-836963ee738d',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.53',
              prompt: 'Calculate the degree of ionization of 0.05M acetic acid if its pKa value is 4.74. How is the degree of dissociation affected when its solution also contains (a) 0.01M (b) 0.1M in HCl?',
              answer: 'α = 0.0018 with 0.01M HCl; α = 0.00018 with 0.1M HCl',
              solution:
                'First recover $K_a$ from the given $\\text{p}K_a$: $K_a = 10^{-4.74} = 1.82\\times10^{-5}$.\n\n' +
                'In both parts, the strong acid HCl dominates $[\\ce{H+}]$, so treat $[\\ce{H+}] \\approx$ the HCl concentration and let $y$ be the small extra ionization contributed by acetic acid ($[\\ce{Ac^-}] = y$, undissociated $\\ce{CH3COOH} \\approx 0.05$).\n\n' +
                '**(a) 0.01M HCl:**\n' +
                '$K_a = \\dfrac{(0.01)(y)}{0.05} = 1.82\\times10^{-5} \\Rightarrow y = \\dfrac{1.82\\times10^{-5}\\times0.05}{0.01} = 9.1\\times10^{-5}$ M\n' +
                '$\\alpha = y/0.05 = 1.82\\times10^{-3} \\approx 0.0018$\n\n' +
                '**(b) 0.1M HCl:**\n' +
                '$K_a = \\dfrac{(0.1)(y)}{0.05} = 1.82\\times10^{-5} \\Rightarrow y = \\dfrac{1.82\\times10^{-5}\\times0.05}{0.1} = 9.1\\times10^{-6}$ M\n' +
                '$\\alpha = y/0.05 = 1.82\\times10^{-4} \\approx 0.00018$\n\n' +
                'Ten times more HCl gives ten times less dissociation — the suppression scales exactly inversely with the amount of common ion added.',
            },
            {
              kind: 'numerical',
              id: 'b62f7a52-4a07-4b03-85fa-6fe0fa43a3a7',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.54',
              prompt: 'The ionization constant of dimethylamine is 5.4 × 10^-4. Calculate its degree of ionization in its 0.02M solution. What percentage of dimethylamine is ionized if the solution is also 0.1M in NaOH?',
              answer: 'α ≈ 16.4% alone; only 0.54% when 0.1M NaOH is also present',
              solution:
                '**Alone, no NaOH:**\n' +
                '$\\alpha = \\sqrt{K_b/C} = \\sqrt{\\dfrac{5.4\\times10^{-4}}{0.02}} = \\sqrt{0.027} = 0.164$ (16.4% ionized — a fairly large fraction, as expected for a reasonably strong weak base)\n\n' +
                '**With 0.1M NaOH also present (common ion $\\ce{OH^-}$):** $[\\ce{OH^-}] \\approx 0.1$ M is now set almost entirely by the strong base. Let $z$ be the extra $\\ce{OH^-}$ contributed by dimethylamine ionizing.\n' +
                '$K_b = \\dfrac{(0.1)(z)}{0.02} = 5.4\\times10^{-4} \\Rightarrow z = \\dfrac{5.4\\times10^{-4}\\times0.02}{0.1} = 1.08\\times10^{-4}$ M\n\n' +
                '$\\alpha = z/C = \\dfrac{1.08\\times10^{-4}}{0.02} = 5.4\\times10^{-3}$ — i.e. **0.54%** ionized, a thirty-fold drop from the 16.4% it showed alone.',
            },
            {
              kind: 'numerical',
              id: 'ff8da02c-b633-444e-9361-b187b9ba5861',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.61',
              prompt: 'The ionization constant of nitrous acid is 4.5 × 10^-4. Calculate the pH of 0.04 M sodium nitrite solution and also its degree of hydrolysis.',
              answer: 'pH = 7.97, degree of hydrolysis h = 2.36×10⁻⁵',
              solution:
                'Sodium nitrite is the salt of a weak acid ($\\ce{HNO2}$) and a strong base — its anion hydrolyses:\n' +
                '$\\ce{NO2- + H2O <=> HNO2 + OH-}$\n\n' +
                'First get $K_b$ for this hydrolysis: $K_b = \\dfrac{K_w}{K_a} = \\dfrac{1.0\\times10^{-14}}{4.5\\times10^{-4}} = 2.22\\times10^{-11}$\n\n' +
                'Degree of hydrolysis: $h = \\sqrt{K_b/C} = \\sqrt{\\dfrac{2.22\\times10^{-11}}{0.04}} = \\sqrt{5.56\\times10^{-10}} = 2.36\\times10^{-5}$\n\n' +
                '$[\\ce{OH^-}] = hC = 2.36\\times10^{-5}\\times0.04 = 9.43\\times10^{-7}$ M\n\n' +
                '$\\text{pOH} = -\\log(9.43\\times10^{-7}) = 6.03 \\Rightarrow \\text{pH} = 14-6.03 = 7.97$\n\n' +
                'A pH just above 7 makes sense: nitrite hydrolysis is genuine but very slight (the degree of hydrolysis is only 0.0024%), because $\\ce{HNO2}$ is not a *very* weak acid.',
            },
            {
              kind: 'numerical',
              id: '0f88ca7a-12ac-4c9c-aa9b-b2cf9341b1d5',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.63',
              prompt: 'Predict if the solutions of the following salts are neutral, acidic or basic: NaCl, KBr, NaCN, NH4NO3, NaNO2 and KF',
              answer: 'NaCl, KBr neutral; NaCN, NaNO2, KF basic; NH4NO3 acidic',
              solution:
                'The rule: compare the strength of the acid and base that formed the salt. Strong+strong → neutral; weak acid+strong base → basic (anion hydrolyses); strong acid+weak base → acidic (cation hydrolyses).\n\n' +
                '- $\\ce{NaCl}$: from strong $\\ce{HCl}$ + strong $\\ce{NaOH}$ → **neutral**\n' +
                '- $\\ce{KBr}$: from strong $\\ce{HBr}$ + strong $\\ce{KOH}$ → **neutral**\n' +
                '- $\\ce{NaCN}$: from weak $\\ce{HCN}$ + strong $\\ce{NaOH}$ → $\\ce{CN^-}$ hydrolyses → **basic**\n' +
                '- $\\ce{NH4NO3}$: from weak $\\ce{NH4OH}$ + strong $\\ce{HNO3}$ → $\\ce{NH4+}$ hydrolyses → **acidic**\n' +
                '- $\\ce{NaNO2}$: from weak $\\ce{HNO2}$ + strong $\\ce{NaOH}$ → $\\ce{NO2^-}$ hydrolyses → **basic**\n' +
                '- $\\ce{KF}$: from weak $\\ce{HF}$ + strong $\\ce{KOH}$ → $\\ce{F^-}$ hydrolyses → **basic**',
            },
            {
              kind: 'numerical',
              id: '4b1f7e7b-9a47-45c1-bb0c-b54dde218a45',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.64',
              prompt: 'The ionization constant of chloroacetic acid is 1.35 × 10^-3. What will be the pH of 0.1M acid and its 0.1M sodium salt solution?',
              answer: 'pH(acid) = 1.9, pH(salt) = 7.9',
              solution:
                '**The acid itself, 0.1M chloroacetic acid:**\n' +
                '$[\\ce{H+}] \\approx \\sqrt{K_aC} = \\sqrt{1.35\\times10^{-3}\\times0.1} = \\sqrt{1.35\\times10^{-4}} = 0.0116$ M\n' +
                '$\\text{pH} = -\\log(0.0116) = 1.9$\n\n' +
                '**The sodium salt, 0.1M sodium chloroacetate:** this is the salt of a weak acid and a strong base, so the anion hydrolyses:\n' +
                '$K_b = \\dfrac{K_w}{K_a} = \\dfrac{1.0\\times10^{-14}}{1.35\\times10^{-3}} = 7.41\\times10^{-12}$\n\n' +
                '$h = \\sqrt{K_b/C} = \\sqrt{\\dfrac{7.41\\times10^{-12}}{0.1}} = \\sqrt{7.41\\times10^{-11}} = 8.61\\times10^{-6}$\n\n' +
                '$[\\ce{OH^-}] = hC = 8.61\\times10^{-6}\\times0.1 = 8.61\\times10^{-7}$ M\n\n' +
                '$\\text{pOH} = -\\log(8.61\\times10^{-7}) = 6.07 \\Rightarrow \\text{pH} = 14-6.07 = 7.9$\n\n' +
                'The same acid gives a strongly acidic solution as $\\ce{HA}$ but a mildly basic one as $\\ce{NaA}$ — proof that it\'s the *species*, not just "the chemical", that decides the pH.',
            },
          ],
        },
        {
          id: 's5-solubility-product',
          title: 'Solubility product (Ksp) & precipitation',
          blurb: 'Setting up Ksp expressions for sparingly-soluble salts, and using the ionic-product-vs-Ksp comparison to predict whether a precipitate forms.',
          items: [
            {
              kind: 'numerical',
              id: '6ef981f9-ad0e-47aa-afb2-b7fce7377197',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.67',
              prompt: 'Determine the solubilities of silver chromate, barium chromate, ferric hydroxide, lead chloride and mercurous iodide at 298K from their solubility product constants given in Table 6.9. Determine also the molarities of individual ions.',
              answer: 'Ag2CrO4: S = 6.5×10⁻⁵ M; BaCrO4: S = 1.1×10⁻⁵ M; Fe(OH)3: S = 1.39×10⁻¹⁰ M; PbCl2: S = 1.59×10⁻² M; Hg2I2: S = 2.24×10⁻¹⁰ M',
              solution:
                'For each salt, write the dissolution equilibrium, express $K_{sp}$ in terms of the molar solubility $S$, and solve. (Table 6.9 values used: $K_{sp}(\\ce{Ag2CrO4})=1.1\\times10^{-12}$, $K_{sp}(\\ce{BaCrO4})=1.2\\times10^{-10}$, $K_{sp}(\\ce{Fe(OH)3})=1.0\\times10^{-38}$, $K_{sp}(\\ce{PbCl2})=1.6\\times10^{-5}$, $K_{sp}(\\ce{Hg2I2})=4.5\\times10^{-29}$.)\n\n' +
                '**Silver chromate** $\\ce{Ag2CrO4 <=> 2Ag+ + CrO4^{2-}}$: $K_{sp}=4S^3$\n' +
                '$S = \\left(\\dfrac{1.1\\times10^{-12}}{4}\\right)^{1/3} = 6.5\\times10^{-5}$ M; $[\\ce{Ag+}]=2S=1.30\\times10^{-4}$ M, $[\\ce{CrO4^{2-}}]=S=6.5\\times10^{-5}$ M\n\n' +
                '**Barium chromate** $\\ce{BaCrO4 <=> Ba^{2+} + CrO4^{2-}}$: $K_{sp}=S^2$\n' +
                '$S = \\sqrt{1.2\\times10^{-10}} = 1.1\\times10^{-5}$ M; $[\\ce{Ba^{2+}}]=[\\ce{CrO4^{2-}}]=1.1\\times10^{-5}$ M\n\n' +
                '**Ferric hydroxide** $\\ce{Fe(OH)3 <=> Fe^{3+} + 3OH-}$: $K_{sp}=27S^4$\n' +
                '$S = \\left(\\dfrac{1.0\\times10^{-38}}{27}\\right)^{1/4} = 1.39\\times10^{-10}$ M; $[\\ce{Fe^{3+}}]=S=1.39\\times10^{-10}$ M, $[\\ce{OH^-}]=3S=4.17\\times10^{-10}$ M\n\n' +
                '**Lead chloride** $\\ce{PbCl2 <=> Pb^{2+} + 2Cl-}$: $K_{sp}=4S^3$\n' +
                '$S = \\left(\\dfrac{1.6\\times10^{-5}}{4}\\right)^{1/3} = 1.59\\times10^{-2}$ M; $[\\ce{Pb^{2+}}]=1.59\\times10^{-2}$ M, $[\\ce{Cl^-}]=2S=3.18\\times10^{-2}$ M\n\n' +
                '**Mercurous iodide** $\\ce{Hg2I2 <=> Hg2^{2+} + 2I-}$: $K_{sp}=4S^3$ (note: mercurous ion is the diatomic $\\ce{Hg2^{2+}}$, so this is still a 1:2 salt)\n' +
                '$S = \\left(\\dfrac{4.5\\times10^{-29}}{4}\\right)^{1/3} = 2.24\\times10^{-10}$ M; $[\\ce{Hg2^{2+}}]=2.24\\times10^{-10}$ M, $[\\ce{I^-}]=2S=4.48\\times10^{-10}$ M',
            },
            {
              kind: 'numerical',
              id: '43ad53f8-6186-4032-a7cf-a70d88efa55b',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.68',
              prompt: 'The solubility product constant of Ag2CrO4 and AgBr are 1.1 × 10^-12 and 5.0 × 10^-13 respectively. Calculate the ratio of the molarities of their saturated solutions.',
              answer: 'S(Ag2CrO4)/S(AgBr) = 91.9 — silver chromate is more soluble',
              solution:
                'These two salts have *different* stoichiometry, so their $K_{sp}$-to-$S$ relations are different — you cannot just compare $K_{sp}$ values directly.\n\n' +
                '$\\ce{Ag2CrO4 <=> 2Ag+ + CrO4^{2-}}$: $K_{sp}=4S_1^3$\n' +
                '$S_1 = \\left(\\dfrac{1.1\\times10^{-12}}{4}\\right)^{1/3} = 6.5\\times10^{-5}$ M\n\n' +
                '$\\ce{AgBr <=> Ag+ + Br-}$: $K_{sp}=S_2^2$\n' +
                '$S_2 = \\sqrt{5.0\\times10^{-13}} = 7.07\\times10^{-7}$ M\n\n' +
                'Ratio: $\\dfrac{S_1}{S_2} = \\dfrac{6.5\\times10^{-5}}{7.07\\times10^{-7}} = 91.9$\n\n' +
                'Even though $\\ce{Ag2CrO4}$ has the *larger* $K_{sp}$ number, that alone doesn\'t make it more soluble by inspection — the cube-root vs square-root relationship (from having 3 ions vs 2) is what makes the gap this large.',
            },
            {
              kind: 'numerical',
              id: '5ed13aa5-7e10-4291-8b87-1889ccdc9474',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.69',
              prompt: 'Equal volumes of 0.002 M solutions of sodium iodate and cupric chlorate are mixed together. Will it lead to precipitation of copper iodate? (For cupric iodate Ksp = 7.4 × 10^-8).',
              answer: 'No — the ionic product is well below Ksp, no precipitate forms',
              solution:
                'Mixing equal volumes halves each concentration: $[\\ce{IO3^-}] = [\\ce{Cu^{2+}}] = 0.002/2 = 0.001$ M.\n\n' +
                '$\\ce{Cu(IO3)2 <=> Cu^{2+} + 2IO3-}$, so the ionic product to check is $Q_{sp}=[\\ce{Cu^{2+}}][\\ce{IO3^-}]^2$:\n\n' +
                '$Q_{sp} = (0.001)(0.001)^2 = 1\\times10^{-9}$\n\n' +
                'Compare with $K_{sp} = 7.4\\times10^{-8}$: since $Q_{sp} (1\\times10^{-9}) < K_{sp} (7.4\\times10^{-8})$, the solution is *unsaturated* with respect to copper iodate.\n\n' +
                '**No precipitate forms.**',
            },
            {
              kind: 'numerical',
              id: '60dce864-8e2b-46f0-bb30-054111e04036',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.70',
              prompt: 'The ionization constant of benzoic acid is 6.46 × 10^-5 and Ksp for silver benzoate is 2.5 × 10^-13. How many times is silver benzoate more soluble in a buffer of pH 3.19 compared to its solubility in pure water?',
              answer: 'Silver benzoate is about 3.3 times more soluble at pH 3.19 than in pure water',
              solution:
                '**In pure water:** the pH stays near neutral, well above $\\text{p}K_a(\\text{benzoic acid})\\approx4.2$, so essentially all dissolved benzoate stays as $\\ce{C6H5COO^-}$ (negligible protonation). So $K_{sp}=S_0^2$:\n' +
                '$S_0 = \\sqrt{2.5\\times10^{-13}} = 5.0\\times10^{-7}$ M\n\n' +
                '**In the pH 3.19 buffer:** this pH is *below* $\\text{p}K_a$, so a large fraction of dissolved benzoate is protonated to un-ionized benzoic acid, $\\ce{HC6H5COO}$. Removing $\\ce{C6H5COO^-}$ this way pulls more $\\ce{AgC6H5COO(s)}$ into solution to keep $K_{sp}$ satisfied — so the *total* solubility $S$ (both forms combined) rises.\n\n' +
                'Let $S = [\\ce{C6H5COO^-}] + [\\ce{HC6H5COO}]$ be the total solubility, with $[\\ce{Ag+}]=S$. The fraction remaining as the free anion is $\\dfrac{K_a}{K_a+[\\ce{H+}]}$, so $[\\ce{C6H5COO^-}] = S\\cdot\\dfrac{K_a}{K_a+[\\ce{H+}]}$.\n\n' +
                '$K_{sp} = [\\ce{Ag+}][\\ce{C6H5COO^-}] = S^2 \\cdot \\dfrac{K_a}{K_a+[\\ce{H+}]}$\n\n' +
                '$[\\ce{H+}] = 10^{-3.19} = 6.46\\times10^{-4}$ M, so $K_a + [\\ce{H+}] = 6.46\\times10^{-5}+6.46\\times10^{-4} = 7.10\\times10^{-4}$\n\n' +
                '$S^2 = K_{sp}\\cdot\\dfrac{K_a+[\\ce{H+}]}{K_a} = 2.5\\times10^{-13}\\times\\dfrac{7.10\\times10^{-4}}{6.46\\times10^{-5}} = 2.5\\times10^{-13}\\times11.0 = 2.75\\times10^{-12}$\n\n' +
                '$S = \\sqrt{2.75\\times10^{-12}} = 1.66\\times10^{-6}$ M\n\n' +
                'Ratio: $\\dfrac{S}{S_0} = \\dfrac{1.66\\times10^{-6}}{5.0\\times10^{-7}} = 3.3$ — silver benzoate is about **3.3 times more soluble** in the acidic buffer.',
            },
            {
              kind: 'numerical',
              id: '95ab523c-7334-41f8-a8bb-079a177faec8',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.71',
              prompt: 'What is the maximum concentration of equimolar solutions of ferrous sulphate and sodium sulphide so that when mixed in equal volumes, there is no precipitation of iron sulphide? (For iron sulphide, Ksp = 6.3 × 10^-18).',
              answer: 'C(max) ≈ 5.02×10⁻⁹ M',
              solution:
                'Let $C$ be the concentration of each solution *before* mixing. Mixing equal volumes doubles the total volume, so each ion is diluted to half its original concentration:\n' +
                '$[\\ce{Fe^{2+}}] = [\\ce{S^{2-}}] = C/2$\n\n' +
                'For no precipitation, the ionic product must stay at or below $K_{sp}$:\n' +
                '$\\left(\\dfrac{C}{2}\\right)^2 \\le K_{sp}$\n\n' +
                '$C^2 \\le 4K_{sp} = 4\\times6.3\\times10^{-18} = 2.52\\times10^{-17}$\n\n' +
                '$C \\le \\sqrt{2.52\\times10^{-17}} = 5.02\\times10^{-9}$ M\n\n' +
                'So the two solutions can be as concentrated as $5.02\\times10^{-9}$ M each and still just avoid precipitating $\\ce{FeS}$ once mixed — a striking illustration of how insoluble $\\ce{FeS}$ really is.',
            },
            {
              kind: 'numerical',
              id: 'd77bddcc-a9f6-435c-a998-c1f23e5ce539',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.72',
              prompt: 'What is the minimum volume of water required to dissolve 1g of calcium sulphate at 298 K? (For calcium sulphate, Ksp is 9.1 × 10^-6).',
              answer: 'V(min) = 2.43 L',
              solution:
                '$\\ce{CaSO4 <=> Ca^{2+} + SO4^{2-}}$, so $K_{sp}=S^2$ where $S$ is the molar solubility:\n\n' +
                '$S = \\sqrt{9.1\\times10^{-6}} = 3.02\\times10^{-3}$ M — this is the *maximum* concentration of $\\ce{CaSO4}$ that water can hold in solution.\n\n' +
                'Molar mass of $\\ce{CaSO4} = 40+32+4(16) = 136$ g/mol. Moles in 1 g $= 1/136 = 7.35\\times10^{-3}$ mol.\n\n' +
                'To keep the concentration at or below the solubility limit, the volume must be at least:\n' +
                '$V = \\dfrac{\\text{moles}}{S} = \\dfrac{7.35\\times10^{-3}}{3.02\\times10^{-3}} = 2.43$ L',
            },
            {
              kind: 'numerical',
              id: '3da45721-e1d9-4e2f-b26f-0758a1a8e2be',
              source: 'ncert_exercise',
              source_label: 'NCERT 6.73',
              prompt: 'The concentration of sulphide ion in 0.1M HCl solution saturated with hydrogen sulphide is 1.0 × 10^-19 M. If 10 mL of this is added to 5 mL of 0.04 M solution of the following: FeSO4, MnCl2, ZnCl2 and CdCl2, in which of these solutions precipitation will take place?',
              answer: 'Precipitation occurs in ZnCl2 and CdCl2 solutions (not FeSO4 or MnCl2)',
              solution:
                'After mixing 10 mL of the sulphide solution with 5 mL of each metal-ion solution, total volume = 15 mL, so both concentrations get diluted:\n\n' +
                '$[\\ce{S^{2-}}] = 1.0\\times10^{-19}\\times\\dfrac{10}{15} = 6.67\\times10^{-20}$ M\n\n' +
                '$[\\ce{M^{2+}}] = 0.04\\times\\dfrac{5}{15} = 1.33\\times10^{-2}$ M (same for all four metal salts, since they start at equal concentration and equal volume)\n\n' +
                '$Q_{sp} = [\\ce{M^{2+}}][\\ce{S^{2-}}] = (1.33\\times10^{-2})(6.67\\times10^{-20}) = 8.89\\times10^{-22}$ — this ionic product is the same for all four metals; what differs is each metal sulphide\'s own $K_{sp}$.\n\n' +
                'Using the standard $K_{sp}$ values for the four sulphides:\n\n' +
                '| Salt | $K_{sp}$ | Compare to $Q_{sp}=8.89\\times10^{-22}$ | Precipitates? |\n' +
                '|---|---|---|---|\n' +
                '| $\\ce{FeS}$ | $6.3\\times10^{-18}$ | $Q_{sp} < K_{sp}$ | No |\n' +
                '| $\\ce{MnS}$ | $2.5\\times10^{-13}$ | $Q_{sp} < K_{sp}$ | No |\n' +
                '| $\\ce{ZnS}$ | $1.6\\times10^{-24}$ | $Q_{sp} > K_{sp}$ | **Yes** |\n' +
                '| $\\ce{CdS}$ | $8.0\\times10^{-27}$ | $Q_{sp} > K_{sp}$ | **Yes** |\n\n' +
                'So precipitation happens for the two least soluble sulphides, $\\ce{ZnS}$ and $\\ce{CdS}$ — while $\\ce{FeS}$ and $\\ce{MnS}$, being more soluble, stay dissolved at this very low $[\\ce{S^{2-}}]$. This selective precipitation, controlled by keeping $[\\ce{H+}]$ high enough to suppress $[\\ce{S^{2-}}]$, is exactly the classic qualitative-analysis trick for separating metal ions by group.',
            },
          ],
        },
      ],
    },
  ],
};
