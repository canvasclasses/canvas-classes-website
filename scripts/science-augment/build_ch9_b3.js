'use strict';
/**
 * Ch9 — AUGMENT batch 3: pages 110–113.
 * formula-unit-mass, cinnabar-india, atoms-to-applications, frontier-conservation-of-mass.
 * No existing quizzes → fresh 3-Q quiz appended. Grounded in iesc109.pdf. published stays false.
 *   node scripts/science-augment/build_ch9_b3.js [--dry]
 */
const { img, cur, reason, q, applyAug } = require('./_lib');
const DIAG = (alt, prompt) => img(alt, prompt, '4:3');

applyAug([
  // ── p110 formula-unit-mass ──────────────────────────────────────────────────
  {
    slug: 'formula-unit-mass',
    subtitle: 'Why common salt has no "molecular mass" — and what we use instead',
    hook: cur(
      'We happily talk about the molecular mass of water — but ask for the molecular mass of common salt, and a chemist will gently correct you. Salt has no molecules at all. So how do we describe the mass of something that is not made of molecules?',
      'Ionic compounds form repeating crystals, not separate molecules.',
      'Ionic compounds like sodium chloride do not exist as separate molecules — they form giant 3-D crystals of repeating ions. So instead of a molecular mass, we use the formula unit mass: the sum of the atomic masses in the simplest formula. For NaCl that is 23 + 35.5 = 58.5 u.'
    ),
    hero: img(
      'A repeating 3-D lattice of alternating sodium and chloride ions, contrasted with a single separate molecule',
      'Ultra-wide cinematic banner (16:5 ratio). On the right, a glowing repeating cubic lattice of alternating small and large ions (a salt crystal); on the left, a single small separate molecule for contrast, with a faint divider. Conveys that ionic compounds are crystals, not molecules. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Formula unit mass worked for sodium chloride (58.5) and sodium oxide (62)',
      'Educational diagram of formula unit mass. Clean technical illustration on a dark background (#0a0a0a or near-black). Two worked sums: NaCl = 23 + 35.5 = 58.5 u; Na₂O = (2 × 23) + 16 = 62 u, with each ion and its mass labelled. Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      'Calcium nitrate has the formula Ca(NO₃)₂ (Ca = 40, N = 14, O = 16). What is its formula unit mass?',
      [
        '164 u',
        '102 u',
        '70 u',
        '82 u',
      ],
      0,
      'Ca(NO₃)₂ = 40 + 2 × (14 + 3 × 16) = 40 + 2 × 62 = 164 u. "102 u" is the trap — it takes the NO₃ group only once (40 + 62) instead of twice.',
      3),
    quiz: [
      q('We use "formula unit mass" rather than "molecular mass" for —',
        ['ionic compounds', 'covalent compounds', 'single elements only', 'gases only'], 0,
        'Ionic compounds form crystals, not molecules, so we use formula unit mass. "Covalent compounds" is the trap — those do form molecules, so they have a molecular mass.',
        1),
      q('Why do we say "formula unit mass" for sodium chloride instead of "molecular mass"?',
        [
          'Sodium chloride forms a crystal of repeating ions, not separate molecules',
          'Sodium chloride is too heavy to have a molecular mass',
          'Sodium chloride contains only one kind of atom',
          'Molecular mass can only be used for gases',
        ], 0,
        'NaCl is a lattice of ions, so it has no molecules to weigh — hence formula unit mass. "Too heavy" is the trap — the reason is structural (no molecules), not about weight.',
        2),
      q('Sodium oxide has the formula Na₂O (Na = 23, O = 16). What is its formula unit mass?',
        ['62 u', '39 u', '46 u', '78 u'], 0,
        'Na₂O = (2 × 23) + 16 = 62 u. "39 u" is the trap — it counts only one sodium (23 + 16) instead of two.',
        3),
    ],
  },

  // ── p111 cinnabar-india ─────────────────────────────────────────────────────
  {
    slug: 'cinnabar-india',
    subtitle: 'How a liquid-metal poison became a brilliant red used in Indian art for thousands of years',
    hook: cur(
      'A brilliant red pigment called *hingula* has coloured Indian art and traditions for thousands of years. Its key ingredient is mercury — a liquid metal so toxic it can poison you. So how could mercury appear, in a very different form, in a red used across so many centuries?',
      'The mercury is locked into a compound with sulfur, in a fixed proportion.',
      'Hingula is cinnabar — mercury sulfide (HgS) — in which mercury and sulfur are combined in a fixed ratio, about 86% mercury and 14% sulfur by mass. As a solid compound it behaves very differently from pure liquid mercury. It is a striking real-world example of the Law of Constant Proportions (and a reminder of how toxic raw mercury is).'
    ),
    hero: img(
      'A lump of deep-red cinnabar ore beside traditional Indian red pigment used in art',
      'Ultra-wide cinematic banner (16:5 ratio). A chunk of deep crimson cinnabar mineral on the left, and on the right that red appearing as pigment in traditional Indian decorative art and patterns. Conveys an ancient mineral pigment. Warm red rim light against a deep dark background, painterly cinematic Indian-illustration style. No text overlay.'
    ),
    diagram: DIAG(
      'Cinnabar (mercury sulfide) shown with its fixed composition: about 86% mercury and 14% sulfur by mass',
      'Educational diagram of cinnabar composition. Clean technical illustration on a dark background (#0a0a0a or near-black). Show "Cinnabar (HgS)" with a bar split into about 86% labelled "Mercury (Hg)" and about 14% labelled "Sulfur (S)" by mass, illustrating a fixed proportion. Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Cinnabar found in different places always contains roughly 86% mercury and 14% sulfur by mass. Which law does this illustrate?',
      [
        'The Law of Constant Proportions',
        'The Law of Conservation of Mass',
        'Dalton\'s rule that atoms cannot be split',
        'It does not illustrate any law',
      ],
      0,
      'A fixed mass ratio of elements in a compound, regardless of source, is exactly the Law of Constant Proportions. "Conservation of Mass" is the trap — that law is about mass not changing in a reaction, not about fixed composition.',
      2),
    quiz: [
      q('Cinnabar (hingula) is a compound of mercury and —',
        ['sulfur', 'oxygen', 'chlorine', 'carbon'], 0,
        'Cinnabar is mercury sulfide, HgS — mercury joined with sulfur. "Oxygen" is the trap — that would be a mercury oxide, a different compound.',
        1),
      q('Cinnabar always contains mercury and sulfur in a fixed ratio by mass. This is an example of —',
        ['the Law of Constant Proportions', 'the Law of Conservation of Mass', 'Dalton\'s whole-number ratios only', 'the formula unit mass'], 0,
        'A fixed mass ratio in a compound is the Law of Constant Proportions. "Conservation of Mass" is the trap — that is about reactions not losing mass, not about fixed composition.',
        2),
      q('Solid cinnabar behaves very differently from the liquid mercury metal it contains. What does this best illustrate?',
        [
          'A compound can have very different properties from the element it contains',
          'Mercury is not really present in cinnabar at all',
          'Cinnabar is simply a mixture of mercury and sulfur',
          'Compounds always look exactly like their elements',
        ], 0,
        'A compound\'s properties differ from its elements — cinnabar is a red solid, mercury a silvery liquid. "Just a mixture" is the trap — in a compound the elements are chemically combined in a fixed ratio, not loosely mixed.',
        3),
    ],
  },

  // ── p112 atoms-to-applications ──────────────────────────────────────────────
  {
    slug: 'atoms-to-applications',
    subtitle: 'The same handful of atoms, combined in different ways, builds every material around you',
    hook: cur(
      'Look around the room — water, salt, the air you breathe, glass, plastic. Every single one is built from the same small set of atoms, just joined in different ways. Change which atoms combine, or how they combine, and you get a completely different substance. This whole chapter has been about that one powerful idea. So what does knowing how atoms combine actually let us do?',
      'The same elements, combined differently, give entirely different substances.',
      'This chapter showed how atoms combine — by sharing electrons (covalent) or transferring them (ionic) — always in fixed ratios, never losing mass. Understanding these rules lets scientists explain the materials we already have and design new ones: medicines, fertilisers, plastics and more all come from controlling how atoms join together.'
    ),
    hero: img(
      'A few kinds of glowing atoms assembling into many different everyday materials radiating outward',
      'Ultra-wide cinematic banner (16:5 ratio). A small set of glowing atoms at the centre, with arrows radiating out to many different everyday materials — a water droplet, a salt crystal, a medicine capsule, a sheet of plastic. Conveys that the same atoms build countless materials. Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'A flow showing atoms joining into molecules and ionic units, which build up into everyday materials',
      'Educational flow diagram. Clean technical illustration on a dark background (#0a0a0a or near-black). Three stages with arrows: "Atoms" → "Molecules / ionic units (bonding in fixed ratios)" → "Materials (water, salt, medicines, plastics)". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Carbon dioxide (CO₂) and carbon monoxide (CO) both contain only carbon and oxygen, yet they are very different gases. Why?',
      [
        'The carbon and oxygen are combined in different ratios, making different compounds',
        'They actually contain completely different elements',
        'One of them is an element, not a compound',
        'Their carbon atoms are of a different kind',
      ],
      0,
      'Same elements, different ratios (1:2 versus 1:1) give different compounds with different properties. "Different elements" is the trap — both contain exactly the same two elements; only the ratio differs.',
      2),
    quiz: [
      q('The substances around us are built from atoms held together by —',
        ['chemical bonds', 'gravity', 'magnetism', 'static cling'], 0,
        'Atoms join into substances through chemical bonds (covalent or ionic). "Gravity" is the trap — gravity acts between large masses, not between bonding atoms.',
        1),
      q('CO and CO₂ contain the same two elements but are different substances. Why?',
        [
          'The carbon and oxygen are combined in different ratios',
          'They are made of completely different elements',
          'One of them contains no carbon at all',
          'Their atoms of carbon are heavier in one than the other',
        ], 0,
        'Different ratios of the same elements make different compounds. "Different elements" is the trap — both are just carbon and oxygen, combined differently.',
        2),
      q('Why does understanding how atoms combine help scientists create new materials such as medicines and plastics?',
        [
          'Knowing the rules of bonding and ratios lets them control which compounds form',
          'It lets them create brand-new elements from nothing',
          'It removes the need to do any experiments at all',
          'It lets them ignore the Law of Conservation of Mass',
        ], 0,
        'Mastering bonding and ratios is what lets chemists design specific compounds. "Create new elements from nothing" is the trap — chemistry rearranges atoms; it does not make new elements out of nothing.',
        3),
    ],
  },

  // ── p113 frontier-conservation-of-mass ──────────────────────────────────────
  {
    slug: 'frontier-conservation-of-mass',
    subtitle: 'The one place chemistry\'s golden rule quietly bends — inside the Sun and a nuclear reactor',
    hook: cur(
      'You just learned an iron rule: mass is never created or destroyed. But in the heart of the Sun — and inside a nuclear reactor — that rule quietly bends. A tiny sliver of mass simply vanishes, reappearing as a colossal burst of energy. How can mass turn into energy, and why doesn\'t this break chemistry\'s golden rule?',
      'In nuclear reactions, mass and energy can convert into each other.',
      'In ordinary chemical reactions, mass is conserved. But in nuclear reactions — like those powering the Sun or a reactor — a tiny amount of mass is converted into an enormous amount of energy, captured by Einstein\'s famous equation E = mc². Mass alone is not conserved here, but mass and energy together are. That is how the Sun shines and how reactors generate power.'
    ),
    hero: img(
      'The blazing core of the Sun (or a reactor) where a tiny speck of mass erupts into a vast burst of energy',
      'Ultra-wide cinematic banner (16:5 ratio). A blazing stellar/reactor core at the centre, with a tiny speck of matter on one side erupting into a vast radiant burst of energy on the other. Conveys a little mass becoming enormous energy. Intense warm core light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Einstein\'s mass-energy relation E = mc² shown as a tiny mass converting to a huge amount of energy',
      'Educational diagram of mass-energy conversion. Clean technical illustration on a dark background (#0a0a0a or near-black). Show a tiny labelled mass "m" with an arrow through the equation "E = mc²" leading to a large burst labelled "huge energy E". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'The Law of Conservation of Mass holds perfectly for chemical reactions but seems to fail in nuclear reactions. What is the best explanation?',
      [
        'In nuclear reactions a tiny mass converts into a large amount of energy, so mass and energy together are still conserved',
        'The Law of Conservation of Mass was simply wrong all along',
        'Mass in nuclear reactions is destroyed for no reason at all',
        'Nuclear reactions create brand-new mass out of nothing',
      ],
      0,
      'A little mass becomes energy (E = mc²), and the mass–energy total is still conserved — so the law isn\'t broken, just extended. "Simply wrong" is the trap — the law holds exactly for chemistry; nuclear reactions are a different, deeper case.',
      3),
    quiz: [
      q('In a nuclear reaction, a small amount of mass is converted into —',
        ['energy', 'extra mass', 'a new element only', 'nothing at all'], 0,
        'A tiny mass becomes a huge amount of energy in nuclear reactions. "Extra mass" is the trap — mass is lost (converted to energy), not gained.',
        1),
      q('Which equation links the lost mass to the energy released in a nuclear reaction?',
        ['E = mc²', 'F = ma', 'v = u + at', 'PV = nRT'], 0,
        'Einstein\'s E = mc² relates the converted mass to the energy released. "F = ma" is the trap — that is Newton\'s law of motion, not mass–energy conversion.',
        2),
      q('Why doesn\'t the conversion of mass into energy in the Sun break chemistry\'s Law of Conservation of Mass?',
        [
          'That law applies to chemical reactions; in nuclear reactions, mass and energy together are conserved even though mass alone is not',
          'The Sun is too far away for the law to apply there',
          'Mass in the Sun is destroyed for no reason at all',
          'The law has been completely abandoned by scientists',
        ], 0,
        'Conservation of mass is a chemistry rule; nuclear reactions obey the wider conservation of mass-energy. "Too far away" is the trap — physical laws don\'t depend on distance; the point is that nuclear reactions are a different kind of process.',
        3),
    ],
  },
], 9).catch((e) => { console.error(e); process.exit(1); });
