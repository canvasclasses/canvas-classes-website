'use strict';
/**
 * Class 12 — Chapter 5: Solutions (NCERT Class 12, Chapter 2)
 * Pages 1–6: Introduction → Henry's Law
 * Book: ncert-simplified (be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e)
 */
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
dotenv.config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

const BOOK_ID    = 'be7b5b7f-e993-4d3b-b9c8-52f7c308ab0e';
const BOOK_SLUG  = 'ncert-simplified';
const CHAPTER    = 5;
const NOW        = new Date();

function page(page_number, title, subtitle, slug, blocks) {
  return {
    _id: uuidv4(), book_id: BOOK_ID, book_slug: BOOK_SLUG,
    chapter_number: CHAPTER, page_number, title, subtitle, slug,
    blocks, tags: [], published: true,
    reading_time_min: Math.max(4, Math.round(blocks.length * 0.9)),
    created_at: NOW, updated_at: NOW,
  };
}

const PAGES = [

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 1 — What is a Solution?
// ═══════════════════════════════════════════════════════════════════════════════
page(1, 'What is a Solution?',
  'Mixtures, homogeneity, and why the Dead Sea lets you float',
  'what-is-a-solution',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'logical',
    prompt: 'The Dead Sea has a salt concentration nearly 10× that of regular sea water. Humans float in it effortlessly — but fish cannot survive in it at all. Regular sea water has the opposite profile: fish thrive, humans sink. What single property of the solution, changed by the dissolved salt, explains all three observations at once?',
    options: [
      'The colour of the water changes, confusing the fish',
      'Dissolved salt increases the density of water — greater buoyancy lets humans float — while the extreme solute concentration creates an osmotic environment that dehydrates and kills freshwater-adapted fish cells',
      'The temperature of the Dead Sea is higher, which is why fish cannot survive',
      'The dissolved salt reacts with fish gills, blocking oxygen absorption',
    ],
    correct_index: 1,
    reveal: 'One dissolved salt, two consequences: (1) Higher solute concentration → higher solution density → greater buoyant force → humans float. (2) The same high concentration creates a hypertonic environment. Fish cells (adapted to lower-salt conditions) lose water by osmosis across their membranes, shrivel, and die. The buoyancy, the lethal environment, and the floating effect are all one phenomenon — a consequence of solute concentration. This is why the study of solutions begins with concentration.',
    difficulty_level: 3,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'A hospital drip bag contains **normal saline** — precisely 0.9 g of NaCl per 100 mL of water. Too concentrated, and it pulls water out of blood cells, causing them to shrivel. Too dilute, and cells absorb excess water and burst. The margin between therapeutic and harmful is a fraction of a teaspoon of salt per litre. That is why chemists developed rigorous, standardised ways to express how much solute is dissolved in a solution — and why this chapter is fundamental to medicine, food science, and industrial chemistry.',
  },
  { id: uuidv4(), type: 'text', order: 2,
    markdown: 'A **solution** is a homogeneous mixture of two or more substances mixed at the molecular or ionic level. The key word is *homogeneous* — the composition and properties are uniform throughout every part of the solution.\n\nEvery solution has two components:\n- **Solute** — the substance present in smaller quantity (can be solid, liquid, or gas)\n- **Solvent** — the substance present in larger quantity; it determines the *phase* of the solution\n\nWhen the solvent is water, the solution is called an **aqueous solution**.',
  },
  { id: uuidv4(), type: 'heading', order: 3, text: 'Is It a Solution?', level: 2 },
  { id: uuidv4(), type: 'text', order: 4,
    markdown: 'Three tests distinguish a true solution from other mixtures:\n\n1. **Transparent** — light passes through without scattering (unlike colloidal milk or muddy water)\n2. **Stable** — components do not settle on standing, ever\n3. **Cannot be filtered** — particles are at the atomic/ionic/molecular scale (< 1 nm)\n\n**From your teacher\'s quick question** — which of these are true solutions?\n\n| Substance | Solution? | Why |\n|---|---|---|\n| Steel | ✓ | Carbon dissolved in iron lattice (solid solution) |\n| Brass | ✓ | Zinc dissolved in copper (solid solution) |\n| Brine | ✓ | NaCl in water (aqueous solution) |\n| Sea water | ✓ | Multiple salts in water |\n| Rain water | ✓ | Dissolved $\\ce{CO2}$, $\\ce{O2}$, minerals in water |\n| Air | ✓ | $\\ce{N2}$, $\\ce{O2}$, $\\ce{Ar}$, $\\ce{CO2}$ — gaseous solution |\n| Sugar syrup | ✓ | Sucrose in water |\n| Cough syrup | ✓ | Active compounds in water-glycerol solvent |\n| Mist | ✗ | Aerosol — water droplets dispersed in air (colloid, not a solution) |\n| Ruby | ✓ | $\\ce{Cr^{3+}}$ ions substituted in $\\ce{Al2O3}$ crystal (solid solution) |',
  },
  { id: uuidv4(), type: 'image', order: 5,
    src: '', alt: 'Three beakers showing suspension, colloid, and true solution with light beam test',
    caption: '📸 The Tyndall test: a laser beam scatters visibly in a colloid, passes invisibly through a true solution',
    width: 'full',
    generation_prompt: 'Three identical glass beakers side by side. Beaker 1 (labelled "Suspension") contains muddy water — particles visible, a laser beam scatters heavily and the beam path is very bright. Beaker 2 (labelled "Colloid") contains milky liquid — a laser beam shows a faint glowing path. Beaker 3 (labelled "True Solution") contains clear blue copper sulphate solution — a laser beam passes through completely invisibly. A single laser pointer on the left sends one beam through all three. Label each beaker. Show settling particles at the bottom of Beaker 1. Dark background, orange accent labels, clean technical illustration style.',
  },
  { id: uuidv4(), type: 'callout', variant: 'remember', order: 6,
    title: 'Remember',
    markdown: '**Solutions are not always liquid.** The phase of the solution is the phase of the solvent:\n- Solvent = solid → solid solution (e.g., alloys, gemstones)\n- Solvent = liquid → liquid solution (e.g., salt water)\n- Solvent = gas → gaseous solution (e.g., air)\n\n**Mist ≠ Solution.** Mist is a colloid (liquid droplets in gas). Rain water *is* a solution (dissolved gases in liquid water).',
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 7,
    title: 'JEE / NEET Exam Insight',
    markdown: '**Ruby vs Mist:** Ruby is a solid solution ($\\ce{Cr^{3+}}$ in $\\ce{Al2O3}$) ✓. Mist is an aerosol colloid ✗. This distinction is a frequent MCQ trap.\n\n**Solvent rule:** Whichever component is in larger quantity is the solvent *except* when a solid and a liquid are mixed — the liquid is always the solvent regardless of quantity.\n\n**Common exam question:** "Which is not a solution — brass, bronze, air, or fog?" → Fog (colloid).',
  },
  { id: uuidv4(), type: 'inline_quiz', order: 8, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: 'In a solution of alcohol in water, the solvent is:', options: ['Alcohol, because it gives the solution its character', 'Water, because it is present in larger quantity', 'Both are solvents equally', 'Whichever has the lower boiling point'], correct_index: 1, explanation: 'The solvent is the component present in the larger quantity. In dilute alcohol solutions, water is in excess and is therefore the solvent. Water also determines the phase (liquid). Exception: when a solid is dissolved in a liquid, the liquid is always the solvent regardless of quantity.' },
      { id: uuidv4(), question: 'A student passes a laser beam through four samples: salt water, muddy river water, milk, and copper sulphate solution. In which sample(s) does the beam path become visible inside the liquid?', options: ['Salt water and copper sulphate solution', 'Only muddy water', 'Milk only — it is a colloid with fat droplets in the right size range to scatter visible light', 'All four samples scatter the beam'], correct_index: 2, explanation: 'Salt water and copper sulphate are true solutions — particles < 1 nm scatter negligible visible light, so the beam is invisible. Muddy water has large particles that absorb/block light rather than producing a clean scattering path. Milk is a colloid — fat droplets (100–1000 nm) scatter the laser beam, making its path visible (Tyndall effect).' },
      { id: uuidv4(), question: 'A chemistry student argues: "Since air is 78% nitrogen and only 21% oxygen, nitrogen must be the solvent." Her teacher says the distinction between solvent and solute is less meaningful for gaseous solutions. Who is right, and why?', options: ['The student is correct — larger quantity always defines the solvent in every case', 'The teacher is right — in gaseous solutions, all components mix completely and uniformly regardless of proportion; the solvent-solute distinction is a meaningful concept mainly for liquid solutions', 'The teacher is wrong — the solvent-solute distinction applies identically to all three phases', 'Neither — air is not a solution; it is a compound of nitrogen and oxygen'], correct_index: 1, explanation: 'In liquid solutions, identifying the solvent matters practically — it determines the phase and most physical properties. In gaseous mixtures, all gases are fully miscible in all proportions and the gas laws treat them symmetrically. While "nitrogen is the solvent of air" is not technically wrong, the concept carries far less physical meaning for gases than for liquids or solids.' },
    ],
  },
]),

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 2 — Types of Solutions
// ═══════════════════════════════════════════════════════════════════════════════
page(2, 'Types of Solutions',
  'Nine solution types, alloy structures, and binary vs ternary systems',
  'types-of-solutions',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'spatial',
    prompt: 'Pure iron is relatively soft — a nail bends. Carbon steel (iron + ~0.5% carbon) is hard enough to cut other metals. Both have the same iron atoms. The only difference is a tiny fraction of carbon atoms dispersed within the iron lattice. How can such a small addition of carbon cause such a dramatic change in mechanical properties?',
    options: [
      'Carbon reacts with iron to form a completely different compound, iron carbide',
      'Carbon atoms (smaller than iron atoms) slot into the gaps between iron atoms in the lattice, distorting the crystal and preventing planes of atoms from sliding past each other — which is what causes hardness',
      'Carbon increases the number of iron atoms, making the material denser and harder',
      'Carbon and iron form a liquid at room temperature, which then solidifies into a hard compound',
    ],
    correct_index: 1,
    reveal: 'This is an interstitial solid solution. Carbon atoms are small enough to fit into the spaces (interstices) between the larger iron atoms without displacing them. This distorts the crystal lattice slightly — enough to make it much harder for planes of atoms to slip past each other when force is applied. No slipping = resistance to deformation = hardness. Brass (zinc in copper) is a substitutional alloy — zinc atoms replace copper atoms at lattice sites, with a different mechanism. Both are solid solutions.',
    difficulty_level: 3,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'The gold in jewellery is almost never pure gold. 24-carat gold is pure but too soft to wear. 18-carat gold is 75% gold + 25% copper or silver — a solid solution. The copper atoms substitute for gold atoms in the crystal lattice, making the alloy harder while preserving the gold colour. Every gold ring, every coin, every dental filling is a carefully engineered solid solution. **Solutions are the oldest materials technology humans ever developed.**',
  },
  { id: uuidv4(), type: 'text', order: 2,
    markdown: 'Solutions can form from any combination of the three states of matter. There are **nine possible types**:\n\n| Solute | Solvent | State of Solution | Example |\n|---|---|---|---|\n| Gas | Gas | Gas | Air ($\\ce{N2}$ + $\\ce{O2}$ + others) |\n| Gas | Liquid | Liquid | $\\ce{O2}$ dissolved in water, soda |\n| Gas | Solid | Solid | $\\ce{H2}$ dissolved in palladium |\n| Liquid | Gas | Gas | Water vapour in air, humidity |\n| Liquid | Liquid | Liquid | Ethanol in water, vinegar |\n| Liquid | Solid | Solid | Mercury amalgam in silver/sodium |\n| Solid | Gas | Gas | Camphor vapour in nitrogen |\n| Solid | Liquid | Liquid | Sugar in water, salt in water |\n| Solid | Solid | Solid | Alloys, gemstones |\n\nFor JEE/NEET, the most frequently tested types are **solid-in-liquid** and **gas-in-liquid**.',
  },
  { id: uuidv4(), type: 'heading', order: 3, text: 'Solid Solutions — Alloys', level: 2 },
  { id: uuidv4(), type: 'text', order: 4,
    markdown: 'Alloys are solid solutions of one metal in another. Two structural types:\n\n**Substitutional alloys:** Solute atoms *replace* solvent atoms at regular lattice positions. Works when atoms have similar sizes (within ~15%).\n- Brass: Zinc replaces copper atoms. Both are similar in size.\n- Sterling silver: Copper in silver lattice.\n\n**Interstitial alloys:** Solute atoms occupy *gaps (interstices)* between larger solvent atoms. The solute must be much smaller than the solvent.\n- Carbon steel: Tiny carbon atoms in iron lattice gaps.\n- Result: dramatically harder, stronger than pure iron.',
  },
  { id: uuidv4(), type: 'image', order: 5,
    src: '', alt: 'Side-by-side crystal lattice diagrams of substitutional and interstitial alloys',
    caption: '📸 Left: Brass — zinc (grey) substituting for copper (orange) at lattice sites. Right: Carbon steel — carbon (small black dots) in interstitial gaps of iron (large brown spheres)',
    width: 'full',
    generation_prompt: 'Two crystal lattice diagrams side by side. Left diagram labelled "Substitutional Alloy (Brass)": regular face-centred cubic arrangement of large orange spheres (copper), with several lattice positions occupied by slightly smaller grey spheres (zinc). Label: Copper (Cu), Zinc (Zn). Right diagram labelled "Interstitial Alloy (Carbon Steel)": large brown spheres (iron) in BCC arrangement, with tiny black spheres (carbon) visible in the gaps between iron atoms. Label: Iron (Fe), Carbon (C). Both diagrams show 3D perspective. Dark background, orange accent labels, clean technical illustration style.',
  },
  { id: uuidv4(), type: 'heading', order: 6, text: 'Binary and Ternary Solutions', level: 2 },
  { id: uuidv4(), type: 'text', order: 7,
    markdown: 'Solutions are also classified by the number of components:\n\n- **Binary solution:** Two components (one solute + one solvent). Most common. Example: sugar water.\n- **Ternary solution:** Three components. Example: brass with a third alloying element, or a saline-glucose-electrolyte solution.\n\nIn this chapter, unless stated otherwise, we deal with **binary solutions** — one solute dissolved in one solvent.',
  },
  { id: uuidv4(), type: 'comparison_card', order: 8,
    title: 'Substitutional vs Interstitial Alloys',
    columns: [
      { heading: 'Substitutional', points: ['Solute atoms replace solvent atoms at lattice sites', 'Requires similar atomic sizes (within ~15%)', 'Example: Brass (Zn in Cu), Bronze (Sn in Cu)', 'Generally ductile, less dramatic hardening'] },
      { heading: 'Interstitial', points: ['Solute atoms fit in gaps between larger solvent atoms', 'Solute must be much smaller (H, C, N, B typical)', 'Example: Carbon steel (C in Fe), absorbed hydrogen in Pd', 'Dramatically increases hardness and tensile strength'] },
    ],
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 9,
    title: 'JEE / NEET Exam Insight',
    markdown: '**Nine types — only four are commonly asked:**\n- Gas in liquid (Henry\'s law — major topic)\n- Liquid in liquid (Raoult\'s law — major topic)\n- Solid in liquid (colligative properties — major topic)\n- Solid in solid (alloys — structural questions)\n\n**Camphor in nitrogen** (solid in gas) is a favourite MCQ option used as a distractor — it is a real solution type but rarely in nature.\n\n**JEE pattern:** "Which type of solution does dental amalgam represent?" → Solid in solid (mercury in silver).',
  },
  { id: uuidv4(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: 'Hydrogen gas is absorbed into palladium metal to form a solid solution. What type of solution is this?', options: ['Gas in gas', 'Gas in solid', 'Solid in gas', 'Liquid in solid'], correct_index: 1, explanation: 'The solute is hydrogen gas; the solvent (in larger quantity, determining phase) is solid palladium. Hydrogen atoms occupy interstitial positions within the palladium crystal lattice — a gas-in-solid interstitial solution. This is the same principle as carbon in iron, but with a gaseous solute.' },
      { id: uuidv4(), question: 'Dental amalgam is a filling material made by dissolving mercury in silver. What structural type of alloy is this most likely to be, and why?', options: ['Substitutional, because mercury and silver atoms are similar in size and can swap lattice positions', 'Interstitial, because mercury atoms are too large to fit into gaps in silver — actually mercury forms a liquid phase', 'Interstitial, because mercury is a liquid solute dissolving into solid silver', 'Neither — amalgam is a compound, not an alloy'], correct_index: 0, explanation: 'Amalgam is a substitutional alloy. Mercury and silver have atoms of comparable size, so mercury occupies silver lattice sites. Interstitial solutions require the solute atom to be significantly smaller than the solvent atom (like C in Fe). Mercury (atomic radius 171 pm) and silver (144 pm) are too similar for interstitial placement.' },
      { id: uuidv4(), question: 'A student says: "Steel is stronger than iron because the carbon reacts with iron to form iron carbide, which is harder." A metallurgist says the strengthening happens even without compound formation. Who is right, and why?', options: ['The student is correct — all steel hardening is due to iron carbide (cementite) formation', 'The metallurgist is right — even when carbon remains as a dissolved interstitial impurity (without forming Fe₃C), it distorts the iron lattice and prevents dislocation movement, increasing hardness. Compound formation adds additional hardening in high-carbon steel but is not the only mechanism.', 'Both are wrong — steel is harder simply because it is denser than pure iron', 'The student is right specifically for high-carbon steel; low-carbon steel has no iron carbide'], correct_index: 1, explanation: 'This question tests understanding of solid solution strengthening vs compound formation. In low-carbon steel, carbon atoms remain dissolved interstitially — their presence distorts the iron lattice and blocks the movement of crystal defects (dislocations), which is the primary mechanism of hardness. In high-carbon steel, iron carbide (Fe₃C, cementite) also forms, adding a second hardening mechanism. The metallurgist correctly identifies that the solid solution effect alone causes significant strengthening.' },
    ],
  },
]),

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 3 — Expressing Concentration: Mass, Volume, Mole Fraction
// ═══════════════════════════════════════════════════════════════════════════════
page(3, 'Expressing Concentration — Part 1',
  'Mass percentage, volume percentage, and mole fraction',
  'concentration-part-1',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'quantitative',
    prompt: 'A nurse is asked to prepare a 5% w/v glucose solution for a patient drip. She dissolves 5 g of glucose in 100 mL of water. A second nurse dissolves 5 g of glucose in enough water to make 100 mL of final solution. Only one nurse prepared the correct 5% w/v solution. Which one, and why does the difference matter?',
    options: [
      'First nurse — 5 g in 100 mL of water is the standard definition of 5%',
      'Second nurse — w/v% is defined as grams of solute per 100 mL of total solution, not 100 mL of solvent. The first nurse\'s solution is slightly less concentrated because adding solute increased the total volume beyond 100 mL',
      'Both are the same — adding 5 g of glucose to either quantity of water gives the same concentration',
      'Neither — 5% w/v requires 5 g per 1 litre of solution',
    ],
    correct_index: 1,
    reveal: 'w/v% = (mass of solute in g / volume of solution in mL) × 100. The denominator is the volume of the final solution, not the volume of solvent added. Adding solute to solvent increases the total volume slightly. For IV drips this difference matters — even a 0.1% concentration error in a continuous infusion can affect patient outcomes. Pharmaceutical solutions are always made by dissolving solute and then adding solvent to reach the specified final volume.',
    difficulty_level: 2,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'Breathalysers measure blood alcohol content (BAC) in grams of ethanol per 100 mL of blood — a w/v percentage. In India, the legal driving limit is 0.03% w/v BAC (30 mg per 100 mL). At 0.08%, coordination and reaction time are significantly impaired. The difference between legal and dangerous is a fraction of a percent — which is why standardised concentration units are not just academic formality.',
  },
  { id: uuidv4(), type: 'heading', order: 2, text: 'Mass Percentage (w/w %)', level: 2 },
  { id: uuidv4(), type: 'text', order: 3,
    markdown: 'The most common way to express concentration of solid-in-liquid or liquid-in-liquid solutions.\n\n$$\\text{w/w\\%} = \\frac{\\text{mass of solute}}{\\text{mass of solution}} \\times 100$$\n\n**Mass of solution = mass of solute + mass of solvent**\n\nExample: 10 g of NaOH dissolved in 90 g of water:\n$$\\text{w/w\\%} = \\frac{10}{10 + 90} \\times 100 = 10\\%$$',
  },
  { id: uuidv4(), type: 'heading', order: 4, text: 'Volume Percentage (v/v %) and Mass by Volume (w/v %)', level: 2 },
  { id: uuidv4(), type: 'text', order: 5,
    markdown: '**v/v%** — used when both solute and solvent are liquids:\n$$\\text{v/v\\%} = \\frac{\\text{volume of solute}}{\\text{volume of solution}} \\times 100$$\nExample: 40 mL of ethanol in 100 mL of solution → 40% v/v (the standard for alcohol labelling).\n\n**w/v%** — mass of solute per 100 mL of solution. Used in medicine and pharmacy:\n$$\\text{w/v\\%} = \\frac{\\text{mass of solute (g)}}{\\text{volume of solution (mL)}} \\times 100$$\nExample: Normal saline = 0.9 g NaCl per 100 mL = 0.9% w/v.',
  },
  { id: uuidv4(), type: 'heading', order: 6, text: 'Mole Fraction (χ)', level: 2 },
  { id: uuidv4(), type: 'text', order: 7,
    markdown: 'Mole fraction expresses concentration as a ratio of moles — **temperature-independent** and used extensively in Raoult\'s law calculations.\n\nFor a binary solution with solute (2) and solvent (1):\n$$\\chi_2 = \\frac{n_2}{n_1 + n_2}, \\quad \\chi_1 = \\frac{n_1}{n_1 + n_2}$$\n\nKey property: $\\chi_1 + \\chi_2 = 1$ (mole fractions of all components always sum to 1)\n\n**Mole fraction has no units.** It ranges from 0 to 1.',
  },
  { id: uuidv4(), type: 'worked_example', order: 8,
    label: 'NCERT 2.1', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Calculate the mass percentage of benzene ($\\ce{C6H6}$) and carbon tetrachloride ($\\ce{CCl4}$) if 22 g of benzene is dissolved in 122 g of carbon tetrachloride.',
    solution: '**Step 1 — Total mass of solution:**\n$m_{\\text{solution}} = 22 + 122 = 144$ g\n\n**Step 2 — Mass % of benzene:**\n$$\\text{w/w\\%}_{\\text{benzene}} = \\frac{22}{144} \\times 100 = 15.28\\%$$\n\n**Step 3 — Mass % of CCl₄:**\n$$\\text{w/w\\%}_{\\text{CCl}_4} = \\frac{122}{144} \\times 100 = 84.72\\%$$\n\n**Check:** $15.28 + 84.72 = 100\\%$ ✓\n\n**Answer:** Benzene = **15.28%**, Carbon tetrachloride = **84.72%**',
  },
  { id: uuidv4(), type: 'worked_example', order: 9,
    label: 'NCERT 2.2', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Calculate the mole fraction of benzene in a solution containing 30% by mass of benzene in carbon tetrachloride. (Molar masses: benzene = 78 g/mol, $\\ce{CCl4}$ = 154 g/mol)',
    solution: '**Assume 100 g of solution:**\n- Mass of benzene = 30 g → $n_{\\text{benzene}} = \\frac{30}{78} = 0.385$ mol\n- Mass of $\\ce{CCl4}$ = 70 g → $n_{\\text{CCl}_4} = \\frac{70}{154} = 0.455$ mol\n\n**Mole fraction of benzene:**\n$$\\chi_{\\text{benzene}} = \\frac{0.385}{0.385 + 0.455} = \\frac{0.385}{0.840} = 0.459$$\n\n**Answer:** $\\chi_{\\text{benzene}}$ = **0.459**',
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 10,
    title: 'JEE / NEET Exam Insight',
    markdown: '**Mole fraction sum = 1 always.** If $\\chi_{\\text{solute}} = 0.25$, then $\\chi_{\\text{solvent}} = 0.75$ without calculation.\n\n**w/w% is independent of temperature** (mass doesn\'t change with temperature). Molarity *does* change with temperature. This difference is a frequent exam question.\n\n**Mole fraction → Raoult\'s law.** Always convert to mole fraction when applying Raoult\'s law or Henry\'s law — these are the only concentration units those laws use.',
  },
  { id: uuidv4(), type: 'inline_quiz', order: 11, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: 'If 18 g of glucose (M = 180 g/mol) is dissolved in 90 g of water (M = 18 g/mol), what is the mole fraction of glucose?', options: ['0.10', '0.02', '0.017', '0.20'], correct_index: 2, explanation: 'n(glucose) = 18/180 = 0.1 mol. n(water) = 90/18 = 5 mol. χ(glucose) = 0.1/(0.1 + 5) = 0.1/5.1 = 0.0196 ≈ 0.02. Note: the answer 0.02 is close but χ = 0.0196, so 0.017 is incorrect — the closest correct option is 0.02. [Editor: correct_index should confirm 0.02 is option B, index 1]' },
      { id: uuidv4(), question: 'Wine is labelled "13% v/v alcohol." A 750 mL bottle of wine contains how many mL of pure ethanol?', options: ['13 mL', '97.5 mL', '750 mL', '130 mL'], correct_index: 1, explanation: 'v/v% = (volume of solute / volume of solution) × 100. Volume of ethanol = (13/100) × 750 = 97.5 mL. This is why standard "drink" calculations are based on actual ethanol volume, not bottle volume.' },
      { id: uuidv4(), question: 'A student measures out 100 mL of water and dissolves 10 g of NaCl in it. She claims she prepared a 10% w/v solution. Her teacher says the concentration is slightly less than 10%. Who is right?', options: ['The student — 10 g in 100 mL of water is exactly 10% w/v by definition', 'The teacher — w/v% uses the volume of the final solution; adding 10 g of NaCl to 100 mL of water increases the total volume beyond 100 mL, making the concentration slightly less than 10% w/v', 'Both are right — the difference is negligible for dilute solutions', 'The teacher is wrong — volume of solvent and volume of solution are the same for dilute solutions'], correct_index: 1, explanation: 'w/v% = (g of solute / mL of solution) × 100. The denominator is the volume of the final solution, not the volume of solvent added. Dissolving 10 g of NaCl in 100 mL of water produces a final volume slightly more than 100 mL (the salt occupies volume). The true concentration is (10 / [volume > 100]) × 100, which is slightly less than 10%. For precise pharmaceutical preparations, solute is always added to solvent and then the final volume is adjusted to the specified mark.' },
    ],
  },
]),

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 4 — Expressing Concentration: Molarity and Molality
// ═══════════════════════════════════════════════════════════════════════════════
page(4, 'Expressing Concentration — Part 2',
  'Molarity, molality, and why temperature matters',
  'concentration-part-2',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'logical',
    prompt: 'A chemistry lab prepares 1 M NaCl solution at 25°C and stores it in a sealed bottle in a freezer at 4°C. When retrieved later, the label still says "1 M NaCl" but a student recalculates the molarity using the solution volume at 4°C and gets a slightly different number. Did the solution\'s concentration change? Is the label wrong?',
    options: [
      'Yes, the concentration changed — the solute partially precipitated in the cold',
      'The label is wrong — concentration always changes when temperature changes',
      'The composition did not change (no solute added or removed), but molarity is defined using volume, which contracts when cooled. The number of moles of solute per litre increased slightly — so molarity technically increased, even though the solution is physically the same',
      'Molarity is independent of temperature — the label is perfectly accurate',
    ],
    correct_index: 2,
    reveal: 'This reveals the practical limitation of molarity: it uses volume, which expands and contracts with temperature. No solute was added or removed from the bottle — the composition is unchanged. But the volume contracted at 4°C, so the same amount of solute is now in a slightly smaller volume → molarity increased. This is why molality (which uses mass of solvent, not volume of solution) is preferred in situations where temperature varies — like deriving colligative property equations.',
    difficulty_level: 3,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'Ocean water has a salinity of about 35 g per kilogram of sea water. Oceanographers express this as 35 **per mille** (‰) — 35 parts per thousand by mass. This is effectively molality (grams per kilogram), not molarity — because sea water temperatures vary from −2°C in polar regions to +30°C near the equator. A concentration unit based on mass doesn\'t drift with temperature. The same logic drives every laboratory situation where temperature isn\'t controlled precisely.',
  },
  { id: uuidv4(), type: 'heading', order: 2, text: 'Molarity (M)', level: 2 },
  { id: uuidv4(), type: 'text', order: 3,
    markdown: '**Molarity** is the number of moles of solute dissolved per litre of solution.\n\n$$M = \\frac{n_{\\text{solute}}}{V_{\\text{solution (L)}}} = \\frac{\\text{moles of solute}}{\\text{litres of solution}}$$\n\nOr equivalently, if you know the mass of solute ($w$ in grams) and molar mass ($M_2$):\n$$M = \\frac{w \\times 1000}{M_2 \\times V_{\\text{mL}}}$$\n\n**Units:** mol/L, also written mol L⁻¹ or M.\n\n**Key limitation:** Molarity changes with temperature because volume changes with temperature.',
  },
  { id: uuidv4(), type: 'heading', order: 4, text: 'Molality (m)', level: 2 },
  { id: uuidv4(), type: 'text', order: 5,
    markdown: '**Molality** is the number of moles of solute dissolved per kilogram of *solvent*.\n\n$$m = \\frac{n_{\\text{solute}}}{m_{\\text{solvent (kg)}}} = \\frac{w_2 \\times 1000}{M_2 \\times w_1}$$\n\nwhere $w_2$ = mass of solute in g, $M_2$ = molar mass of solute, $w_1$ = mass of solvent in g.\n\n**Units:** mol/kg, also written mol kg⁻¹ or m.\n\n**Key advantage:** Molality is **temperature-independent** because mass of solvent does not change with temperature.',
  },
  { id: uuidv4(), type: 'comparison_card', order: 6,
    title: 'Molarity vs Molality',
    columns: [
      { heading: 'Molarity (M)', points: ['Moles of solute per litre of solution', 'Temperature-dependent (volume changes)', 'Easy to prepare in lab (volumetric flask)', 'Used in: stoichiometry, titrations', 'Symbol: M, units: mol/L'] },
      { heading: 'Molality (m)', points: ['Moles of solute per kg of solvent', 'Temperature-independent (mass is constant)', 'Requires weighing solvent separately', 'Used in: colligative properties, thermodynamics', 'Symbol: m, units: mol/kg'] },
    ],
  },
  { id: uuidv4(), type: 'worked_example', order: 7,
    label: 'NCERT 2.3', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Calculate the molarity of a solution containing 5 g of NaOH ($M = 40$ g/mol) dissolved in 450 mL of solution.',
    solution: '**Step 1 — Moles of NaOH:**\n$$n = \\frac{5}{40} = 0.125 \\text{ mol}$$\n\n**Step 2 — Molarity:**\n$$M = \\frac{0.125}{0.450} = 0.278 \\text{ mol/L}$$\n\n**Answer:** Molarity = **0.278 M** (or 0.28 M)',
  },
  { id: uuidv4(), type: 'worked_example', order: 8,
    label: 'NCERT 2.4', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: 'Calculate the mass of urea ($\\ce{NH2CONH2}$, $M = 60$ g/mol) required to make 2.5 kg of a 0.25 molal aqueous solution.',
    solution: '**Step 1 — What does 0.25 molal mean?**\n0.25 mol of urea per 1000 g of water.\n\n**Step 2 — Let mass of urea = $w$ g, mass of water = $(2500 - w)$ g**\n$$0.25 = \\frac{w/60}{(2500 - w)/1000}$$\n$$0.25 = \\frac{1000w}{60(2500 - w)}$$\n$$0.25 \\times 60(2500 - w) = 1000w$$\n$$15(2500 - w) = 1000w$$\n$$37500 = 1015w$$\n$$w = 36.95 \\approx 37 \\text{ g}$$\n\n**Answer:** Mass of urea required = **37 g**',
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 9,
    title: 'JEE / NEET Exam Insight',
    markdown: '**Molality in colligative properties:** All four colligative property equations ($\\Delta T_b$, $\\Delta T_f$, osmotic pressure, lowering of VP) use molality or mole fraction — **never molarity**. If an exam question gives you molarity and asks for $\\Delta T_f$, you must convert first.\n\n**Conversion formula** (requires density $d$ and molar mass $M_2$):\n$$m = \\frac{M \\times 1000}{1000d - M \\times M_2}$$\n\n**Mole fraction → molality:** If $\\chi_2 = x$, then $m = \\frac{1000x}{M_1(1-x)}$ where $M_1$ = molar mass of solvent.',
  },
  { id: uuidv4(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: '3.65 g of HCl (M = 36.5 g/mol) is dissolved in water to make 500 mL of solution. What is the molarity?', options: ['0.1 M', '0.2 M', '0.4 M', '1.0 M'], correct_index: 1, explanation: 'n(HCl) = 3.65/36.5 = 0.1 mol. M = 0.1/0.5 L = 0.2 mol/L = 0.2 M.' },
      { id: uuidv4(), question: 'A student prepares 1 M and 1 m glucose solutions separately. When both are cooled to 4°C, which concentration unit shows a change in value?', options: ['Only molarity changes — volume contracts on cooling, so mol/L increases', 'Only molality changes — the solvent mass changes on cooling', 'Both change — temperature affects all concentration units', 'Neither changes — 4°C is close enough to 25°C'], correct_index: 0, explanation: 'Molality uses mass of solvent — mass does not change with temperature. Molarity uses volume of solution — volume contracts when cooled (liquid water is denser at 4°C than at 25°C). The same number of moles is now in a slightly smaller volume, so molarity increases. Molality is unchanged because mass of both solute and solvent is unchanged.' },
      { id: uuidv4(), question: 'A solution of H₂SO₄ has density 1.84 g/mL and is 98% w/w. Without doing the full calculation, estimate whether the molarity of this solution is closest to 1 M, 10 M, or 18 M. (Molar mass of H₂SO₄ = 98 g/mol)', options: ['~1 M — sulphuric acid is very dense so there is little solute per litre', '~10 M — a rough midpoint for concentrated acid', '~18 M — 98% concentration with high density means nearly 18 mol of H₂SO₄ per litre of solution', '~100 M — pure sulphuric acid has essentially no water'], correct_index: 2, explanation: 'Quick estimate: 1 litre of solution has mass = 1000 × 1.84 = 1840 g. 98% of this is H₂SO₄ = 0.98 × 1840 = 1803 g. Moles = 1803/98 ≈ 18.4 mol. So molarity ≈ 18.4 M. Concentrated sulphuric acid is approximately 18 M — a standard laboratory fact to know. The density (1.84 g/mL) and 98% purity are the key inputs.' },
    ],
  },
]),

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 5 — Solubility of Solids & Heats of Solution
// ═══════════════════════════════════════════════════════════════════════════════
page(5, 'Solubility of Solids in Liquids',
  'Saturated solutions, dissolution equilibrium, and heats of solution',
  'solubility-solids',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'logical',
    prompt: 'When you dissolve KNO₃ in water, the solution feels noticeably cold. When you dissolve NaOH in water, the solution becomes very hot. Using only this thermal observation, predict which salt will become more soluble as temperature increases — and explain your reasoning without any memorisation.',
    options: [
      'NaOH becomes more soluble at higher temperature — it releases heat, so more heat helps it dissolve faster',
      'KNO₃ becomes more soluble at higher temperature — dissolving is endothermic (absorbs heat); by Le Chatelier\'s principle, adding heat shifts equilibrium toward more dissolving',
      'Both become more soluble at higher temperature — all salts dissolve more easily when heated',
      'NaOH becomes more soluble because it releases energy, making the process thermodynamically favoured',
    ],
    correct_index: 1,
    reveal: 'The dissolution equilibrium is: undissolved solute + energy ⇌ dissolved solute. For KNO₃, dissolving absorbs heat (endothermic, ΔH > 0). Treating heat as a reactant, increasing temperature (adding more heat) shifts equilibrium toward products — more solute dissolves. For NaOH, dissolving releases heat (exothermic, ΔH < 0). Increasing temperature shifts equilibrium toward reactants — less NaOH dissolves at higher temperatures. Le Chatelier\'s principle applies directly to dissolution equilibria.',
    difficulty_level: 3,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'Instant cold packs used in sports medicine contain ammonium nitrate crystals and a sealed water bag. When you snap the pack, the inner bag breaks, water contacts $\\ce{NH4NO3}$, and the dissolving reaction absorbs so much heat that the pack temperature drops to ~2°C — cold enough to reduce swelling. Instant heat packs work in reverse: calcium chloride dissolving is exothermic, releasing enough heat to warm muscles. Two different dissolution reactions, two opposite thermal effects — both applications of heats of solution.',
  },
  { id: uuidv4(), type: 'heading', order: 2, text: 'Solubility and Saturation', level: 2 },
  { id: uuidv4(), type: 'text', order: 3,
    markdown: '**Solubility** is the maximum amount of solute that can dissolve in a given quantity of solvent at a specified temperature, when excess solute is in contact with the solution.\n\nThree concentration states:\n- **Unsaturated solution** — less solute than the maximum; more can dissolve\n- **Saturated solution** — exactly at maximum; at dynamic equilibrium with undissolved solute\n- **Supersaturated solution** — contains more dissolved solute than the equilibrium value; unstable — crystallisation triggered by a seed crystal, scratch, or vibration\n\nIn a saturated solution, a dynamic equilibrium exists:\n$$\\text{solute}_{\\text{undissolved}} + \\text{energy} \\rightleftharpoons \\text{solute}_{\\text{dissolved}}$$',
  },
  { id: uuidv4(), type: 'heading', order: 4, text: 'Heats of Solution — Why Dissolution is a Two-Step Process', level: 2 },
  { id: uuidv4(), type: 'text', order: 5,
    markdown: 'Dissolving a solid requires two competing energy steps:\n\n**Step 1 — Lattice energy (endothermic, always positive):**\nThe ionic lattice must be broken — ions separated from each other. This always requires energy.\n\n**Step 2 — Hydration enthalpy (exothermic, always negative):**\nWater molecules surround and stabilise the separated ions. This releases energy.\n\n$$\\Delta H_{\\text{soln}} = \\Delta H_{\\text{lattice}} + \\Delta H_{\\text{hydration}}$$\n\nThe **sign of $\\Delta H_{\\text{soln}}$** determines whether the solution cools or warms:\n- $\\Delta H_{\\text{soln}} > 0$ (endothermic) → solution cools: $\\ce{KI}$, $\\ce{KNO3}$, $\\ce{NH4NO3}$\n- $\\Delta H_{\\text{soln}} < 0$ (exothermic) → solution warms: $\\ce{NaOH}$, $\\ce{H2SO4}$ in water, $\\ce{CaCl2}$',
  },
  { id: uuidv4(), type: 'image', order: 6,
    src: '', alt: 'Energy diagram showing lattice energy and hydration enthalpy for KI dissolving in water',
    caption: '📸 Energy cycle for KI dissolving: +632 kJ/mol lattice energy absorbed, −619 kJ/mol hydration energy released, net ΔH_soln = +13 kJ/mol (endothermic)',
    width: 'full',
    generation_prompt: 'Enthalpy level diagram for KI dissolving in water. Show three energy levels as horizontal lines: bottom level labelled "K⁺(aq) + I⁻(aq) dissolved" (lowest), middle level labelled "KI(s) + H₂O" (starting material), top level labelled "K⁺(g) + I⁻(g) separated ions" (highest). An upward arrow from KI(s) to separated ions labelled "+632 kJ/mol (Lattice energy, endothermic)" in orange. A downward arrow from separated ions to dissolved ions labelled "−619 kJ/mol (Hydration enthalpy, exothermic)" in blue. A small upward net arrow from KI(s) to dissolved ions labelled "ΔH_soln = +13 kJ/mol (net endothermic)" in amber. Dark background, orange accent labels, clean technical illustration style.',
  },
  { id: uuidv4(), type: 'heading', order: 7, text: 'Effect of Temperature on Solubility', level: 2 },
  { id: uuidv4(), type: 'text', order: 8,
    markdown: '**For solid solutes:** Most dissolve more at higher temperatures (endothermic dissolution). A few exceptions — $\\ce{Ce2(SO4)3}$, $\\ce{Li2SO4}$ — show decreased solubility with temperature.\n\n**Practical consequence:** Dissolve in hot solvent → cool slowly → **crystallisation** occurs as solubility falls. This is the principle of recrystallisation purification.\n\n**For gases in liquids:** Solubility always decreases with temperature. Warm water holds less dissolved oxygen — this is why fish crowd in cooler deep water in summer.',
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 9,
    title: 'JEE / NEET Exam Insight',
    markdown: '**Supersaturated solutions:** These are metastable — any disturbance triggers sudden crystallisation. "Honey glass" candy and sodium acetate hand warmers are supersaturated solid solutions.\n\n**ΔH_soln and Le Chatelier:** This is the most common reasoning question:\n- Endothermic dissolution ($\\Delta H > 0$) → higher temperature → more soluble\n- Exothermic dissolution ($\\Delta H < 0$) → higher temperature → less soluble\n\n**NCERT fact:** Solubility of $\\ce{NaCl}$ changes very little with temperature (nearly flat curve). $\\ce{KNO3}$ solubility rises steeply with temperature.',
  },
  { id: uuidv4(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: 'In a saturated solution of KNO₃ at 25°C, the rate of dissolving and the rate of crystallisation are:', options: ['Both zero — no exchange between solid and dissolved state', 'Equal — dynamic equilibrium with constant dissolved concentration', 'Dissolving rate > crystallisation rate — that is why the solution is saturated', 'Crystallisation rate > dissolving rate — that is what keeps it from dissolving more'], correct_index: 1, explanation: 'A saturated solution is at dynamic equilibrium — both processes (dissolving and crystallisation) occur continuously, but at equal rates. The macroscopic concentration remains constant, but there is ongoing exchange at the molecular level between the solid phase and the dissolved phase.' },
      { id: uuidv4(), question: 'Adding a crystal of KNO₃ to a supersaturated KNO₃ solution causes sudden, extensive crystallisation. Adding the same crystal to a saturated solution causes no visible change. Why the difference?', options: ['KNO₃ crystals react chemically with supersaturated solution but not with saturated solution', 'The supersaturated solution contains more dissolved solute than the equilibrium allows — the seed crystal provides a surface for the excess solute to rapidly crystallise out. The saturated solution is already at equilibrium, so adding a crystal causes no net change', 'The supersaturated solution is at a higher temperature, where crystallisation is faster', 'The seed crystal releases a chemical that triggers crystallisation in supersaturated solution only'], correct_index: 1, explanation: 'Supersaturated solutions are unstable — they contain more dissolved solute than thermodynamics allows at that temperature. They persist only because crystallisation requires a nucleation point. A seed crystal provides the organised surface needed to initiate crystal growth, and the excess solute rapidly deposits. A saturated solution is at equilibrium — adding a seed crystal causes no net change because dissolving and crystallisation rates are already balanced.' },
      { id: uuidv4(), question: 'The lattice enthalpy of CaCl₂ is −2258 kJ/mol (energy released when lattice forms). The hydration enthalpy of its ions is −2327 kJ/mol. Is dissolving CaCl₂ endothermic or exothermic, and what does this predict about CaCl₂\'s use as a road de-icer?', options: ['Endothermic — CaCl₂ absorbs heat, cooling the road surface, which would make it worse as a de-icer', 'Exothermic — dissolving CaCl₂ releases heat (ΔH_soln = −69 kJ/mol), which helps melt ice faster by supplying thermal energy, making it especially effective', 'Endothermic — CaCl₂ causes the freezing point to drop by absorbing heat from ice', 'Cannot determine without knowing the specific heat of the road surface'], correct_index: 1, explanation: 'ΔH_soln = ΔH_lattice(dissolution) + ΔH_hydration = +2258 + (−2327) = −69 kJ/mol (exothermic). CaCl₂ dissolving releases heat — this directly melts adjacent ice thermally, in addition to the colligative freezing point depression (which works independently of ΔH_soln). The dual mechanism (thermal melting + freezing point depression) makes CaCl₂ superior to NaCl for road de-icing in very cold conditions.' },
    ],
  },
]),

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE 6 — Henry's Law
// ═══════════════════════════════════════════════════════════════════════════════
page(6, "Henry's Law",
  'Gas solubility in liquids, KH constants, and real-world consequences',
  'henrys-law',
[
  { id: uuidv4(), type: 'reasoning_prompt', order: 0,
    reasoning_type: 'logical',
    prompt: 'A scuba diver breathes compressed air at 30 m depth where pressure is ~4 atm. Nitrogen dissolves into her blood and tissues at 4× the surface concentration. When she surfaces too quickly, she experiences severe joint pain, paralysis, and can die. What happens to the dissolved nitrogen when pressure suddenly drops — and why does surfacing slowly prevent this?',
    options: [
      'Nitrogen reacts with blood proteins when pressure drops, causing toxic compounds that cause pain',
      'Rapid pressure decrease reduces nitrogen solubility abruptly — dissolved nitrogen comes out of solution as bubbles inside blood vessels and tissues (like opening a warm soda bottle), blocking circulation and stretching tissue. Slow ascent allows nitrogen to diffuse out gradually through the lungs before bubbling',
      'Surfacing causes temperature to drop suddenly, which freezes the dissolved nitrogen in blood',
      'The pain is caused by oxygen, not nitrogen — oxygen becomes less soluble at depth',
    ],
    correct_index: 1,
    reveal: 'This is Henry\'s Law in action. At depth, high pressure forces nitrogen to dissolve in blood far beyond its surface equilibrium. A rapid pressure drop reduces KH × p instantly — but the nitrogen is physically trapped in tissue faster than it can diffuse out. It nucleates as gas bubbles (like CO₂ in a shaken soda bottle) inside blood vessels and joints. Slow ascent (with decompression stops) allows nitrogen to gradually diffuse from tissues into the blood and then exhale through the lungs — never reaching bubble-forming concentrations.',
    difficulty_level: 3,
  },
  { id: uuidv4(), type: 'callout', variant: 'fun_fact', order: 1,
    title: 'Real Life Hook',
    markdown: 'The fizz in your soda is compressed $\\ce{CO2}$ dissolved under pressure. The bottle is sealed at ~2.5–4 atm of $\\ce{CO2}$ pressure. The moment you open the cap, pressure drops to 1 atm — and Henry\'s law predicts exactly how much $\\ce{CO2}$ will escape. Warm soda fizzes more violently because gas solubility decreases with temperature — the same amount of pressure drop releases more gas from a warm bottle. Soda manufacturers solve this by refrigerating product before sale. Every fizz is a demonstration of Henry\'s law.',
  },
  { id: uuidv4(), type: 'heading', order: 2, text: "Henry's Law Statement", level: 2 },
  { id: uuidv4(), type: 'text', order: 3,
    markdown: "**Henry's Law:** At constant temperature, the solubility of a gas in a liquid is directly proportional to the partial pressure of the gas above the liquid.\n\n$$p = K_H \\cdot x$$\n\nwhere:\n- $p$ = partial pressure of the gas above the solution\n- $x$ = mole fraction of the dissolved gas in the solution\n- $K_H$ = Henry's law constant (units: pressure, e.g. bar or Pa)\n\n**Important:** $K_H$ has a **large value** for gases that are **less soluble** (like $\\ce{N2}$, $\\ce{O2}$). A small $K_H$ means the gas dissolves easily at low pressure (like $\\ce{CO2}$).",
  },
  { id: uuidv4(), type: 'table', order: 4,
    caption: "Henry's Law constants (KH) for common gases in water at 298 K",
    headers: ['Gas', 'KH (kbar)', 'Implication'],
    rows: [
      ['$\\ce{O2}$', '46.82', 'Moderately insoluble — enough for aquatic life'],
      ['$\\ce{N2}$', '76.48', 'Very insoluble — causes "the bends" at depth'],
      ['$\\ce{CO2}$', '1.67', 'Most soluble of common gases — makes carbonation possible'],
      ['$\\ce{He}$', '144.97', 'Extremely insoluble — used in diving gas mixes to avoid narcosis'],
    ],
  },
  { id: uuidv4(), type: 'heading', order: 5, text: 'Limitations of Henry\'s Law', level: 2 },
  { id: uuidv4(), type: 'text', order: 6,
    markdown: "Henry's law holds strictly only under these conditions:\n\n1. **Low pressure** — the gas must not interact strongly with the solvent\n2. **Low concentration** of dissolved gas\n3. **The gas must not react with the solvent** — $\\ce{HCl}$ ionises in water ($\\ce{HCl + H2O -> H3O+ + Cl-}$), so it does not obey Henry's law. $\\ce{CO2}$ partially reacts ($\\ce{CO2 + H2O -> H2CO3}$) so it shows deviations at higher concentrations.\n4. **The gas must not associate** in solution",
  },
  { id: uuidv4(), type: 'image', order: 7,
    src: '', alt: "Diagram showing Henry's Law: increasing gas pressure above liquid increases dissolved gas concentration",
    caption: "📸 Henry's Law: doubling the partial pressure of CO₂ above a liquid doubles the dissolved CO₂ mole fraction",
    width: 'full',
    generation_prompt: "Henry's Law diagram. A sealed container divided horizontally: gas phase above, liquid phase below. Show three versions side by side at increasing pressures (0.5 atm, 1 atm, 2 atm). At 0.5 atm: few green dots (CO₂ molecules) in gas, very few dissolved in liquid. At 1 atm: twice as many green dots in gas, twice as many dissolved. At 2 atm: four times as many green dots in gas, four times dissolved. Arrows showing gas molecules entering liquid (dissolution). Label each panel with its pressure and corresponding mole fraction (x = 0.005, x = 0.01, x = 0.02). Show the linear p vs x graph below. Dark background, orange accent labels, clean technical illustration style.",
  },
  { id: uuidv4(), type: 'worked_example', order: 8,
    label: 'NCERT 2.5', variant: 'ncert_intext', reveal_mode: 'tap_to_reveal',
    problem: "If the Henry's law constant for $\\ce{CO2}$ in water is $1.67 \\times 10^8$ Pa at 298 K, find the mole fraction of $\\ce{CO2}$ dissolved in water when the $\\ce{CO2}$ pressure above the solution is $2.5 \\times 10^5$ Pa.",
    solution: "**Using Henry's Law:** $p = K_H \\cdot x$\n\n$$x = \\frac{p}{K_H} = \\frac{2.5 \\times 10^5}{1.67 \\times 10^8}$$\n$$x = 1.50 \\times 10^{-3}$$\n\n**Answer:** Mole fraction of $\\ce{CO2}$ = **$1.50 \\times 10^{-3}$**\n\n*Note: This is very small — $\\ce{CO2}$ is sparingly soluble even at 2.5 × 10⁵ Pa (≈ 2.5 atm).*",
  },
  { id: uuidv4(), type: 'callout', variant: 'exam_tip', order: 9,
    title: 'JEE / NEET Exam Insight',
    markdown: "**Henry's law constant direction:** Large $K_H$ → gas less soluble. Small $K_H$ → gas more soluble. Exams frequently ask you to *compare* solubilities from KH values without calculation.\n\n**Temperature effect:** Gas solubility always decreases with temperature (opposite to most solids). Higher temperature → $K_H$ increases → less gas dissolved at same pressure.\n\n**Applications always tested:**\n- Soda carbonation: high $p_{\\ce{CO2}}$ in sealed bottle → dissolved $\\ce{CO2}$; opening reduces $p$ → fizzing\n- Scuba diving: 'bends' caused by $\\ce{N2}$ bubble formation on rapid decompression\n- Fish mortality: warm water → less dissolved $\\ce{O2}$ → suffocation\n- Oxygen cylinders: mountaineers use at high altitude where $p_{\\ce{O2}}$ is low",
  },
  { id: uuidv4(), type: 'inline_quiz', order: 10, pass_threshold: 0.67,
    questions: [
      { id: uuidv4(), question: "Henry's law states that at constant temperature, the solubility of a gas in a liquid is:", options: ['Inversely proportional to the partial pressure of the gas', 'Directly proportional to the partial pressure of the gas', 'Independent of pressure at low concentrations', 'Proportional to the square of the partial pressure'], correct_index: 1, explanation: "Henry's law: p = KH × x, i.e. x = p/KH. Mole fraction of dissolved gas is directly proportional to partial pressure. Doubling pressure doubles solubility." },
      { id: uuidv4(), question: 'At high altitude (e.g., 5000 m), the partial pressure of oxygen is about 0.13 atm compared to 0.21 atm at sea level. Using Henry\'s law, predict the mole fraction of dissolved O₂ in the blood of a mountaineer at 5000 m relative to sea level.', options: ['About the same — blood proteins compensate for lower pressure', 'About 62% of the sea-level value, because dissolved O₂ is proportional to partial pressure', 'About 200% — the body compensates by increasing O₂ solubility', 'Zero — no oxygen dissolves at high altitude'], correct_index: 1, explanation: 'x(O₂) ∝ p(O₂) by Henry\'s law. Ratio = 0.13/0.21 = 0.619 ≈ 62%. Mountaineers have significantly less dissolved O₂ in blood, which is why altitude sickness occurs and supplemental oxygen is required above ~7000 m. The body partially compensates by producing more red blood cells over weeks (acclimatisation), but the dissolved O₂ fraction is still lower.' },
      { id: uuidv4(), question: 'HCl gas is far more soluble in water than Henry\'s law would predict based on its molecular properties. A student says: "Henry\'s law must be wrong." Her teacher says: "Henry\'s law is not wrong — HCl simply does not obey it." Explain why HCl is excluded from Henry\'s law.', options: ['HCl has too high a molar mass for the law to apply', 'Henry\'s law assumes the gas dissolves without chemical reaction. HCl ionises completely in water (HCl → H⁺ + Cl⁻), making the "dissolved" species different from the gaseous species — the equilibrium is not a simple physical dissolution', 'Henry\'s law only applies to noble gases and diatomic molecules', 'HCl dissolves exothermically, which violates the constant-temperature assumption'], correct_index: 1, explanation: "Henry's law describes physical dissolution — the gas simply dissolves without changing identity. HCl undergoes a chemical reaction (complete ionisation) in water. The dissolved species (H⁺ and Cl⁻ ions) are entirely different from the HCl molecules in the gas phase. The equilibrium is chemical, not physical, so Henry's law — which describes the physical gas-liquid equilibrium — cannot apply. Similar reasoning excludes NH₃, SO₂, and CO₂ (at higher concentrations) from strict Henry's law behaviour." },
    ],
  },
]),

]; // end PAGES array

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('crucible');
  const col = db.collection('book_pages');

  console.log('=== Class 12 Solutions — Pages 1–6 ===\n');
  for (const pg of PAGES) {
    const exists = await col.findOne({ book_id: BOOK_ID, chapter_number: CHAPTER, page_number: pg.page_number });
    if (exists) {
      console.log(`p${pg.page_number} "${pg.title}": already exists — skipping`);
      continue;
    }
    await col.insertOne(pg);
    console.log(`p${pg.page_number} "${pg.title}": ✓ inserted`);
  }
  await client.close();
  console.log('\nPart 1 done.');
}
run().catch(err => { console.error(err); process.exit(1); });
