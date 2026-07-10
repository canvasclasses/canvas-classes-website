'use strict';
/**
 * Ch9 — AUGMENT batch 2: pages 105–109.
 * covalent-compounds, ionic-compounds, cations-and-anions, writing-chemical-formulae,
 * molecular-mass. No existing quizzes → fresh 3-Q quiz appended. Grounded in iesc109.pdf.
 *   node scripts/science-augment/build_ch9_b2.js [--dry]
 */
const { img, cur, reason, q, applyAug } = require('./_lib');
const DIAG = (alt, prompt) => img(alt, prompt, '4:3');

applyAug([
  // ── p105 covalent-compounds ─────────────────────────────────────────────────
  {
    slug: 'covalent-compounds',
    subtitle: 'How atoms "hold hands" by sharing electrons — and why oxygen shares twice over',
    hook: cur(
      'When two atoms join in a covalent compound, they do not give electrons away — they *share* them, like two friends sharing a tiffin so both have enough. Hydrogen atoms share just one pair. But oxygen atoms share *two* pairs — a double bond. Why do some atoms share once while others share twice?',
      'Atoms share just enough electrons to complete their outer shells.',
      'In a covalent bond, atoms share pairs of electrons so each reaches a stable outer shell. Hydrogen needs 1 more electron, so two H atoms share one pair (a single bond, H–H). Oxygen needs 2, so two O atoms share two pairs (a double bond, O=O). Atoms of different elements share too — H with Cl makes HCl; two H with one O make H₂O.'
    ),
    hero: img(
      'Two atoms overlapping and sharing a bright pair of electrons between them, glowing where they meet',
      'Ultra-wide cinematic banner (16:5 ratio). Two atoms drawn as shells around nuclei, overlapping in the middle where a bright shared pair of electrons sits between them, holding them together. Conveys bonding by sharing electrons. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Covalent bonding shown for a single bond (H₂), a double bond (O₂), and a compound (H₂O)',
      'Educational diagram of covalent bonding. Clean technical illustration on a dark background (#0a0a0a or near-black). Three labelled cases using dot diagrams: H–H with one shared pair (single bond), O=O with two shared pairs (double bond), and H₂O with hydrogen and oxygen sharing pairs. Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Each chlorine atom has 7 valence electrons and needs just 1 more to complete its octet. How do two chlorine atoms solve this together?',
      [
        'They share one pair of electrons (a single bond), so each effectively has 8',
        'One chlorine gives an electron to the other, so one is left short',
        'Each chlorine gains an electron from the air around it',
        'They share three pairs of electrons to be safe',
      ],
      0,
      'Sharing one pair lets both chlorine atoms count 8 outer electrons at once. "One gives to the other" is the trap — that would leave the donor incomplete; sharing satisfies both.',
      2),
    quiz: [
      q('A covalent bond is formed by —',
        ['sharing electrons between atoms', 'transferring electrons from one atom to another', 'one atom losing all its electrons', 'an atom gaining a neutron'], 0,
        'Covalent bonding means atoms share pairs of electrons. "Transferring electrons" is the trap — that describes ionic bonding, not covalent.',
        1),
      q('Oxygen atoms join to form O₂ with a double bond. Why a double bond?',
        ['Each oxygen needs 2 more electrons, so the two atoms share two pairs', 'Oxygen is twice as heavy as hydrogen', 'Oxygen always forms two of every bond', 'Each oxygen gives away two electrons'], 0,
        'Needing 2 electrons each, the oxygen atoms share two pairs — a double bond. "Twice as heavy" is the trap — bond type depends on electrons needed, not on mass.',
        2),
      q('CO₂ is named carbon dioxide and CO is carbon monoxide. What do the prefixes "di" and "mono" tell you?',
        [
          'The number of oxygen atoms in the molecule — two versus one',
          'How heavy each molecule is',
          'The charge carried by the carbon atom',
          'Which element is written first',
        ], 0,
        'Prefixes count atoms: "di" = two oxygens, "mono" = one. "How heavy" is the trap — the prefixes count atoms, not mass.',
        3),
    ],
  },

  // ── p106 ionic-compounds ────────────────────────────────────────────────────
  {
    slug: 'ionic-compounds',
    subtitle: 'How a violent metal and a poison gas combine into the salt on your food',
    hook: cur(
      'Table salt is one of the safest things in your kitchen. Yet it is built from two of the most dangerous substances around: sodium, a metal that bursts into flame in water, and chlorine, a poisonous green gas. How do two deadly things combine into something you sprinkle on your dinner?',
      'One atom gives an electron to the other, and the resulting opposite charges lock together.',
      'In an ionic compound, electrons are transferred: sodium gives its single outer electron to chlorine. Sodium becomes Na⁺ and chlorine becomes Cl⁻, and the opposite charges attract strongly — an ionic bond. The result, sodium chloride, is completely different from the dangerous elements it came from.'
    ),
    hero: img(
      'A burning piece of sodium metal and a swirl of green chlorine gas merging into a clean white salt crystal',
      'Ultra-wide cinematic banner (16:5 ratio). On the left a sparking piece of sodium metal and a swirl of greenish chlorine gas; they flow toward the right and resolve into a neat, glinting white cubic salt crystal. Conveys two dangerous elements forming a safe compound. Warm sparks and green haze resolving into cool white against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Electron transfer from a sodium atom to a chlorine atom, forming Na+ and Cl- ions',
      'Educational diagram of ionic bond formation. Clean technical illustration on a dark background (#0a0a0a or near-black). Show a sodium atom (2,8,1) with an arrow passing its single outer electron to a chlorine atom (2,8,7), producing Na⁺ and Cl⁻ ions drawn close together. Label "loses electron → Na⁺", "gains electron → Cl⁻", and "electrostatic attraction". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Why does a sodium atom give its electron away to chlorine rather than sharing it?',
      [
        'Sodium has only 1 valence electron, so losing it (to leave a full inner shell) is far easier than sharing',
        'Sodium is a gas, and gases always give electrons away',
        'Sodium has 7 valence electrons and must lose them all',
        'Chlorine forces sodium to give up its whole nucleus',
      ],
      0,
      'With just one outer electron, sodium reaches a full shell most easily by losing it. "7 valence electrons" is the trap — that describes chlorine, the atom that gains, not sodium.',
      2),
    quiz: [
      q('An ionic bond is formed by —',
        ['transferring electrons from one atom to another', 'sharing electrons between atoms', 'adding extra neutrons to an atom', 'removing protons from the nucleus'], 0,
        'Ionic bonding means electrons are transferred, forming oppositely charged ions. "Sharing electrons" is the trap — that is covalent bonding.',
        1),
      q('In sodium chloride, what holds the sodium and chloride ions together?',
        ['The electrostatic attraction between their opposite charges', 'A shared pair of electrons between them', 'The force of gravity between the ions', 'Extra neutrons passing between them'], 0,
        'Opposite charges (Na⁺ and Cl⁻) attract — that electrostatic pull is the ionic bond. "Shared pair of electrons" is the trap — sharing is covalent, but in NaCl electrons are transferred, not shared.',
        2),
      q('Sodium is a dangerous metal and chlorine a poisonous gas, yet sodium chloride is safe to eat. What does this best show?',
        [
          'A compound has new properties, completely different from the elements that form it',
          'Sodium and chlorine were never really dangerous',
          'The compound still secretly behaves like its elements',
          'Salt is actually just a mixture of sodium and chlorine',
        ], 0,
        'New, unrelated properties are the hallmark of a compound. "Still behaves like its elements" is the trap — that would describe a mixture, not a true compound.',
        3),
    ],
  },

  // ── p107 cations-and-anions ─────────────────────────────────────────────────
  {
    slug: 'cations-and-anions',
    subtitle: 'How a perfectly neutral atom turns positive or negative — just by moving electrons',
    hook: cur(
      'An atom is perfectly neutral — equal protons and electrons. So how does it ever end up with a positive or negative charge? The secret is that electrons can move out or move in. Lose one and the atom is left positive; grab one and it turns negative. These charged atoms have special names — and they are behind everything from salt to the signals in your nerves.',
      'Gaining or losing electrons (never protons) is what changes the charge.',
      'A cation is a positively charged ion, formed when an atom loses electrons — metals tend to do this (Na → Na⁺). An anion is negatively charged, formed when an atom gains electrons — non-metals do this (Cl → Cl⁻). The number of electrons lost or gained is the ion\'s valency. Some ions are polyatomic (whole groups of atoms), like OH⁻ and NH₄⁺.'
    ),
    hero: img(
      'One atom shedding an electron to glow positive, another capturing an electron to glow negative',
      'Ultra-wide cinematic banner (16:5 ratio). Left: an atom releasing a small electron and taking on a warm positive (+) glow. Right: an atom capturing an electron and taking on a cool negative (−) glow. Conveys cation and anion formation. Warm and cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'A sodium atom losing an electron to become Na+ (cation) and a chlorine atom gaining one to become Cl- (anion)',
      'Educational diagram of cation and anion formation. Clean technical illustration on a dark background (#0a0a0a or near-black). Top: a sodium atom losing one electron, arrow to "Na⁺ (cation, +)". Bottom: a chlorine atom gaining one electron, arrow to "Cl⁻ (anion, −)". Label cation as positive (lost electrons) and anion as negative (gained electrons). Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'A magnesium atom has the configuration 2, 8, 2. When it forms an ion, what will it become?',
      [
        'A cation, Mg²⁺ — it loses its 2 outer electrons',
        'An anion, Mg²⁻ — it gains 2 electrons',
        'A cation, Mg⁺ — it loses just 1 electron',
        'An anion, Mg⁻ — it gains 1 electron',
      ],
      0,
      'With 2 outer electrons, magnesium loses both to reach a full shell, becoming Mg²⁺. "Gains 2 (Mg²⁻)" is the trap — gaining 6 to fill the shell is far harder than losing 2, so metals lose.',
      3),
    quiz: [
      q('A positively charged ion is called a —',
        ['cation', 'anion', 'nucleon', 'isotope'], 0,
        'A positive ion is a cation (formed by losing electrons). "Anion" is the trap — that is the negative ion, formed by gaining electrons.',
        1),
      q('How does a chlorine atom become a chloride ion (Cl⁻)?',
        ['It gains one electron', 'It loses one electron', 'It gains one proton', 'It loses one neutron'], 0,
        'Chlorine gains one electron to complete its octet, becoming Cl⁻. "Loses one electron" is the trap — losing would make it positive, but Cl⁻ is negative, so it must gain.',
        2),
      q('An atom turns into an ion with a charge of 2+. What happened to it, and is it more likely a metal or a non-metal?',
        [
          'It lost 2 electrons, and it is most likely a metal',
          'It gained 2 electrons, and it is most likely a non-metal',
          'It lost 2 protons, and it is most likely a metal',
          'It gained 2 neutrons, and it is most likely a non-metal',
        ], 0,
        'A 2+ charge means two electrons were lost — typical of metals. "Lost 2 protons" is the trap — protons never leave in ordinary chemistry; only electrons move.',
        3),
    ],
  },

  // ── p108 writing-chemical-formulae ──────────────────────────────────────────
  {
    slug: 'writing-chemical-formulae',
    subtitle: 'The criss-cross trick that lets you write almost any compound\'s formula',
    hook: cur(
      'How do chemists instantly know that aluminium and oxygen make Al₂O₃ — with those exact little numbers? They do not memorise thousands of formulae. They use a quick trick called criss-cross. Learn it once, and you can write the formula of almost any compound. What is the trick?',
      'Swap each element\'s valency to become the other element\'s subscript.',
      'To write a formula: write the symbols, note each element\'s valency (or charge), and criss-cross them as subscripts. Aluminium (3) and oxygen (2) give Al₂O₃. A subscript of 1 is not written (HCl). Use brackets when a polyatomic group is taken more than once — Mg(OH)₂. Always reduce to the simplest ratio (Mg₂O₂ becomes MgO).'
    ),
    hero: img(
      'Two element symbols with their valency numbers crossing over as glowing arrows to become subscripts',
      'Ultra-wide cinematic banner (16:5 ratio). Two large element symbols side by side, each with a small valency number beneath; bright crossing arrows swap the numbers down to become subscripts, forming a compound formula. Conveys the criss-cross method. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Worked criss-cross examples building Al₂O₃ and CaCl₂ from valencies',
      'Educational diagram of the criss-cross method. Clean technical illustration on a dark background (#0a0a0a or near-black). Two worked examples with crossing arrows: Al (valency 3) and O (valency 2) → Al₂O₃; Ca (valency 2) and Cl (valency 1) → CaCl₂. Show the valency under each symbol and the arrow crossing to the subscript. Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Calcium has valency 2 and chlorine has valency 1. Using the criss-cross method, what is the formula of calcium chloride?',
      [
        'CaCl₂',
        'Ca₂Cl',
        'CaCl',
        'Ca₂Cl₂',
      ],
      0,
      'Criss-cross sends calcium\'s 2 down to chlorine and chlorine\'s 1 to calcium (not written), giving CaCl₂. "Ca₂Cl" is the trap — it crosses the numbers the wrong way.',
      2),
    quiz: [
      q('In the criss-cross method, the valency of each element becomes the —',
        ['subscript of the other element', 'charge of the same element', 'number of molecules formed', 'first letter of the symbol'], 0,
        'Each valency crosses over to become the *other* element\'s subscript. "Charge of the same element" is the trap — the value moves across to the other symbol, not stays put.',
        1),
      q('What is the formula of aluminium oxide? (aluminium valency 3, oxygen valency 2)',
        ['Al₂O₃', 'AlO', 'Al₃O₂', 'Al₂O'], 0,
        'Criss-crossing 3 and 2 gives Al₂O₃. "Al₃O₂" is the trap — it keeps each number under its own symbol instead of crossing them over.',
        2),
      q('Magnesium (valency 2) combines with the hydroxide group OH (valency 1). Why is the formula written Mg(OH)₂ and not MgOH₂?',
        [
          'Two whole hydroxide groups are needed, so brackets show the OH is taken twice',
          'Brackets simply make the formula look neater',
          'MgOH₂ and Mg(OH)₂ mean exactly the same thing',
          'The bracket shows magnesium is taken twice',
        ], 0,
        'Brackets keep the whole OH together so the "2" multiplies both O and H. "MgOH₂ means the same" is the trap — without brackets the 2 would apply only to H, which is wrong.',
        3),
    ],
  },

  // ── p109 molecular-mass ─────────────────────────────────────────────────────
  {
    slug: 'molecular-mass',
    subtitle: 'How to "weigh" a molecule you can never put on a balance',
    hook: cur(
      'You cannot put a single molecule on a weighing scale — it is far too tiny. Yet chemists confidently say a water molecule "weighs" 18 and a carbon dioxide molecule "weighs" 44. How do they weigh the unweighable?',
      'Add up the masses of all the atoms in the molecule.',
      'The molecular mass is simply the sum of the atomic masses of all the atoms in a molecule. Water (H₂O) = (2 × 1) + 16 = 18 u. Carbon dioxide (CO₂) = 12 + (2 × 16) = 44 u. No scale is needed — only addition.'
    ),
    hero: img(
      'A molecule with each atom carrying a small mass tag, the tags adding up to a total beside it',
      'Ultra-wide cinematic banner (16:5 ratio). A glowing molecule (a water-like three-atom shape) with a small numbered mass tag on each atom, and the numbers flowing together into a single total to one side. Conveys finding mass by adding atoms. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Adding atomic masses to get the molecular mass of water (18) and carbon dioxide (44)',
      'Educational diagram of molecular mass. Clean technical illustration on a dark background (#0a0a0a or near-black). Two worked sums: H₂O = (1+1) + 16 = 18 u; CO₂ = 12 + (16+16) = 44 u, with each atom and its mass labelled. Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      'Methane has the formula CH₄ (carbon = 12 u, hydrogen = 1 u). What is its molecular mass?',
      [
        '16 u',
        '13 u',
        '17 u',
        '52 u',
      ],
      0,
      'CH₄ = 12 + (4 × 1) = 16 u. "13 u" is the trap — it adds only one hydrogen (12 + 1) instead of all four.',
      2),
    quiz: [
      q('The molecular mass of a substance is found by —',
        ['adding the atomic masses of all the atoms in the molecule', 'multiplying the atomic numbers of the atoms', 'counting how many molecules are present', 'weighing a single molecule on a balance'], 0,
        'Molecular mass is the sum of the atomic masses of every atom present. "Weighing a single molecule" is the trap — a molecule is far too tiny to weigh, which is exactly why we add.',
        1),
      q('What is the molecular mass of carbon dioxide, CO₂? (carbon = 12 u, oxygen = 16 u)',
        ['44 u', '28 u', '40 u', '56 u'], 0,
        'CO₂ = 12 + (2 × 16) = 44 u. "28 u" is the trap — it counts only one oxygen (12 + 16) instead of two.',
        2),
      q('Why can\'t you find a molecule\'s mass simply by placing one molecule on a balance?',
        [
          'A single molecule is far too tiny to register on any balance, so we add up its atoms\' masses instead',
          'Molecules lose mass the moment they are weighed',
          'A balance can only weigh solids, not molecules',
          'Molecules have no mass at all until they are joined',
        ], 0,
        'Molecules are unimaginably light, so we calculate mass by adding atoms. "Molecules have no mass until joined" is the trap — atoms have mass on their own; they are just too small to weigh singly.',
        3),
    ],
  },
], 9).catch((e) => { console.error(e); process.exit(1); });
