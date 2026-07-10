'use strict';
/**
 * Ch9 "Atomic Foundations of Matter" — AUGMENT batch 1: pages 100–104.
 * daltons-atomic-theory, law-of-conservation-of-mass, law-of-constant-proportion,
 * atoms-vs-molecules, elements-and-compounds. No existing quizzes → fresh 3-Q quiz
 * appended to each. Grounded in iesc109.pdf. published stays false.
 *   node scripts/science-augment/build_ch9_b1.js [--dry]
 */
const { img, cur, reason, q, applyAug } = require('./_lib');
const DIAG = (alt, prompt) => img(alt, prompt, '4:3');

applyAug([
  // ── p100 daltons-atomic-theory ──────────────────────────────────────────────
  {
    slug: 'daltons-atomic-theory',
    subtitle: 'How John Dalton turned a 2,000-year-old guess about atoms into testable science',
    hook: cur(
      'For 2,000 years the atom was just an idea — a philosopher\'s guess that matter is made of tiny uncuttable bits. Then John Dalton did something new: he turned the guess into science. With a handful of simple rules, he could suddenly explain *why* substances always combine in fixed amounts, and *why* mass never vanishes in a reaction. What were these rules that finally put the atom on solid ground?',
      'His rules were about what atoms are, and how they join to form compounds.',
      'Dalton\'s atomic theory (1808) is a set of postulates: all matter is made of atoms; atoms are indivisible and cannot be created or destroyed; atoms of one element are identical and differ from those of other elements; and atoms combine in simple whole-number ratios to form compounds. These few rules explained the laws of chemical combination.'
    ),
    hero: img(
      'John Dalton with glowing spherical atoms combining in simple, neat whole-number groupings around him',
      'Ultra-wide cinematic banner (16:5 ratio). A thoughtful 19th-century scientist on the left, and to the right glowing spherical atoms of two colours snapping together into tidy small groups (one-to-one, one-to-two), suggesting simple whole-number combination. Conveys turning a vague idea into orderly rules. Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Dalton\'s key postulates shown as simple icons: indivisible atoms, identical atoms per element, and whole-number combining',
      'Educational diagram of Dalton\'s atomic postulates. Clean technical illustration on a dark background (#0a0a0a or near-black). Three labelled panels: (1) a single solid atom that cannot be split — "Atoms are indivisible"; (2) several identical spheres of one colour — "Atoms of an element are alike"; (3) two coloured spheres joining one-to-one and one-to-two — "Atoms combine in whole-number ratios". Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Dalton said atoms are never created or destroyed in a reaction — they only rearrange. Which everyday observation does this directly explain?',
      [
        'The total mass stays the same before and after a chemical reaction',
        'Compounds always look different from their elements',
        'Atoms of different elements have different masses',
        'Gases are lighter than the liquids they form',
      ],
      0,
      'If atoms are merely rearranged and none vanish, the total mass cannot change — that is conservation of mass. "Compounds look different" is true but follows from new arrangements, not from atoms being conserved.',
      2),
    quiz: [
      q('Who proposed the atomic theory in 1808?',
        ['John Dalton', 'Antoine Lavoisier', 'Joseph Proust', 'Democritus'], 0,
        'John Dalton proposed the scientific atomic theory in 1808. "Democritus" is the trap — he imagined indivisible atoms long before, but as philosophy, not as Dalton\'s tested theory.',
        1),
      q('According to Dalton, the atoms of the same element are —',
        ['identical in mass and chemical properties', 'always different from one another', 'able to be created during reactions', 'able to be destroyed during reactions'], 0,
        'Dalton held that atoms of one element are identical in mass and properties. "Able to be created" contradicts his rule that atoms can be neither created nor destroyed.',
        2),
      q('Dalton said atoms combine in simple whole-number ratios. Why can\'t 1.5 atoms of oxygen join with one atom of carbon?',
        [
          'Atoms are indivisible, so you cannot have half an atom — they combine only as whole units',
          'Oxygen atoms are too heavy to split in half',
          'Carbon will only ever join with one oxygen atom',
          'Half-atoms exist, but they are simply too unstable',
        ], 0,
        'Since atoms cannot be divided, they join only as whole units, never as halves. "Too heavy to split" is the trap — the reason is that atoms are indivisible, not that they are heavy.',
        3),
    ],
  },

  // ── p101 law-of-conservation-of-mass ────────────────────────────────────────
  {
    slug: 'law-of-conservation-of-mass',
    subtitle: 'Why an open flask seems to lose weight in a reaction — and a sealed one never does',
    hook: cur(
      'Mix vinegar and baking soda in an open flask and weigh it before and after — and the flask gets *lighter*. Mass seems to vanish into thin air. But seal the very same reaction in a closed flask, and not a single gram is lost. Where does the "missing" mass go, and what does that difference reveal?',
      'A gas is produced in the reaction — and in the open flask it escapes.',
      'Mass is never really lost. The reaction makes carbon dioxide gas; in an open flask the gas escapes, so the flask seems lighter, but in a closed flask the gas stays and the mass is unchanged. This is the Law of Conservation of Mass (Antoine Lavoisier, 1789): in a chemical reaction, matter is neither created nor destroyed.'
    ),
    hero: img(
      'A balance comparing an open flask with gas escaping upward and a sealed flask holding all its gas in, weights tipping unequal',
      'Ultra-wide cinematic banner (16:5 ratio). Two flasks of a fizzing reaction side by side on balances: the left flask is open with wisps of gas escaping upward (its pan rising, lighter); the right flask is sealed with the gas trapped inside (its pan level, unchanged). Conveys that escaping gas, not lost mass, causes the difference. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Side-by-side: an open reaction flask losing mass as gas escapes versus a closed flask keeping the same mass',
      'Educational diagram of conservation of mass. Clean technical illustration on a dark background (#0a0a0a or near-black). Left: an open flask on a balance, gas-arrow escaping, reading lower — labelled "Open: gas escapes, seems lighter". Right: a sealed flask on a balance, gas trapped, reading the same before and after — labelled "Closed: mass unchanged". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      '12 g of carbon reacts completely with 32 g of oxygen to form carbon dioxide. By the Law of Conservation of Mass, what mass of carbon dioxide is produced?',
      [
        '44 g',
        '32 g',
        '20 g',
        '12 g',
      ],
      0,
      'No mass is lost, so the product\'s mass equals the reactants\' total: 12 + 32 = 44 g. "20 g" is the trap — that is the difference of the masses, but mass is added in a reaction, not subtracted.',
      3),
    quiz: [
      q('The Law of Conservation of Mass was proposed by —',
        ['Antoine Lavoisier', 'John Dalton', 'Joseph Proust', 'James Chadwick'], 0,
        'Lavoisier proposed the Law of Conservation of Mass in 1789. "Dalton" is the trap — his atomic theory later explained the law, but he did not propose it.',
        1),
      q('Why does an open flask appear to lose mass when vinegar reacts with baking soda?',
        [
          'The carbon dioxide gas produced escapes into the air',
          'The liquid completely evaporates during the reaction',
          'Some of the mass is destroyed by the reaction',
          'The flask itself soaks up part of the mass',
        ], 0,
        'A gas forms and leaves the open flask, so the remaining contents weigh less. "Mass is destroyed" is the trap — mass cannot be destroyed; it simply left as gas.',
        2),
      q('In a sealed container, 4.0 g of calcium carbonate reacts with 2.92 g of acid to give 1.76 g of carbon dioxide, 0.72 g of water, and some calcium chloride. What mass of calcium chloride forms?',
        [
          '4.44 g',
          '6.92 g',
          '2.48 g',
          '8.40 g',
        ], 0,
        'Total reactants = 6.92 g, so products must also total 6.92 g; 6.92 − 1.76 − 0.72 = 4.44 g. "6.92 g" is the trap — that is the whole product mass, not the calcium chloride alone.',
        3),
    ],
  },

  // ── p102 law-of-constant-proportion ─────────────────────────────────────────
  {
    slug: 'law-of-constant-proportion',
    subtitle: 'Why water from a river, a borewell, or the sea always carries the same exact recipe',
    hook: cur(
      'Scoop water from a Himalayan river, a borewell in Rajasthan, or the Arabian Sea, purify it, and break it apart. Every single time, you get hydrogen and oxygen in exactly the same ratio by mass — 1 to 8. Not roughly — exactly. How can water from completely different places always carry the same recipe?',
      'A compound\'s elements always combine in one fixed ratio by mass.',
      'This is the Law of Constant Proportions (Joseph Proust): in any compound, the elements are present in a fixed ratio by mass, no matter the source. Pure water is always hydrogen : oxygen = 1 : 8 by mass. Change that ratio and it is simply no longer water.'
    ),
    hero: img(
      'Water gathered from three very different sources — mountain river, borewell, and sea — each splitting into the same 1-to-8 split',
      'Ultra-wide cinematic banner (16:5 ratio). Three water sources across the frame — a mountain river, a hand-pump borewell, and an ocean wave — each with a glowing droplet that separates into a small hydrogen portion and a larger oxygen portion in the same proportion. Conveys identical composition from different sources. Cool blue rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Water always splitting into hydrogen and oxygen in a fixed 1 to 8 mass ratio',
      'Educational diagram of constant proportions. Clean technical illustration on a dark background (#0a0a0a or near-black). Show a water sample separating into a small bar labelled "Hydrogen 1 part" and a large bar labelled "Oxygen 8 parts", with the fixed ratio "1 : 8 by mass" highlighted. Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      'Students X and Y each made copper oxide by combining copper and oxygen — X in the ratio 4 : 1 and Y in the ratio 8 : 2. Do their results obey the Law of Constant Proportions?',
      [
        'Yes — 4 : 1 and 8 : 2 are the same ratio, so the proportion is constant',
        'No — the two ratios use different numbers, so they differ',
        'Only if both students used exactly the same total mass',
        'It cannot be decided without weighing the products',
      ],
      0,
      'The ratio 8 : 2 simplifies to 4 : 1, so both students found the same proportion — exactly what the law predicts. "Different numbers, so they differ" is the trap — it ignores that the ratios reduce to the same value.',
      3),
    quiz: [
      q('The Law of Constant Proportions was proposed by —',
        ['Joseph Proust', 'Antoine Lavoisier', 'John Dalton', 'Niels Bohr'], 0,
        'Joseph Proust proposed the Law of Constant (or Definite) Proportions. "Lavoisier" is the trap — he gave the law of conservation of mass, a different law.',
        1),
      q('Pure water always contains hydrogen and oxygen in the mass ratio —',
        ['1 : 8', '8 : 1', '1 : 1', '2 : 1'], 0,
        'By mass, water is always hydrogen : oxygen = 1 : 8. "2 : 1" is the classic trap — that is the ratio of the number of atoms (two H to one O), not the ratio of their masses.',
        2),
      q('Sodium chloride contains sodium and chlorine in the mass ratio 23 : 35.5. If 46 g of sodium reacts completely, what mass of chlorine combines with it?',
        ['71 g', '35.5 g', '46 g', '58.5 g'], 0,
        'Doubling sodium from 23 g to 46 g doubles the chlorine too: 35.5 × 2 = 71 g. "35.5 g" is the trap — that is the chlorine for only 23 g of sodium, not 46 g.',
        3),
    ],
  },

  // ── p103 atoms-vs-molecules ─────────────────────────────────────────────────
  {
    slug: 'atoms-vs-molecules',
    subtitle: 'Why the oxygen you breathe almost never travels as single atoms — and what a molecule really is',
    hook: cur(
      'The oxygen keeping you alive almost never floats around as single atoms. It travels in pairs — O₂ — two atoms joined together. In fact, an "atom" and a "molecule" are not the same thing at all, and mixing them up is one of the most common mistakes in chemistry. What exactly is the difference?',
      'A molecule is two or more atoms joined together.',
      'An atom is the smallest particle of an element. A molecule is a group of two or more atoms joined together that can exist on its own and shows all the properties of the substance — like O₂ (a molecule of an element) or H₂O (a molecule of a compound). Most substances around you exist as molecules, not lone atoms.'
    ),
    hero: img(
      'Lone single atoms drifting on one side and joined-up molecules on the other, clearly contrasted',
      'Ultra-wide cinematic banner (16:5 ratio). Left: a few single glowing atoms drifting alone. Right: atoms bonded into small molecules — a pair (O₂) and a three-atom bent shape (H₂O) — clearly joined. A faint dividing line separates "atoms" from "molecules". Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'An atom compared with molecules — a single O atom, an O₂ molecule of an element, and an H₂O molecule of a compound',
      'Educational diagram comparing an atom and molecules. Clean technical illustration on a dark background (#0a0a0a or near-black). Three labelled items: a single sphere "Atom (O)"; two spheres joined "Molecule of an element (O₂)"; two small spheres bonded to one larger "Molecule of a compound (H₂O)". Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Oxygen in the air exists as O₂, not as single O atoms. What does the small "2" tell you?',
      [
        'Two oxygen atoms are joined together in each molecule',
        'The oxygen has a charge of 2',
        'There are two different elements present',
        'The oxygen weighs exactly 2 units',
      ],
      0,
      'The subscript 2 counts the atoms in the molecule — here, two oxygen atoms bonded together. "A charge of 2" is the trap — subscripts count atoms; charges are written differently, as superscripts.',
      2),
    quiz: [
      q('A molecule is best described as —',
        ['a group of two or more atoms joined together', 'the smallest particle of an element', 'an atom that has gained a charge', 'the central nucleus of an atom'], 0,
        'A molecule is two or more joined atoms that can exist independently. "Smallest particle of an element" is the trap — that defines an atom, not a molecule.',
        1),
      q('Which of these is a molecule of an element (not a compound)?',
        ['O₂', 'H₂O', 'CO₂', 'NaCl'], 0,
        'O₂ contains only one kind of atom, so it is a molecule of an element. "H₂O" is the trap — it has two different elements, making it a molecule of a compound.',
        2),
      q('Why is H₂O called a molecule of a compound, while O₂ is a molecule of an element?',
        [
          'H₂O contains two different elements joined together, while O₂ contains atoms of only one element',
          'H₂O has more atoms than O₂',
          'O₂ is a gas, while H₂O is a liquid',
          'H₂O is heavier than O₂',
        ], 0,
        'A compound needs two or more different elements joined — H₂O has hydrogen and oxygen, O₂ has only oxygen. "More atoms" is the trap — the count of atoms does not decide element-versus-compound; the number of *different* elements does.',
        3),
    ],
  },

  // ── p104 elements-and-compounds ─────────────────────────────────────────────
  {
    slug: 'elements-and-compounds',
    subtitle: 'How two "fiery" gases combine into water — the substance that puts fire out',
    hook: cur(
      'Hydrogen gas catches fire easily. Oxygen makes fires burn fiercely. Put them together and you would expect an even bigger blaze — instead you get water, which puts fires out. How can two "fiery" elements combine into something that does the exact opposite?',
      'When elements chemically combine into a compound, the compound gets completely new properties.',
      'An element is made of just one kind of atom; a compound is two or more elements chemically joined in a fixed ratio. A compound has entirely new properties, unlike the elements it came from — which is exactly why burnable hydrogen and fire-feeding oxygen combine to make fire-quenching water.'
    ),
    hero: img(
      'A hydrogen flame and a burst of oxygen flowing together and transforming into a calm water droplet',
      'Ultra-wide cinematic banner (16:5 ratio). On the left a small hydrogen flame and a swirl suggesting oxygen; they flow toward the centre and transform on the right into a single calm, glistening water droplet. Conveys two reactive elements forming a compound with opposite properties. Warm flame light resolving into cool blue against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Elements versus a compound: hydrogen and oxygen as separate elements combining into the compound water',
      'Educational diagram of element versus compound. Clean technical illustration on a dark background (#0a0a0a or near-black). Left: two separate boxes labelled "Element: Hydrogen (H₂)" and "Element: Oxygen (O₂)". An arrow leads to the right box labelled "Compound: Water (H₂O)" with a note "new properties". Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Water behaves nothing like hydrogen or oxygen. What does this tell you about a compound?',
      [
        'A compound has new properties, different from the elements that formed it',
        'A compound simply keeps the properties of its elements mixed together',
        'Water is really just a mixture of hydrogen and oxygen',
        'The elements inside a compound are completely unchanged',
      ],
      0,
      'A compound\'s properties are new — water neither burns nor feeds fire, unlike its elements. "Keeps the properties of its elements" is the trap — that describes a mixture, not a compound.',
      3),
    quiz: [
      q('A substance made of only one kind of atom is —',
        ['an element', 'a compound', 'a mixture', 'a molecule of a compound'], 0,
        'One kind of atom means it is an element. "A compound" is the trap — that needs two or more different kinds of atoms chemically joined.',
        1),
      q('Water is made from hydrogen and oxygen. Why is water a compound and not a mixture?',
        [
          'Its elements are chemically combined in a fixed ratio and it has new properties',
          'Its hydrogen and oxygen can be separated just by filtering',
          'It keeps all the properties of hydrogen and of oxygen',
          'The two gases are simply mixed together loosely',
        ], 0,
        'In a compound the elements are chemically bonded in a fixed ratio, giving new properties. "Separated by filtering" is the trap — that is how mixtures separate; a compound\'s elements are chemically joined.',
        2),
      q('Hydrogen burns and oxygen supports burning, yet water does neither. What does this best show?',
        [
          'A compound\'s properties are entirely different from those of the elements that make it',
          'Hydrogen and oxygen lose all their atoms when they form water',
          'Water must contain a third hidden element',
          'The properties of a compound are the average of its elements\'',
        ], 0,
        'New, unrelated properties are the hallmark of a compound. "Average of its elements" is the trap — compound properties are genuinely new, not a blend or average of the originals.',
        3),
    ],
  },
], 9).catch((e) => { console.error(e); process.exit(1); });
