'use strict';
/**
 * Class 9 Chapter 5 — Mixtures & Separation
 * Part 2: Pages 76–83 (Chromatography → Artificial Blood)
 */
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const BOOK_ID = '69fbc73e-8f2c-4cf2-a678-c9fd41a1e706';

const PAGES = [
  // ── p76: Paper Chromatography ───────────────────────────────────────────────
  {
    _id: '59e4fb04-61c9-4b27-8ee9-3fa0e00192a0',
    label: 'p76 Paper Chromatography',
    rp: {
      reasoning_type: 'logical',
      prompt: 'A student runs paper chromatography on a black water-colour marker and a black permanent marker using water as the solvent. The water-colour ink separates into blue, red, and yellow spots. The permanent marker shows only one black spot that barely moves from the baseline. Why does the permanent marker behave differently?',
      options: [
        'Permanent markers contain more pigments, which is why they all stay together',
        'Permanent markers use water-insoluble, alcohol-based dyes — they don\'t dissolve in water and therefore can\'t travel up with the water front. You\'d need an alcohol-based solvent to separate them',
        'The permanent marker is not a mixture; it contains only one dye',
        'Paper has a higher affinity for permanent marker ink, holding it at the baseline',
      ],
      correct_index: 1,
      reveal: 'Chromatography depends on the mobile phase carrying solute molecules up the paper. If the dye doesn\'t dissolve in the chosen solvent, it cannot migrate — it stays at the baseline. Permanent markers are designed to be water-resistant (hence "permanent"), using resins and alcohol-soluble dyes. The choice of solvent is the critical variable in chromatography — a non-polar or alcohol-based solvent would successfully separate permanent marker pigments.',
      difficulty_level: 2,
    },
    quiz: [
      {
        question: 'In paper chromatography, the Rf value of a substance is calculated as:',
        options: [
          'Distance moved by solvent ÷ Distance moved by solute',
          'Distance moved by solute ÷ Distance moved by solvent front',
          'Mass of solute ÷ Mass of solvent',
          'Height of paper ÷ Distance moved by solute',
        ],
        correct_index: 1,
        explanation: 'Rf (Retention factor) = distance moved by the substance ÷ distance moved by the solvent front. Rf is always between 0 (substance doesn\'t move) and 1 (substance moves exactly as far as the solvent). A high Rf means the substance prefers the mobile phase (solvent) over the stationary phase (paper).',
        reasoning_level: 1,
      },
      {
        question: 'A student runs leaf extract on paper chromatography. Four spots appear at 2 cm, 4 cm, 6 cm, and 8 cm from the baseline. The solvent front reached 10 cm. Which pigment has the strongest affinity for the stationary phase (paper)?',
        options: [
          'The spot at 8 cm (Rf = 0.8)',
          'The spot at 6 cm (Rf = 0.6)',
          'The spot at 4 cm (Rf = 0.4)',
          'The spot at 2 cm (Rf = 0.2)',
        ],
        correct_index: 3,
        explanation: 'Rf = distance moved ÷ 10 cm. The spot at 2 cm has Rf = 0.2 — it moved the least, meaning it was most strongly held by the stationary phase (paper) and least carried forward by the mobile phase. Low Rf = high affinity for stationary phase.',
        reasoning_level: 2,
      },
      {
        question: 'Two red food dyes (Red 40 and Red 3) have different Rf values in one solvent system. A student uses this to identify them. Her teacher warns: "Don\'t conclude identity from one Rf measurement alone." Why is a single Rf insufficient for definitive identification?',
        options: [
          'Rf values change if you use a different brand of chromatography paper',
          'Rf is specific to a particular solvent-stationary phase combination; a different solvent might give the same Rf for two compounds that co-migrated in the first system. Only matching Rf in multiple solvent systems gives reliable identification',
          'Two compounds can never have the same Rf value, so the test always works',
          'Rf values are only reliable for colourless compounds — coloured dyes always give false readings',
        ],
        correct_index: 1,
        explanation: 'Rf depends on how a compound partitions between mobile phase and stationary phase — and this changes with different solvents. Two different compounds might travel identical distances in Solvent A (same Rf) yet separate clearly in Solvent B. Matching Rf across multiple solvent systems, or co-spotting with a known standard on the same plate, provides much stronger evidence of identity. This is standard practice in forensic and pharmaceutical labs.',
        reasoning_level: 3,
      },
    ],
  },

  // ── p77: Sublimation ────────────────────────────────────────────────────────
  {
    _id: '7e09cfd6-d6b1-414a-bfda-eec665bb6f53',
    label: 'p77 Sublimation',
    rp: {
      reasoning_type: 'logical',
      prompt: 'You put naphthalene (mothball) tablets in a wooden wardrobe to keep insects away. After six months, the tablets are completely gone — but the wardrobe floor is perfectly dry. Your younger sibling asks: "Where did they go? Did they melt away?" How would you explain what happened?',
      options: [
        'The naphthalene dissolved into the wood fibres over time',
        'The naphthalene went through sublimation — it converted directly from solid to vapour without ever becoming liquid. That is why there is no wet residue on the floor',
        'The naphthalene slowly evaporated like water — all substances eventually evaporate',
        'The insects consumed the naphthalene tablets gradually',
      ],
      correct_index: 1,
      reveal: 'Naphthalene is a classic example of a sublimable substance. At room temperature, it has a measurable vapour pressure — solid naphthalene converts directly to vapour without passing through the liquid state. The vapour slowly diffuses out of the wardrobe over months. The completely dry wardrobe floor is the key evidence: melting would leave a liquid puddle first. Sublimation skips the liquid phase entirely.',
      difficulty_level: 1,
    },
    quiz: [
      {
        question: 'Sublimation is the process where a substance changes directly from:',
        options: [
          'Liquid to gas',
          'Solid to liquid',
          'Gas to solid (deposition)',
          'Solid to gas without passing through the liquid state',
        ],
        correct_index: 3,
        explanation: 'Sublimation is the direct phase transition from solid to vapour (gas), bypassing the liquid phase entirely. The reverse — gas to solid directly — is called deposition or reverse sublimation. Dry ice (solid CO₂) sublimates at room temperature; naphthalene, camphor, and iodine also sublime readily.',
        reasoning_level: 1,
      },
      {
        question: 'A mixture of iodine (sublimable) and sand (non-sublimable) needs to be separated. A student heats the mixture gently in a china dish with an inverted cold funnel on top. What happens and what property of iodine does this exploit?',
        options: [
          'Iodine dissolves in water condensing on the funnel; sand stays behind — exploits solubility',
          'Iodine melts and drips down while sand stays solid — exploits melting point difference',
          'Iodine converts to violet vapour, rises, and deposits as pure solid on the cold funnel surface; sand remains in the dish — exploits iodine\'s ability to sublime',
          'Both iodine and sand vaporise; iodine condenses first because it is heavier',
        ],
        correct_index: 2,
        explanation: 'Iodine sublimates readily on gentle heating, forming a characteristic violet vapour. This vapour rises and condenses back to solid iodine on the cold funnel surface, leaving sand (which does not sublime) entirely behind in the dish. The technique works because iodine\'s vapour pressure is significant at temperatures well below its melting point (113.7°C).',
        reasoning_level: 2,
      },
      {
        question: 'A student argues: "Any solid can be purified by sublimation — just heat it up enough." What is wrong with this generalisation?',
        options: [
          'Nothing — all solids will eventually sublime if heated to a high enough temperature',
          'Sublimation works only for substances that have a measurable vapour pressure below their melting point. Most solids melt before subliming. Also, if the impurity sublimates at a similar temperature as the target compound, no purification occurs',
          'Sublimation always carries impurities into the vapour phase, making it useless for purification',
          'The only limitation is finding a cold enough surface to collect the sublimed material',
        ],
        correct_index: 1,
        explanation: 'Sublimation as a purification tool requires: (a) the compound has meaningful vapour pressure below its melting point — i.e., it actually sublimates rather than melting; and (b) the impurities do not sublime at similar temperatures. Iron, NaCl, and most inorganic salts melt at high temperatures without subliming. Only specific compounds — iodine, camphor, naphthalene, ammonium chloride, dry ice — are practically separated by sublimation.',
        reasoning_level: 3,
      },
    ],
  },

  // ── p78: Centrifugation ─────────────────────────────────────────────────────
  {
    _id: '886bde02-890b-49c7-8955-4107cbd49a7b',
    label: 'p78 Centrifugation',
    rp: {
      reasoning_type: 'analogical',
      prompt: 'When a washing machine spins wet clothes at high speed, water flies outward and drains away. A centrifuge separates blood cells from plasma in the same way. What principle makes both work?',
      options: [
        'Heat generated by spinning evaporates the water',
        'During circular motion, denser or heavier things experience a greater outward push, so they move outward faster than less dense things — centrifugal effect',
        'The spinning creates a vacuum that pulls water or denser particles outward',
        'Friction between wet clothes and the drum mechanically squeezes water out',
      ],
      correct_index: 1,
      reveal: 'Both exploit the same principle: during circular motion, the effective outward force (centrifugal effect) acts on every particle in proportion to its mass and density. Denser particles experience a stronger outward push and move outward fastest. In a washing machine, water (denser than air in the drum) is pushed outward through holes. In a centrifuge, denser blood cells are pushed to the bottom of the tube while less dense plasma stays above. The spinning merely amplifies what gravity alone would do — but hundreds of times faster.',
      difficulty_level: 2,
    },
    quiz: [
      {
        question: 'Centrifugation is used to separate which type of mixture?',
        options: [
          'Two miscible liquids with different boiling points',
          'Soluble substances from their solution by evaporation',
          'Colloidal or finely suspended particles that are too small to settle quickly by gravity, by spinning them at high speed',
          'Coloured dyes based on their affinity for a stationary phase',
        ],
        correct_index: 2,
        explanation: 'Centrifugation applies a strong centrifugal force that accelerates sedimentation of denser particles. Particles too fine to settle meaningfully by gravity (blood cells, cream in milk) settle in minutes under centrifugation. Examples: separating cream from milk, blood cells from plasma, bacteria from culture media.',
        reasoning_level: 1,
      },
      {
        question: 'A nurse needs to separate blood plasma from blood cells quickly. Both a centrifuge and a stationary test tube are available. Why is the centrifuge preferred?',
        options: [
          'Gravity settling damages blood cells; centrifugation does not',
          'Gravity settling takes several hours and may be incomplete for small cells; the centrifuge applies a force hundreds of times stronger than gravity, separating cells from plasma in minutes',
          'The centrifuge heats the blood, making it easier to separate',
          'Gravity would also separate proteins within the plasma, which is undesirable',
        ],
        correct_index: 1,
        explanation: 'Red blood cells (density ≈ 1.09 g/mL) are only slightly denser than plasma (density ≈ 1.03 g/mL). Under normal gravity, they settle very slowly. A centrifuge spinning at 3000 rpm generates a centrifugal force hundreds or thousands of times stronger than gravity, packing cells to the bottom in minutes. Time and completeness of separation are the centrifuge\'s key advantages.',
        reasoning_level: 2,
      },
      {
        question: 'Cream naturally rises to the top of fresh whole milk over several hours. A dairy uses a centrifuge to achieve the same result in seconds. A student says: "The principles must be different — the centrifuge uses a completely different mechanism." Is the student right?',
        options: [
          'Yes — cream rises due to surface tension in still milk, but centrifugation uses a completely different mechanism',
          'No — both rely on the density difference between cream (fat, lower density) and skim milk. Gravity causes slow natural separation; the centrifuge amplifies this force enormously, making the same separation thousands of times faster. Same principle, different magnitude.',
          'Yes — the centrifuge reverses the direction of separation; it pushes cream outward, not upward',
          'No — both use exactly the same separation speed; the centrifuge just spins for a shorter time',
        ],
        correct_index: 1,
        explanation: 'The underlying principle is identical: density difference. Lower-density cream (fat droplets ≈ 0.9 g/mL) floats relative to denser skim milk. Natural gravity separates them slowly over hours. The centrifuge creates a much stronger effective gravity field — lower-density cream migrates inward/upward (to the centre-axis in a centrifuge bowl) while denser skim milk goes outward. Same physics, massively amplified force.',
        reasoning_level: 3,
      },
    ],
  },

  // ── p79: Coagulation ────────────────────────────────────────────────────────
  {
    _id: 'eb9ef9cd-1134-4037-b142-8b4214e8eb81',
    label: 'p79 Coagulation',
    rp: {
      reasoning_type: 'analogical',
      prompt: 'When a river carrying muddy water meets the sea, a delta forms — mud deposits at the river mouth. Alum added to muddy drinking water also makes mud settle. A student asks: "Are these two events connected by the same principle?" How would you explain the connection?',
      options: [
        'They are completely different — sea salt is a food; alum is a chemical treatment used in water purification',
        'Both involve electrolytes causing colloidal mud particles to lose their electrical charge and clump together: sea water\'s dissolved ions and alum\'s highly charged Al³⁺ ions both coagulate colloidal clay in different settings',
        'The sea has a higher temperature that causes mud to sink when rivers meet it',
        'Both river water and alum have the same pH, which triggers settling',
      ],
      correct_index: 1,
      reveal: 'Colloidal clay particles in river water carry negative surface charges that keep them repelling each other and staying dispersed. When the river meets the electrolyte-rich sea, dissolved ions neutralise these surface charges — the clay particles can now clump together (coagulate) and sink, forming a delta over centuries. Alum works identically: Al³⁺ ions (with a high positive charge) are exceptionally effective at neutralising the negative clay charges in drinking water, causing rapid flocculation.',
      difficulty_level: 3,
    },
    quiz: [
      {
        question: 'Coagulation refers to:',
        options: [
          'The formation of a colloid from a true solution',
          'The scattering of light by colloidal particles (Tyndall effect)',
          'The aggregation and precipitation of colloidal particles triggered by adding electrolytes',
          'The separation of two immiscible liquids by density difference',
        ],
        correct_index: 2,
        explanation: 'Colloidal particles carry like charges that keep them repelling and dispersed. Adding electrolytes (ions) neutralises these surface charges, allowing particles to approach, aggregate (coagulate), and settle out as a precipitate. This is the basis of both water treatment (alum) and natural delta formation.',
        reasoning_level: 1,
      },
      {
        question: 'In water treatment plants, alum (KAl(SO₄)₂·12H₂O) is added to river water before filtration. Why is alum effective at this step?',
        options: [
          'Alum dissolves mud particles chemically, destroying them',
          'Alum raises the temperature of the water, causing mud to sink faster',
          'Alum releases Al³⁺ ions, which are highly charged and very effective at neutralising the negative charge on colloidal clay particles, causing them to clump into large flocs that can be filtered out',
          'Alum kills bacteria in the water, which would otherwise prevent mud from settling',
        ],
        correct_index: 2,
        explanation: 'Colloidal clay particles in river water carry negative surface charges. Al³⁺ (3+ charge) is far more effective than Na⁺ (1+) or Ca²⁺ (2+) at neutralising these charges — this is the Hardy-Schulze principle. Once charges are neutralised, particles aggregate into large, visible flocs that settle quickly and can be removed by filtration, making the water clear.',
        reasoning_level: 2,
      },
      {
        question: 'A student mixes muddy river water with salt water in a tray to simulate delta formation but is disappointed — only a little mud settles and it looks nothing like a real delta. Why can\'t the Ganga-Brahmaputra delta be reproduced in a tray in minutes?',
        options: [
          'The lab experiment used the wrong type of clay',
          'Real delta formation involves not just coagulation but also centuries of sediment deposition, the mechanical force of flowing water, biological cementing by plant roots, and gradual changes in the river\'s course — coagulation is only one factor among many',
          'Salt water cannot coagulate clay; only alum works',
          'The student needs to heat the mixture to replicate the natural river environment',
        ],
        correct_index: 1,
        explanation: 'Coagulation is the chemical mechanism that initiates delta formation when colloidal clay meets sea salt. But a real delta forms over thousands of years through the combined action of enormous sediment volumes, water flow patterns, biological activity (mangrove roots cement sediment), and gradual seaward progradation of the river. A lab demo demonstrates the coagulation principle, not the full geological process.',
        reasoning_level: 3,
      },
    ],
  },

  // ── p80: Choosing the Right Separation Method ───────────────────────────────
  {
    _id: '13eabe3c-7ad3-44bc-8517-acb491254ec4',
    label: 'p80 Choosing the Right Separation Method',
    rp: {
      reasoning_type: 'logical',
      prompt: 'A student has a cup of tea (liquid tea + dissolved sugar + tea leaves). She wants to separate all three. A classmate says: "Just filter it — done." What is the flaw in this plan, and what additional step is needed?',
      options: [
        'Filtering works perfectly — all three are separated in one step',
        'Filtering removes the tea leaves, but dissolved sugar passes through the filter paper. An additional evaporation or crystallisation step is needed to recover the sugar from the liquid',
        'Filtering removes both tea leaves and dissolved sugar together',
        'Sugar and tea leaves can only be separated from each other by chromatography',
      ],
      correct_index: 1,
      reveal: 'Filtration separates only particles that are physically too large to pass through — the tea leaves stay on the filter paper. Sugar molecules are dissolved at the molecular level and pass straight through with the liquid. To recover the sugar, you must evaporate the filtrate (or crystallise it). Every separation method targets one specific property difference; no single method handles all components in a complex mixture.',
      difficulty_level: 2,
    },
    quiz: [
      {
        question: 'Which separation method uses the difference in ability to convert directly from solid to vapour?',
        options: ['Distillation', 'Centrifugation', 'Sublimation', 'Filtration'],
        correct_index: 2,
        explanation: 'Sublimation exploits the property that certain substances (camphor, iodine, naphthalene, ammonium chloride) convert directly from solid to gas. These are separated from non-sublimable substances by gentle heating — the sublimable component vaporises and is collected on a cold surface.',
        reasoning_level: 1,
      },
      {
        question: 'You have a mixture of iron filings, common salt, and sand. Describe the correct sequence of operations to completely separate all three components.',
        options: [
          'Filtration → distillation → crystallisation',
          'Use a magnet to remove iron filings, then dissolve the salt-sand mixture in water and filter (sand stays on filter paper), then evaporate the filtrate to recover the salt',
          'Centrifugation → chromatography → sublimation',
          'Add water — all three dissolve — then evaporate to recover all three',
        ],
        correct_index: 1,
        explanation: 'Iron is magnetic: remove with a magnet. Sand is insoluble in water; salt is soluble: dissolve in water, filter (sand retained, salt passes through), then evaporate the filtrate to recover salt as crystals. Each step exploits a different property — magnetic nature, then solubility difference.',
        reasoning_level: 2,
      },
      {
        question: 'Two liquids are completely miscible and have boiling points only 3°C apart. A student chooses simple distillation. A classmate says she needs a fractionating column instead. Who is right and why?',
        options: [
          'The student is right — simple distillation always separates any two miscible liquids',
          'The classmate is right — when boiling points are very close (within ~25°C), both components vaporise in nearly equal proportions; simple distillation cannot separate them. Multiple condensation-vaporisation steps (fractional distillation) are required',
          'Neither — liquids with boiling points that close cannot be separated by any distillation method',
          'The student is right, but the separation will take much longer than usual',
        ],
        correct_index: 1,
        explanation: 'Simple distillation works when one component has a significantly lower vapour pressure (and boiling point) than the other — so it preferentially enriches the vapour phase. When boiling points differ by only ~3°C, both have nearly identical vapour pressures; vapour composition is barely different from liquid composition. Each distillation step achieves negligible separation. A fractionating column provides many sequential equilibration stages (theoretical plates), each enriching the vapour in the more volatile component.',
        reasoning_level: 3,
      },
    ],
  },

  // ── p81: Lab Safety — no reasoning_prompt (procedural page) ─────────────────
  // Skipped intentionally

  // ── p82: India's Contribution — The ORS Story ──────────────────────────────
  {
    _id: 'fc55b33e-116a-4065-862a-7bc609f3581f',
    label: 'p82 India\'s Contribution — ORS Story',
    rp: {
      reasoning_type: 'logical',
      prompt: 'When severely dehydrated, drinking plain water alone is often insufficient to recover quickly — the body continues losing fluids. But ORS (glucose + sodium chloride + potassium chloride + water) works far better. A student asks: "What does adding salt do — doesn\'t salt make you more thirsty?" How would you answer?',
      options: [
        'Salts make ORS taste better, so patients drink more',
        'In the small intestine, glucose and sodium are absorbed together via a cotransport protein — glucose acts as a carrier that actively pulls sodium (and water following it osmotically) into the bloodstream. Plain water lacks this mechanism',
        'Salts purify the water by killing bacteria in the gut',
        'Salts increase the boiling point of ORS, making it safer to sterilise before drinking',
      ],
      correct_index: 1,
      reveal: 'The key is active cotransport: the SGLT1 protein in the gut wall simultaneously transports glucose and sodium from the intestine into the blood. Water follows osmotically. This mechanism is highly efficient. Plain water absorbs passively and slowly; the glucose-sodium pair triggers active, rapid absorption. ORS was one of the most significant medical advances of the 20th century — a carefully measured teaspoon of glucose and salts in water has saved millions of lives at near-zero cost.',
      difficulty_level: 3,
    },
    quiz: [
      {
        question: 'What does ORS stand for, and what is its primary medical use?',
        options: [
          'Organic Rehydration Solution; used after surgery',
          'Oral Rehydration Solution; used to treat dehydration caused by diarrhoea and vomiting',
          'Oral Rehydration Supplement; used as a daily vitamin supplement',
          'Organic Rehydration Supplement; used by athletes during sport',
        ],
        correct_index: 1,
        explanation: 'ORS — Oral Rehydration Solution — is a carefully formulated mixture of glucose, sodium chloride, potassium chloride, and water. It treats dehydration from diarrhoea, cholera, and vomiting by exploiting the glucose-sodium cotransport mechanism in the intestinal wall to rapidly restore fluids and electrolytes.',
        reasoning_level: 1,
      },
      {
        question: 'A health worker explains that home ORS needs water, sugar, AND a pinch of salt. A parent asks: "Why can\'t we just give the child sugar water — why must we add salt?" What is the correct explanation?',
        options: [
          'Salt makes the solution taste better so the child drinks more',
          'Both glucose and sodium must be present for the intestinal cotransport mechanism to work — without sodium, glucose absorption is much slower and water absorption is poor',
          'The salt kills bacteria in the water, making it safe to drink',
          'Sugar without salt causes an allergic reaction in dehydrated children',
        ],
        correct_index: 1,
        explanation: 'The SGLT1 transport protein carries glucose and sodium simultaneously across the intestinal wall. Neither works as efficiently alone. Water follows the absorbed solutes by osmosis, rehydrating the body far faster than plain water or plain sugar water. The specific composition of ORS is based on this biochemistry — not on taste or safety.',
        reasoning_level: 2,
      },
      {
        question: 'Some parents refuse to give ORS to their dehydrated child, saying "salty things cause dehydration." Why is this belief chemically misplaced and potentially dangerous?',
        options: [
          'The concern is valid — ORS can cause dehydration if the child already has kidney disease',
          'The concern is misplaced: ORS is formulated at an osmolarity (~245 mOsm/L) close to blood plasma, so it does not cause net water loss. The glucose–sodium cotransport actively drives net water absorption into the blood — the opposite of dehydration',
          'Salt in ORS is genuinely dangerous, which is why modern ORS has eliminated sodium',
          'The concern is valid — ORS should only be administered under medical supervision',
        ],
        correct_index: 1,
        explanation: 'The parent is right that concentrated salt (like eating dry salt or drinking sea water) pulls water out of cells by osmosis — causing dehydration. But ORS is dilute — its osmolarity is matched to blood (~300 mOsm/L). At this dilution, sodium does not draw water out; instead, the glucose-sodium cotransport mechanism drives net absorption inward. Withholding ORS due to this misunderstanding has cost lives in communities where diarrhoeal disease is common.',
        reasoning_level: 3,
      },
    ],
  },

  // ── p83: Frontier Question — Can We Create Artificial Blood? ────────────────
  {
    _id: '6aea62b2-69ca-4036-9ba6-31d93f9d535d',
    label: 'p83 Frontier — Artificial Blood',
    rp: {
      reasoning_type: 'analogical',
      prompt: 'A fish extracts dissolved oxygen from water through gills. A human extracts oxygen from air through lungs. Both need oxygen to power their cells. A scientist working on artificial blood says: "We need a liquid that carries oxygen the same way haemoglobin does." What properties would that liquid absolutely need?',
      options: [
        'It needs to be red — like blood — to signal it carries oxygen',
        'It must reversibly bind oxygen (pick it up where O₂ is high, release it where O₂ is low), be non-toxic to the body, and be miscible with blood plasma',
        'It just needs to be thicker than water so it can be pumped through blood vessels like real blood',
        'It needs to have the same density as blood so it does not separate into layers',
      ],
      correct_index: 1,
      reveal: 'The critical word is reversible. Haemoglobin binds oxygen cooperatively — loading efficiently in the lungs (high pO₂) and unloading in tissues (low pO₂). A synthetic oxygen carrier must mimic this without destroying the oxygen or holding it too tightly. Perfluorocarbon (PFC) compounds dissolve large amounts of oxygen physically (not chemically) and release it as pO₂ drops — same loading/unloading logic, different chemistry.',
      difficulty_level: 3,
    },
    quiz: [
      {
        question: 'Which component of real blood is responsible for carrying oxygen to body cells?',
        options: ['White blood cells', 'Blood plasma', 'Platelets', 'Haemoglobin in red blood cells'],
        correct_index: 3,
        explanation: 'Haemoglobin is an iron-containing protein packed inside red blood cells. Each haemoglobin molecule carries up to 4 oxygen molecules, binding them in the oxygen-rich lungs and releasing them in oxygen-depleted tissues. Without haemoglobin, blood would carry only about 3% of the oxygen it currently transports.',
        reasoning_level: 1,
      },
      {
        question: 'Scientists process perfluorocarbon (PFC) — a liquid that dissolves oxygen well but does not mix with water — into tiny submicron droplets suspended in saline. What type of mixture have they created, and why is this form necessary?',
        options: [
          'A solution — they dissolved the PFC in water',
          'An emulsion (liquid-in-liquid colloid) — PFC is made into submicron droplets so it can flow through blood vessels and capillaries to reach tissues, rather than separating as a visible immiscible layer',
          'A suspension — large PFC particles are kept floating in saline',
          'A pure substance — the saline and PFC react to form a new compound',
        ],
        correct_index: 1,
        explanation: 'PFC is non-polar and completely immiscible with water. By emulsifying it into tiny droplets (~100–200 nm, colloidal scale), researchers create a stable liquid that can flow through blood vessels, pass through capillaries, and release oxygen to tissues — without coagulating or blocking circulation. This is colloid science applied directly to medicine.',
        reasoning_level: 2,
      },
      {
        question: 'A student says: "If artificial blood can carry oxygen, hospitals should replace real blood donations entirely — no more blood banks needed." What key limitations of current artificial blood make this impossible today?',
        options: [
          'Artificial blood is too expensive to manufacture in large quantities',
          'Current artificial blood substitutes carry only oxygen — real blood also transports CO₂, immune cells, clotting factors, hormones, and performs dozens of other functions that are far beyond what any current substitute can replicate',
          'Artificial blood would be rejected by the immune system like a transplanted organ',
          'The real limitation is colour — patients and doctors prefer blood to be red',
        ],
        correct_index: 1,
        explanation: 'Blood is extraordinarily complex — far more than an oxygen delivery system. Real blood contains platelets (clotting), white blood cells (immunity), plasma proteins (antibodies, hormones, transport molecules), and performs complex biochemical signalling. Current oxygen carriers address only one of blood\'s dozens of functions. They can supplement in specific crises (trauma surgery when type-matched blood is unavailable) but cannot replace the full biological system. This remains an open frontier in biomedical engineering.',
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

  console.log('=== Ch5 Class 9 Upgrade — Part 2 (p76–p83, skipping p81) ===\n');

  for (const pg of PAGES) {
    const page = await col.findOne({ _id: pg._id });
    if (!page) { console.error(pg.label + ': NOT FOUND'); continue; }

    const hasRP = page.blocks.some(b => b.type === 'reasoning_prompt');
    if (hasRP) {
      console.log(pg.label + ': reasoning_prompt already present — skipping RP insert');
    } else {
      const shifted = page.blocks.map(b => ({ ...b, order: b.order + 1 }));
      const rpBlock = {
        id: uuidv4(),
        type: 'reasoning_prompt',
        order: 0,
        ...pg.rp,
      };
      page.blocks = [rpBlock, ...shifted];
    }

    const quizIdx = page.blocks.findIndex(b => b.type === 'inline_quiz');
    const newQuizQuestions = pg.quiz.map(q => ({ id: uuidv4(), ...q }));
    if (quizIdx !== -1) {
      page.blocks[quizIdx] = {
        ...page.blocks[quizIdx],
        pass_threshold: 0.67,
        questions: newQuizQuestions,
      };
    } else {
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
  console.log('\nPart 2 done.');
}

run().catch(err => { console.error(err); process.exit(1); });
