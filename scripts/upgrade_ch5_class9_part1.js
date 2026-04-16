'use strict';
/**
 * Class 9 Chapter 5 — Mixtures & Separation
 * Part 1: Pages 68–75 (Pure Substances → Distillation)
 * Adds reasoning_prompt as block 0, upgrades quiz to 3-question Class 9 standard.
 */
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const BOOK_ID = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';

// Each entry: { _id, reasoning_prompt_data, quiz_questions }
const PAGES = [
  // ── p68: Pure Substances vs. Mixtures ──────────────────────────────────────
  {
    _id: '534c93c9-4215-49ca-969c-9a1e978cc976',
    label: 'p68 Pure Substances vs. Mixtures',
    rp: {
      reasoning_type: 'logical',
      prompt: 'You mix iron filings with sulfur powder. One classmate says the result is a compound of iron and sulfur. Another says it\'s just a mixture. Without doing any experiment, how would you decide who is right?',
      options: [
        'The first classmate is right — combining any two substances always makes a compound',
        'You need to test whether the properties changed — a mixture keeps the individual properties of its components, while a compound has entirely new properties',
        'The second classmate is right — mixing never forms compounds under any condition',
        'You need a microscope to see whether the particles combined',
      ],
      correct_index: 1,
      reveal: 'A compound forms only through a chemical reaction — new bonds form and properties change fundamentally. A mixture retains the individual properties of its components. Without heat or a catalyst, simply mixing iron filings and sulfur gives a mixture: the iron can still be attracted by a magnet, and sulfur still burns with a blue flame. React the same mixture over a flame and you get iron sulphide — a completely different substance that is neither attracted by a magnet nor burns like sulfur.',
      difficulty_level: 2,
    },
    quiz: [
      {
        question: 'Which of the following is a pure substance?',
        options: ['Milk', 'Sea water', 'Common salt (sodium chloride)', 'Air'],
        correct_index: 2,
        explanation: 'A pure substance has a fixed, uniform composition throughout. Sodium chloride (NaCl) is a pure compound with definite properties. Milk, sea water, and air are all mixtures — their composition varies.',
        reasoning_level: 1,
      },
      {
        question: 'A student has a mixture of common salt and water. She heats it gently until the liquid disappears. What does she observe, and what does this tell her about the mixture?',
        options: [
          'The salt and water react to form a new compound that evaporates completely',
          'Water evaporates first, leaving white salt behind — proving the two substances were not chemically combined and have very different boiling points',
          'Both evaporate together at the same temperature',
          'The salt dissolves completely into the steam',
        ],
        correct_index: 1,
        explanation: 'In a mixture, components retain their individual properties. Water boils at 100°C and evaporates; sodium chloride has a boiling point over 1400°C and stays behind as a white solid. If they had formed a compound, you could not separate them this easily by simple heating.',
        reasoning_level: 2,
      },
      {
        question: 'Table sugar (sucrose) is a compound made of carbon, hydrogen, and oxygen. Tea is a mixture of water, dissolved sugar, and other substances. A student argues: "Sugar is a compound, so tea must also be a compound." What is wrong with this reasoning?',
        options: [
          'Sugar is not actually a compound — it is an element',
          'A mixture containing a compound does not become a compound itself — tea has no fixed composition and its components can be separated physically',
          'Tea cannot contain sugar because sugar loses its identity when dissolved',
          'Nothing is wrong — any substance containing a compound is automatically a compound',
        ],
        correct_index: 1,
        explanation: 'A compound has a fixed, uniform composition with properties distinct from its constituent elements. A mixture like tea has variable composition (more or less sugar, different tea types) and its components — water, sucrose, flavour compounds — retain their properties and can be separated by physical means such as evaporation. The presence of a compound in a mixture does not make the mixture a compound.',
        reasoning_level: 3,
      },
    ],
  },

  // ── p69: Homogeneous Mixtures ───────────────────────────────────────────────
  {
    _id: '1b253452-8651-40e3-a901-dc6d3a481770',
    label: 'p69 Homogeneous Mixtures',
    rp: {
      reasoning_type: 'logical',
      prompt: 'A student adds a few drops of food colouring to water and stirs. She then adds sand and stirs. She calls both results "solutions." Is she using the term correctly?',
      options: [
        'Yes — both look uniform after stirring, so both are solutions',
        'Only the coloured water is a solution; the sand-water mixture will settle on standing, making it a suspension, not a solution',
        'Both are suspensions, not solutions',
        'Both qualify as solutions only if the particles cannot be seen with the naked eye',
      ],
      correct_index: 1,
      reveal: 'A solution is a homogeneous mixture where solute particles are smaller than 1 nanometre — interspersed between solvent molecules. This is why a true solution never settles and cannot be filtered. Sand particles are many orders of magnitude larger, settle on standing, and can be removed by filtration — all defining characteristics of a suspension. The food colouring molecules are truly dissolved at the molecular level.',
      difficulty_level: 2,
    },
    quiz: [
      {
        question: 'In a solution, the component present in larger quantity is called the:',
        options: ['Solute', 'Solvent', 'Solution', 'Mixture'],
        correct_index: 1,
        explanation: 'The solvent is the dissolving medium — present in larger quantity. The solute is what gets dissolved (smaller quantity). Together they form the solution. In salt water, water is the solvent and salt is the solute.',
        reasoning_level: 1,
      },
      {
        question: 'A student dissolves copper sulphate in water and filters the blue solution. What happens at the filter paper, and what does this confirm?',
        options: [
          'Blue copper sulphate crystals collect on the filter paper — the solution was incomplete',
          'Nothing is retained; the entire blue solution passes through, confirming copper sulphate is dissolved at the molecular level',
          'The filter paper turns blue but the filtrate is colourless',
          'Nothing passes through — the filter paper blocks all coloured substances',
        ],
        correct_index: 1,
        explanation: 'In a true solution, solute particles are ionic or molecular in size (< 1 nm) — far too small to be trapped by filter paper. The entire blue solution passes through unchanged. This is a key test that distinguishes solutions from suspensions (which leave residue on the filter paper).',
        reasoning_level: 2,
      },
      {
        question: 'You have three colourless liquids: vinegar (dilute acetic acid), salt water, and pure water. A classmate claims she can identify the pure water by filtering all three. Is she right?',
        options: [
          'Yes — pure water passes through filter paper; the others leave residue',
          'No — all three are homogeneous (solution or pure liquid) and none leaves any residue on the filter paper; filtration cannot distinguish them',
          'Yes — salt water leaves salt crystals on the filter paper',
          'No — she needs to boil them; pure water leaves no residue, but the others do',
        ],
        correct_index: 1,
        explanation: 'Filtration separates particles large enough to be trapped. All three liquids are homogeneous — no particles large enough to filter. Evaporation is the correct approach: salt water leaves salt, vinegar-water leaves a slight acetic acid residue, and pure water leaves nothing. "No visible particles" does not mean "can be identified by filtration."',
        reasoning_level: 3,
      },
    ],
  },

  // ── p70: Heterogeneous Mixtures ─────────────────────────────────────────────
  {
    _id: '7c94c471-cd6a-4cf9-8a30-92c9f71346e7',
    label: 'p70 Heterogeneous Mixtures',
    rp: {
      reasoning_type: 'logical',
      prompt: 'When you shake a bottle of sand and water and hold it to light, it looks turbid. Leave it for 10 minutes and the bottom clears while the top stays murky. A glass of salt water shows none of this. What is the key difference between the two mixtures?',
      options: [
        'Sand is a pure substance; salt is a mixture',
        'Salt particles are smaller than visible light wavelength so you see nothing; sand particles are large enough to scatter light and eventually sink under gravity, making the mixture heterogeneous',
        'Sand is denser than salt, so it settles faster',
        'Salt reacts with water chemically while sand does not',
      ],
      correct_index: 1,
      reveal: 'A solution\'s dissolved particles (< 1 nm) are far too small to interact with visible light or to be pulled down noticeably by gravity — so salt water stays clear and uniform indefinitely. Sand particles (visible to the naked eye, ~1 mm) are large enough to scatter light (turbidity) and heavy enough to sediment under gravity. This size difference is the fundamental criterion separating solutions from suspensions.',
      difficulty_level: 2,
    },
    quiz: [
      {
        question: 'Which of the following is a heterogeneous mixture?',
        options: ['Sugar solution', 'Salt water', 'Muddy water', 'Vinegar'],
        correct_index: 2,
        explanation: 'Muddy water is heterogeneous — mud particles are large, visible, and settle on standing. Sugar solution, salt water, and vinegar are all homogeneous solutions where the solute is uniformly dissolved at the molecular level.',
        reasoning_level: 1,
      },
      {
        question: 'A student shakes a mixture of oil and water vigorously. After 2 minutes, two distinct layers form again. What type of mixture is this, and why do the layers re-form?',
        options: [
          'Solution; the different densities cause re-separation',
          'Heterogeneous mixture; oil and water are immiscible because oil is non-polar and water is polar — "like dissolves like"',
          'Colloid; re-separation is due to the Tyndall effect stopping',
          'Suspension; the oil particles are too heavy to stay dissolved',
        ],
        correct_index: 1,
        explanation: 'Oil is non-polar; water is highly polar. Polar and non-polar substances do not dissolve in each other ("like dissolves like"). The two immiscible layers represent two separate liquids — less dense oil floats above denser water. This is a classic heterogeneous mixture.',
        reasoning_level: 2,
      },
      {
        question: 'Milk looks white and uniform to the naked eye, yet it is classified as a heterogeneous mixture (colloid). A student argues: "If I can\'t see any separation, it must be homogeneous." What is wrong with this reasoning?',
        options: [
          'Nothing — milk is homogeneous by NCERT definition',
          'Milk is heterogeneous only because it contains bacteria',
          'The student is using the wrong test: uniformity to the naked eye is not the criterion. Milk shows the Tyndall effect — fat droplets (0.1–1 µm) are dispersed but not dissolved, confirmed by the visible path of a light beam passed through it',
          'The student is right; since milk does not settle, it should be classified as a solution',
        ],
        correct_index: 2,
        explanation: 'A colloid appears uniform to the naked eye but is heterogeneous at the microscopic level. The Tyndall test reveals this: a beam of light through milk shows a glowing path (fat droplets scatter the beam). True salt water shows no such path — particles are too small to scatter visible light. "Looks uniform" is not the same as "is uniform at the molecular level."',
        reasoning_level: 3,
      },
    ],
  },

  // ── p71: The Tyndall Effect ─────────────────────────────────────────────────
  {
    _id: 'f1df84ae-37dc-4f80-8ab9-cdcc0a19c444',
    label: 'p71 The Tyndall Effect',
    rp: {
      reasoning_type: 'logical',
      prompt: 'Sunlight streaming through a dusty window looks like a glowing beam. The same sunlight through a clean, dust-free room shows no visible beam at all. What is actually different between the two situations?',
      options: [
        'The dusty room has more light entering through the window',
        'Dust particles scatter the light beam sideways, making the path visible to our eyes. In clean air, there are no particles large enough to scatter visible light — so the beam passes through invisibly',
        'The clean room absorbs more light, making the beam invisible',
        'Light beams only travel in straight lines in dusty rooms; they scatter in clean air',
      ],
      correct_index: 1,
      reveal: 'This is the Tyndall effect. Colloidal-sized particles (dust, ~1–1000 nm) are the right size to interact with the wavelength of visible light and scatter it sideways — so you see the beam\'s path. Air molecules in clean air are too small to scatter visible light significantly (they scatter UV, which is why the sky is blue). The same principle works in milk, fog, and dilute ink — any medium with colloidal particles scatters light visibly.',
      difficulty_level: 2,
    },
    quiz: [
      {
        question: 'The Tyndall effect is exhibited by which type of mixture?',
        options: ['True solutions', 'Colloids', 'Pure substances', 'Heavy suspensions'],
        correct_index: 1,
        explanation: 'Colloidal particles (1–1000 nm) are the right size to scatter visible light. Solution particles (< 1 nm) are too small; suspension particles are too large and absorb or reflect light differently. Only colloids consistently produce the visible glowing beam path called the Tyndall effect.',
        reasoning_level: 1,
      },
      {
        question: 'You shine a laser pointer through three glasses: salt water, milk, and muddy water. In which glass(es) will you clearly see the laser beam\'s path inside the liquid?',
        options: [
          'All three — all liquids scatter light',
          'Only milk — its fat droplets are the right size to scatter the beam; salt water has particles too small, and muddy water is too opaque for a clear path to be visible',
          'Salt water and milk',
          'Only muddy water',
        ],
        correct_index: 1,
        explanation: 'Salt water is a true solution — particles too small to scatter. Muddy water is opaque (large particles block and absorb light rather than scattering it cleanly). Milk is a colloid — fat droplets (0.1–1 µm) fall perfectly in the colloidal size range, scattering visible light and producing a clear glowing beam path.',
        reasoning_level: 2,
      },
      {
        question: 'A classmate says: "The Tyndall effect definitively proves a mixture is a colloid — if it shows Tyndall, it must be a colloid." Is this always true?',
        options: [
          'Yes — Tyndall effect is a 100% definitive test for colloids',
          'Yes, but only for liquid mixtures',
          'Mostly yes, but very fine suspensions (particles just above 1000 nm) can also scatter light weakly. Tyndall effect strongly indicates colloidal nature, but particle size measurement gives certainty. A true solution absolutely cannot show Tyndall effect.',
          'No — solutions also show the Tyndall effect if the light source is bright enough',
        ],
        correct_index: 2,
        explanation: 'The Tyndall test is reliable: if a mixture clearly shows the effect, it almost certainly has colloidal particles. However, the colloid–suspension boundary (~1000 nm) is not perfectly sharp, so very fine suspensions can scatter weakly. More importantly: a true solution (< 1 nm particles) absolutely cannot show the Tyndall effect — particles are physically too small to interact with visible light wavelengths.',
        reasoning_level: 3,
      },
    ],
  },

  // ── p72: Concentration of Solutions ────────────────────────────────────────
  {
    _id: 'ddab1374-23ee-4841-8b1a-5833cd592021',
    label: 'p72 Concentration of Solutions',
    rp: {
      reasoning_type: 'quantitative',
      prompt: 'A student prepares a "10% salt solution" by dissolving 10 g of salt in 100 g of water. Her classmate says she made a mistake — a correct 10% solution needs 10 g in only 90 g of water. Who is right?',
      options: [
        'The student is right — 10 g in 100 g of water is clearly a 10% solution',
        'The classmate is right — 10 g in 90 g of water gives a total solution mass of 100 g, making the concentration exactly (10/100) × 100 = 10%',
        'Both are wrong — concentration is always measured as volume/volume',
        'Both are right — there are two valid ways to prepare a 10% solution',
      ],
      correct_index: 1,
      reveal: 'Mass percentage = (mass of solute ÷ mass of solution) × 100. Mass of solution = mass of solute + mass of solvent. The student dissolved 10 g in 100 g water → total solution = 110 g → concentration = (10 ÷ 110) × 100 ≈ 9.1%, not 10%. The classmate\'s method — 10 g solute + 90 g water = 100 g solution — gives exactly (10 ÷ 100) × 100 = 10%. The common error is treating the mass of solvent as the mass of solution.',
      difficulty_level: 2,
    },
    quiz: [
      {
        question: 'Which formula correctly defines mass percentage (w/w%) of a solute in a solution?',
        options: [
          '(Mass of solvent ÷ Mass of solute) × 100',
          '(Mass of solute ÷ Volume of solution) × 100',
          '(Mass of solute ÷ Mass of solution) × 100',
          '(Volume of solute ÷ Volume of solution) × 100',
        ],
        correct_index: 2,
        explanation: 'Mass/mass percentage = (mass of solute ÷ mass of solution) × 100. Mass of solution = mass of solute + mass of solvent. This is distinct from mass/volume % (used in some lab contexts) where mass is divided by volume of solution.',
        reasoning_level: 1,
      },
      {
        question: 'A student dissolves 5 g of sugar in 95 g of water. What is the mass percentage of sugar in the solution?',
        options: ['5%', '5.26%', '4.76%', '10%'],
        correct_index: 0,
        explanation: 'Total mass of solution = 5 g (sugar) + 95 g (water) = 100 g. Mass % = (5 ÷ 100) × 100 = 5%. This example was deliberately designed with 5 g + 95 g = 100 g total, making the arithmetic direct.',
        reasoning_level: 2,
      },
      {
        question: 'Two students both claim to prepare a "20% copper sulphate solution." Student A dissolves 20 g in 80 g of water. Student B dissolves 20 g in 100 g of water. Which prepared the correct 20% solution, and why is the other wrong?',
        options: [
          'Student B — 20 g in 100 g of water is obviously a 20% solution',
          'Student A — 20 g of solute in 80 g of solvent gives 100 g total solution; (20 ÷ 100) × 100 = 20% exactly',
          'Both are correct — 20% can be calculated either way',
          'Neither — to make 20% you must measure volume, not mass',
        ],
        correct_index: 1,
        explanation: 'Student A: 20 g + 80 g = 100 g solution → 20%. Student B: 20 g + 100 g = 120 g solution → (20 ÷ 120) × 100 = 16.7%. The classic mistake is adding solute to 100 g of water, which makes the mass of solution 100 + solute, not 100. The denominator in mass % is mass of solution, not mass of solvent.',
        reasoning_level: 3,
      },
    ],
  },

  // ── p73: Solubility and Temperature ────────────────────────────────────────
  {
    _id: '86c68129-9c04-406e-8f0f-486a8a6dd870',
    label: 'p73 Solubility and Temperature',
    rp: {
      reasoning_type: 'logical',
      prompt: 'In summer, rivers become warmer. A fisherman notices fewer fish near the surface. He thinks fish prefer shade. A scientist says the real reason is oxygen levels. Who has the more scientifically sound explanation?',
      options: [
        'The fisherman — fish instinctively avoid sunlight and heat in summer',
        'The scientist — warm water holds less dissolved oxygen because gas solubility decreases with temperature, so fish move to cooler, deeper water where oxygen levels are higher',
        'Both explanations are equally valid',
        'Neither — fish move because food availability near the surface changes in summer',
      ],
      correct_index: 1,
      reveal: 'The solubility of gases in liquids decreases as temperature increases — opposite to most solids. Warm surface water holds less dissolved O₂ than cold deep water. Fish, which extract oxygen from water through gills, move to deeper, cooler layers when surface oxygen drops. The fisherman\'s shade explanation might partially hold (fish avoid UV), but the oxygen-solubility explanation is the primary scientific mechanism.',
      difficulty_level: 3,
    },
    quiz: [
      {
        question: 'As temperature increases, what generally happens to the solubility of a solid solute (like sugar or potassium nitrate) in water?',
        options: [
          'Solubility decreases',
          'Solubility remains constant',
          'Solubility increases',
          'Solubility first increases, then suddenly decreases',
        ],
        correct_index: 2,
        explanation: 'For most solid solutes, dissolving is endothermic — heat energy helps break the crystal lattice. Higher temperature means more energy available → more solute can dissolve → higher solubility. This is why sugar dissolves faster and in greater quantity in hot tea than in cold water.',
        reasoning_level: 1,
      },
      {
        question: 'A cool bottle of soda is opened gently with a soft "pfft." A warm bottle of the same soda, opened the same way, erupts violently. Why?',
        options: [
          'Warm soda contains more CO₂ injected during bottling',
          'At higher temperatures, the solubility of CO₂ (a gas) in the liquid is lower, so more gas is already trying to escape — opening the bottle releases pressure and the excess CO₂ escapes violently',
          'The warm bottle has higher pressure due to heat expansion of the glass',
          'Sugar dissolved in warm soda reacts with CO₂ to release extra gas',
        ],
        correct_index: 1,
        explanation: 'Gas solubility decreases with increasing temperature — the opposite of most solids. Cold soda keeps CO₂ comfortably dissolved under pressure. In the warm bottle, CO₂ solubility is already near its lower limit at that temperature; when the cap is removed and pressure drops, the excess dissolved CO₂ escapes rapidly and violently.',
        reasoning_level: 2,
      },
      {
        question: 'A student prepares a saturated KNO₃ solution at 40°C. Without adding more solid, she heats the solution to 80°C. She claims the solution is now unsaturated. Is she right?',
        options: [
          'No — once saturated, a solution stays saturated regardless of temperature',
          'Yes — at 80°C the solubility limit is much higher, so the same dissolved amount represents an unsaturated solution at the new temperature',
          'Yes — but only because KNO₃ reacts with water at 80°C, consuming some dissolved salt',
          'No — she would need to add more solute to change its saturation status',
        ],
        correct_index: 1,
        explanation: 'Saturation is always relative to the solubility at a specific temperature. If KNO₃ saturates at 50 g per 100 mL at 40°C, and solubility jumps to 170 g per 100 mL at 80°C, then the same 50 g dissolved is far below the new limit — the solution is unsaturated at 80°C. The composition didn\'t change; the saturation threshold did. This is also why cooling a saturated solution causes crystals to form.',
        reasoning_level: 3,
      },
    ],
  },

  // ── p74: Crystallisation ────────────────────────────────────────────────────
  {
    _id: 'a5f6f9c4-3634-4ea3-8430-375f0d546707',
    label: 'p74 Crystallisation',
    rp: {
      reasoning_type: 'logical',
      prompt: 'You prepare a saturated copper sulphate solution in hot water and let it cool slowly overnight. Beautiful blue crystals appear. If instead you rapidly evaporated the same solution on high heat, predict what you would get and why it would look different.',
      options: [
        'Both methods give identical large, pure blue crystals',
        'Rapid evaporation would give white powder — heat decomposes copper sulphate',
        'Quick evaporation gives a crust of small, impure crystals because ions are forced out of solution faster than they can arrange into regular crystal patterns',
        'The crystals would be larger with rapid evaporation because more heat accelerates crystal growth',
      ],
      correct_index: 2,
      reveal: 'Crystal formation is a process of orderly arrangement — ions migrate to the growing crystal face and slot into precise positions in the lattice. Slow cooling gives ions time to find their correct positions, forming large, well-shaped, pure crystals. Rapid evaporation forces solute out of solution faster than it can organise — producing a polycrystalline crust of small crystals that trap impurities between them. This is exactly why crystallisation (slow cooling) is the preferred purification technique.',
      difficulty_level: 2,
    },
    quiz: [
      {
        question: 'Which of the following best describes how crystallisation purifies a substance?',
        options: [
          'The substance is boiled until all solvent evaporates, leaving behind the pure solid',
          'The solution is filtered to remove dissolved impurities',
          'The substance is dissolved fully in hot solvent, then cooled slowly so pure crystals form — impurities remain in solution',
          'An acid is added to the solution to precipitate the pure substance',
        ],
        correct_index: 2,
        explanation: 'Crystallisation exploits the temperature-dependence of solubility. At high temperature, the solute dissolves completely. On slow cooling, solubility drops and excess solute deposits as well-ordered, pure crystals. Impurities (which are present in small amounts and have different solubility curves) mostly remain dissolved in the mother liquor.',
        reasoning_level: 1,
      },
      {
        question: 'In coastal salt pans, workers allow shallow sea water pools to evaporate slowly under sunlight for days rather than boiling the water. Why does slow solar evaporation give purer salt?',
        options: [
          'Boiling sea water damages the salt chemically',
          'Slow evaporation allows NaCl to crystallise selectively while more soluble impurities (like MgCl₂) remain dissolved in the concentrated residual liquid called bittern',
          'Salt dissolves better in hot water, so boiling prevents crystallisation',
          'Sunlight adds minerals to the salt that boiling destroys',
        ],
        correct_index: 1,
        explanation: 'Different salts have different solubilities. NaCl crystallises out preferentially as water evaporates slowly. The more soluble impurities (MgCl₂, CaCl₂) stay dissolved in the remaining liquid (bittern) until very late in the evaporation — giving a selective crystallisation of purer NaCl. Rapid boiling would crystallise everything together, reducing purity.',
        reasoning_level: 2,
      },
      {
        question: 'A student obtains blue copper sulphate crystals by crystallisation. After drying them strongly at 250°C, they turn white. He concludes: "My crystallisation failed and produced a different compound." Is he right?',
        options: [
          'Yes — blue copper sulphate turning white means a different salt formed',
          'No — blue copper sulphate (CuSO₄·5H₂O) is a hydrated salt; strong heating drives off the five water molecules of crystallisation to give white anhydrous CuSO₄. Adding water reverses this — it turns blue again. Same compound, different hydration state.',
          'Yes — white copper sulphate is contamination by NaCl',
          'No — the crystals turned white because the blue colour was only a surface coating',
        ],
        correct_index: 1,
        explanation: 'Copper sulphate crystallises as the pentahydrate CuSO₄·5H₂O, incorporating 5 water molecules per formula unit into its crystal structure. These are called water of crystallisation. Above ~100°C, these water molecules are expelled, giving white anhydrous CuSO₄. The copper sulphate compound itself is unchanged — this is a reversible process. Adding water to the white powder restores the blue colour.',
        reasoning_level: 3,
      },
    ],
  },

  // ── p75: Distillation ───────────────────────────────────────────────────────
  {
    _id: '05d0b066-35d0-45ab-b155-07074645b151',
    label: 'p75 Distillation',
    rp: {
      reasoning_type: 'logical',
      prompt: 'A student says she can purify drinking water from a salt-water mixture by distillation. A classmate says distillation won\'t work because "salt dissolves in water — you can\'t just boil it out." Who is right, and what is the flaw in the classmate\'s reasoning?',
      options: [
        'The classmate is right — distillation cannot separate a dissolved solid from water',
        'The student is right — salt does not vaporise at 100°C; only water vapour rises and condenses, leaving salt behind in the flask',
        'Both are right — you need a special type of distillation called steam distillation for this',
        'The student is wrong — distillation only separates two liquids, never a solid dissolved in liquid',
      ],
      correct_index: 1,
      reveal: 'Distillation works on boiling point differences. Water boils at 100°C; sodium chloride does not vaporise until above 1413°C. When salt water is heated to 100°C, water converts to vapour and rises into the condenser while salt stays in the flask. The classmate confused "dissolves in water" with "boils at the same temperature as water" — these are completely different properties.',
      difficulty_level: 2,
    },
    quiz: [
      {
        question: 'Distillation is most useful for separating:',
        options: [
          'Insoluble solids from liquids',
          'Two immiscible liquids like oil and water',
          'Miscible liquids with sufficiently different boiling points',
          'Coloured dyes from a mixture',
        ],
        correct_index: 2,
        explanation: 'Distillation exploits differences in boiling point. It is specifically designed for miscible (mutually soluble) liquid mixtures. Insoluble solids are removed by filtration; immiscible liquids separate by standing or a separating funnel; dyes are separated by chromatography.',
        reasoning_level: 1,
      },
      {
        question: 'Acetone boils at 56°C and water boils at 100°C. A student heats an acetone-water mixture slowly and collects the distillate. At approximately what temperature should she start collecting to get mostly pure acetone?',
        options: [
          'At 100°C — water must evaporate first as the solvent',
          'Around 56°C — acetone has the lower boiling point and vaporises preferentially at this temperature',
          'At any temperature between 56°C and 100°C — the mixture boils throughout this range',
          'At 78°C — the mathematical average of the two boiling points',
        ],
        correct_index: 1,
        explanation: 'In distillation, the component with the lower boiling point vaporises preferentially. Collecting distillate when the thermometer reads near 56°C yields mostly acetone. As acetone depletes, the temperature climbs toward 100°C and water dominates the distillate. This is why watching the thermometer is essential during distillation.',
        reasoning_level: 2,
      },
      {
        question: 'A student distils a mixture of ethanol (bp 78°C) and water (bp 100°C) but finds the collected ethanol still contains some water. A classmate says: "Simple distillation always gives pure fractions — you must have made an error." Is the classmate right?',
        options: [
          'Yes — simple distillation always yields perfectly pure components if done correctly',
          'No — ethanol and water form an azeotrope (constant-boiling mixture) at ~95.6% ethanol; simple distillation can concentrate ethanol significantly but cannot achieve 100% purity without additional techniques',
          'Yes, but only if the thermometer is placed incorrectly',
          'No — water boils before ethanol, so water always contaminates the ethanol fraction',
        ],
        correct_index: 1,
        explanation: 'Ethanol and water form a special mixture called an azeotrope that boils at a fixed temperature (78.1°C) and composition (~95.6% ethanol). At this point, both components vaporise in the same ratio as the liquid — no further enrichment is possible by simple boiling. Industrial "absolute alcohol" (100% ethanol) requires molecular sieves or other advanced techniques beyond simple distillation.',
        reasoning_level: 3,
      },
    ],
  },
];

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const col = db.collection('book_pages');

  console.log('=== Ch5 Class 9 Upgrade — Part 1 (p68–p75) ===\n');

  for (const pg of PAGES) {
    const page = await col.findOne({ _id: pg._id });
    if (!page) { console.error(pg.label + ': NOT FOUND'); continue; }

    // 1. Check if reasoning_prompt already added
    const hasRP = page.blocks.some(b => b.type === 'reasoning_prompt');
    if (hasRP) {
      console.log(pg.label + ': reasoning_prompt already present — skipping RP insert');
    } else {
      // Shift all existing block orders up by 1
      const shifted = page.blocks.map(b => ({ ...b, order: b.order + 1 }));
      // Build new reasoning_prompt block at order 0
      const rpBlock = {
        id: uuidv4(),
        type: 'reasoning_prompt',
        order: 0,
        ...pg.rp,
      };
      page.blocks = [rpBlock, ...shifted];
    }

    // 2. Replace inline_quiz with Class 9 version
    const quizIdx = page.blocks.findIndex(b => b.type === 'inline_quiz');
    const newQuizQuestions = pg.quiz.map(q => ({ id: uuidv4(), ...q }));
    if (quizIdx !== -1) {
      page.blocks[quizIdx] = {
        ...page.blocks[quizIdx],
        pass_threshold: 0.67,
        questions: newQuizQuestions,
      };
    } else {
      // No quiz exists — append one
      const maxOrder = Math.max(...page.blocks.map(b => b.order));
      page.blocks.push({
        id: uuidv4(),
        type: 'inline_quiz',
        order: maxOrder + 1,
        pass_threshold: 0.67,
        questions: newQuizQuestions,
      });
    }

    await col.updateOne({ _id: pg._id }, { $set: { blocks: page.blocks, updated_at: new Date() } });
    console.log(pg.label + ': ✓ updated');
  }

  await client.close();
  console.log('\nPart 1 done.');
}

run().catch(err => { console.error(err); process.exit(1); });
