'use strict';
/**
 * Ch8 "Journey Inside the Atom" — AUGMENT batch 2: pages 90–95.
 * electron-distribution, valence-electrons-and-valency, atomic-number-and-mass-number,
 * isotopes, isobars, iupac-symbols. Grounded in iesc108.pdf. published stays false.
 *   node scripts/science-augment/build_ch8_b2.js [--dry]
 */
const { img, cur, reason, q, applyAug } = require('./_lib');
const DIAG = (alt, prompt) => img(alt, prompt, '4:3');

applyAug([
  // ── p90 electron-distribution ───────────────────────────────────────────────
  {
    slug: 'electron-distribution',
    subtitle: 'Why each shell holds a fixed number of electrons — and the tidy 2n² rule behind it',
    hook: cur(
      'Every shell in an atom can hold only so many electrons — the first just 2, the next 8, the next 18 — and then it is full and refuses to take any more. These are not random numbers. They follow a neat little formula: 2n². Why would nature pack electrons into shells by such a tidy mathematical rule?',
      'Here n is the shell number — 1 for K, 2 for L, 3 for M.',
      'The most electrons a shell can hold is 2n²: K (n=1) holds 2, L (n=2) holds 8, M (n=3) holds 18. Electrons fill up from the innermost shell outward, and the outermost shell never holds more than 8. This arrangement of electrons in the shells is the electronic configuration.'
    ),
    hero: img(
      'A row of atoms from hydrogen onward, each with its electrons filling glowing shells one by one',
      'Ultra-wide cinematic banner (16:5 ratio). A left-to-right row of atoms growing from a single-electron atom to larger ones, each shown with a bright nucleus and concentric shells filling steadily with glowing electrons. Conveys electrons being added shell by shell. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'A chart showing the maximum electrons each shell holds by the 2n-squared rule',
      'Educational diagram of electron shell capacities. Clean technical illustration on a dark background (#0a0a0a or near-black). Show a nucleus with concentric shells K, L, M, N and the maximum electrons each holds: K = 2 (2x1squared), L = 8 (2x2squared), M = 18 (2x3squared), N = 32 (2x4squared). Label each shell and its capacity. Dark background, orange accent labels and thin leader lines, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      'The M-shell is the third shell (n = 3). Using the rule 2n², what is the greatest number of electrons it can hold?',
      [
        '18',
        '8',
        '9',
        '6',
      ],
      0,
      '2n² with n = 3 gives 2 × 9 = 18. "9" is the trap — that is just n² (3 × 3); you must remember to double it, because each position holds two electrons.',
      2),
    quiz: [
      q('What is the greatest number of electrons the first shell (K-shell) can hold?',
        ['2', '8', '18', '1'], 0,
        'Using 2n² with n = 1 gives 2 × 1 = 2, so the K-shell holds at most 2 electrons. "8" is the trap — that is the L-shell\'s capacity, not the K-shell\'s.',
        1),
      q('Sodium has 11 electrons. What is its electronic configuration?',
        ['2, 8, 1', '2, 9', '8, 3', '1, 8, 2'], 0,
        'Fill from the inside out: K takes 2, L takes 8, leaving 1 for M — so 2, 8, 1. "2, 9" is the trap, because the L-shell can never hold 9 (its limit is 8).',
        2),
      q('An atom has 12 electrons. Why is its configuration 2, 8, 2 and not 2, 2, 8?',
        [
          'Shells fill from the innermost outward, so K fills (2), then L fills (8), and only the leftover 2 go to M',
          'The outer shells always fill before the inner ones',
          'The M-shell can hold only 2 electrons in total',
          'Electrons are shared equally between the first three shells',
        ], 0,
        'Electrons always fill the lowest shell first, so K and L fill completely before M gets the remaining 2. "Outer shells fill first" is the exact reverse of how filling works.',
        3),
    ],
  },

  // ── p91 valence-electrons-and-valency ───────────────────────────────────────
  {
    slug: 'valence-electrons-and-valency',
    subtitle: 'Why sodium explodes in water but neon does nothing — the story is all in the outermost shell',
    hook: cur(
      'Drop a tiny piece of sodium into water and it fizzes, races across the surface, and can burst into flame. Put neon into water and… nothing happens, ever. Both are made of atoms — so why is one so desperate to react while the other stays completely calm? The whole answer is hidden in just the outermost ring of electrons.',
      'A full outermost shell — 8 electrons (or 2 for the smallest atoms) — makes an atom stable.',
      'The outermost shell is the valence shell, and its electrons are valence electrons. An atom with a full outer shell — an octet of 8 (or 2 for helium) — is stable and unreactive, like neon. Atoms with incomplete outer shells, like sodium, lose, gain, or share electrons to complete the octet. The number of electrons gained, lost, or shared is the valency.'
    ),
    hero: img(
      'Split scene: a violently reacting metal throwing off sparks on one side, a calm glowing noble-gas atom on the other',
      'Ultra-wide cinematic banner (16:5 ratio). Left side: a small piece of reactive metal fizzing and sparking on water, energetic and bright. Right side: a single calm, glowing noble-gas atom, serene and still. Conveys the contrast between a reactive atom and a stable one. Warm sparks on the left, cool calm glow on the right, against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Outer shells compared: sodium with 1 valence electron, oxygen with 6, and neon with a full octet of 8',
      'Educational diagram comparing valence shells. Clean technical illustration on a dark background (#0a0a0a or near-black). Three atoms side by side showing only their shells and electron counts: Sodium (2, 8, 1) with one lonely outer electron; Oxygen (2, 6) with six outer electrons; Neon (2, 8) with a full outer shell of eight. Label valence electrons and mark Neon\'s shell as a complete octet. Dark background, orange accent labels and thin leader lines, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Sodium (2, 8, 1) reacts very easily, but neon (2, 8) does not react at all. What best explains the difference?',
      [
        'Neon\'s outer shell is already full (an octet), so it is stable; sodium has just 1 outer electron and reacts to reach a full shell',
        'Neon is a gas, and gases never react with anything',
        'Sodium has more shells than neon, which makes it reactive',
        'Neon\'s nucleus is far heavier, holding its electrons still',
      ],
      0,
      'A full octet makes neon stable, while sodium\'s single outer electron drives it to react and reach a full shell. "Gases never react" is the trap — many gases (like oxygen and chlorine) react strongly; neon\'s calm comes from its full outer shell, not from being a gas.',
      2),
    quiz: [
      q('The electrons present in the outermost shell of an atom are called —',
        ['valence electrons', 'nucleons', 'protons', 'isotopes'], 0,
        'The outermost-shell electrons are the valence electrons; they decide how an atom reacts. "Nucleons" is the trap — those are the protons and neutrons inside the nucleus, not the outer electrons.',
        1),
      q('Chlorine has the electronic configuration 2, 8, 7. What is its valency?',
        ['1', '7', '8', '0'], 0,
        'Chlorine needs just 1 more electron to complete its octet, so its valency is 1. "7" is the trap — that is the number of valence electrons it has, not the number it needs to gain.',
        2),
      q('Oxygen has the configuration 2, 6. Why is its valency 2?',
        [
          'It has 6 valence electrons and gains 2 more to complete its octet of 8',
          'It has 6 valence electrons, so it simply loses all 6',
          'Its valency is always equal to its 6 valence electrons',
          'It shares all 8 electrons with another atom',
        ], 0,
        'With 6 outer electrons, oxygen gains 2 to reach a full octet, giving a valency of 2. "Loses all 6" is the trap — losing 6 is far harder than gaining 2, so atoms take the easier route to a full shell.',
        3),
    ],
  },

  // ── p92 atomic-number-and-mass-number ───────────────────────────────────────
  {
    slug: 'atomic-number-and-mass-number',
    subtitle: 'The one number that decides which element an atom is — and how we count what\'s in its nucleus',
    hook: cur(
      'Change just one number inside an atom — the number of protons — and gold becomes mercury, or carbon becomes nitrogen. That single number is the atom\'s identity card: it decides which element it is, more surely than its weight, its colour, or anything else. What is this number, and why does it matter more than anything else inside the atom?',
      'It is the number of protons in the nucleus.',
      'The atomic number (Z) is the number of protons — it defines which element an atom is. The mass number (A) is the total of protons and neutrons (the nucleons). Electrons are far too light to count toward the mass. And the number of neutrons is simply A − Z.'
    ),
    hero: img(
      'A glowing nucleus on a pedestal like an identity badge, its proton count marking which element it is',
      'Ultra-wide cinematic banner (16:5 ratio). A single glowing atomic nucleus presented at the centre like an identity badge, its protons clearly clustered, with faint element-symbol motifs in the dark background. Conveys that the proton count is an atom\'s identity. Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'The standard atom notation showing mass number on top and atomic number below the element symbol, with carbon as the example',
      'Educational diagram of atomic notation. Clean technical illustration on a dark background (#0a0a0a or near-black). Show a large element symbol C with the mass number 12 written at the top-left and the atomic number 6 at the bottom-left. Add brief callouts: "Mass number (A) = protons + neutrons" and "Atomic number (Z) = protons". Dark background, orange accent labels and thin leader lines, clean technical illustration style. No photorealism.'
    ),
    reason: reason('quantitative',
      'An atom has atomic number 17 and mass number 35. How many neutrons are in its nucleus?',
      [
        '18',
        '17',
        '35',
        '52',
      ],
      0,
      'Neutrons = mass number − atomic number = 35 − 17 = 18. "17" is the trap — that is the proton count (the atomic number), not the neutron count; you must subtract it from the mass number.',
      2),
    quiz: [
      q('The atomic number of an element is equal to the number of —',
        ['protons in its nucleus', 'neutrons in its nucleus', 'protons and neutrons together', 'electrons in its outer shell'], 0,
        'The atomic number is the proton count, which fixes the element\'s identity. "Protons and neutrons together" is the trap — that total is the mass number, not the atomic number.',
        1),
      q('An atom has 11 protons and 12 neutrons. What is its mass number?',
        ['23', '11', '12', '1'], 0,
        'Mass number = protons + neutrons = 11 + 12 = 23. "11" is the trap — that is only the proton count (the atomic number); the mass number adds the neutrons too.',
        2),
      q('Two atoms have the same number of protons but different numbers of neutrons. Are they the same element?',
        [
          'Yes — the proton number (atomic number) decides the element, and it is the same for both',
          'No — different neutron numbers always make them different elements',
          'Only if their mass numbers also turn out to be equal',
          'It cannot be decided without knowing the electrons',
        ], 0,
        'An element is defined by its proton count, so atoms with the same protons are the same element regardless of neutrons. "Different neutrons make different elements" is the trap — that change makes isotopes of the same element, not new elements.',
        3),
    ],
  },

  // ── p93 isotopes ────────────────────────────────────────────────────────────
  {
    slug: 'isotopes',
    subtitle: 'Atoms of one element that come in different weights — and how that lets us read the age of the past',
    hook: cur(
      'How can scientists look at a 5,000-year-old bone, or a scrap of ancient wood, and tell almost exactly how old it is? The secret is a special "heavy" version of carbon, hidden inside every living thing. Atoms of the very same element can come in slightly different weights — and that small difference lets us read the age of the past.',
      'These are atoms of the same element with different numbers of neutrons.',
      'Isotopes are atoms of the same element — same number of protons — but with different numbers of neutrons, so different mass numbers. Carbon comes as carbon-12, carbon-13, and carbon-14. They behave the same chemically (same valence electrons) but differ in mass — and carbon-14 is used to find the age of ancient things.'
    ),
    hero: img(
      'An archaeologist examining an ancient bone, with three carbon atoms of slightly different weight glowing beside it',
      'Ultra-wide cinematic banner (16:5 ratio). On the left, hands carefully holding an ancient bone or artefact under soft light; on the right, three glowing carbon atoms shown with the same electron arrangement but slightly different nuclei (different neutron counts). Conveys reading the age of the past through isotopes of carbon. Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'The three isotopes of hydrogen — protium, deuterium, tritium — each with one proton but different neutron counts',
      'Educational diagram of hydrogen isotopes. Clean technical illustration on a dark background (#0a0a0a or near-black). Three atoms side by side, each with one electron orbiting: Protium (1 proton, 0 neutrons), Deuterium (1 proton, 1 neutron), Tritium (1 proton, 2 neutrons). Label each isotope and its nucleus contents. Dark background, orange accent labels and thin leader lines, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Two atoms each have 11 protons; one has 12 neutrons and the other has 13. Are they the same element, and are they isotopes?',
      [
        'Same element (both have 11 protons) and yes, they are isotopes — same protons, different neutrons',
        'Different elements, because the neutron counts differ',
        'Same element, but they are isobars, not isotopes',
        'It cannot be decided without knowing their electrons',
      ],
      0,
      'Same proton count means the same element, and same protons with different neutrons is exactly the definition of isotopes. "Isobars" is the trap — isobars are *different* elements with the *same* mass number, which is the opposite situation.',
      3),
    quiz: [
      q('Isotopes are atoms of the same element that have —',
        ['different numbers of neutrons', 'different numbers of protons', 'different numbers of electrons', 'the same mass number'], 0,
        'Isotopes share the proton count but differ in neutrons, giving different masses. "Different numbers of protons" is the trap — changing the protons would make a different element altogether, not an isotope.',
        1),
      q('Carbon-12 and carbon-14 are isotopes. How do they differ?',
        [
          'Carbon-14 has two more neutrons than carbon-12, but the same number of protons',
          'Carbon-14 has two more protons than carbon-12',
          'Carbon-14 has two more electrons than carbon-12',
          'They have completely different numbers of protons and neutrons',
        ], 0,
        'Both are carbon (6 protons); carbon-14 simply carries two extra neutrons. "Two more protons" is the trap — adding protons would change carbon into a different element, not give another carbon isotope.',
        2),
      q('Why do all the isotopes of an element show the same chemical behaviour?',
        [
          'They have the same number of electrons, and chemistry depends on electrons, not neutrons',
          'They have the same number of neutrons',
          'They all have exactly the same mass',
          'Neutrons control how an atom reacts chemically',
        ], 0,
        'Chemical behaviour is decided by the electrons (especially valence electrons), which are identical across isotopes. "Neutrons control reactions" is the trap — neutrons change the mass but not the chemistry.',
        3),
    ],
  },

  // ── p94 isobars ─────────────────────────────────────────────────────────────
  {
    slug: 'isobars',
    subtitle: 'Three different elements that weigh exactly the same — how can that be?',
    hook: cur(
      'Calcium, potassium, and argon are three completely different things — a reactive metal, another reactive metal, and a gas that does almost nothing. They behave differently and sit in different places on the periodic table. Yet weigh a single atom of each, and they can come out exactly the same. How can three different elements weigh precisely alike?',
      'They have the same total number of particles in the nucleus, just split between protons and neutrons differently.',
      'Isobars are atoms of different elements (different proton numbers) that share the same mass number — for example calcium-40, potassium-40, and argon-40. The total number of nucleons matches, but because the proton counts differ, they are genuinely different elements.'
    ),
    hero: img(
      'A balance scale holding three clearly different element-atoms that rest perfectly level, all weighing the same',
      'Ultra-wide cinematic banner (16:5 ratio). A balanced scale at the centre with three visibly different glowing atoms — distinct in colour and structure — resting so the scale is perfectly level, showing equal weight. Conveys different elements with the same mass. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Calcium-40, potassium-40 and argon-40 shown with different proton counts but the same total mass number',
      'Educational diagram of isobars. Clean technical illustration on a dark background (#0a0a0a or near-black). Three nuclei side by side, each labelled with mass number 40 but different proton/neutron splits: Argon (18 protons, 22 neutrons), Potassium (19 protons, 21 neutrons), Calcium (20 protons, 20 neutrons). Label each element, its protons and the shared mass number 40. Dark background, orange accent labels and thin leader lines, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Atom P has 18 protons and 22 neutrons. Atom Q has 20 protons and 20 neutrons. What is the relationship between them?',
      [
        'They are isobars — the same mass number (40) but different elements (different protons)',
        'They are isotopes — the same element with different masses',
        'They are the same element, since both add up to 40',
        'They have nothing in common',
      ],
      0,
      'Both have mass number 40 but different proton counts, which makes them different elements with the same mass — isobars. "Isotopes" is the trap: isotopes are the *same* element (same protons) with *different* masses, the reverse of this case.',
      3),
    quiz: [
      q('Isobars are atoms of —',
        [
          'different elements that have the same mass number',
          'the same element that have different mass numbers',
          'the same element that have the same mass number',
          'different elements that have the same number of protons',
        ], 0,
        'Isobars share a mass number but belong to different elements. "Same element with different mass numbers" is the trap — that describes isotopes, not isobars.',
        1),
      q('Calcium-40 and argon-40 are isobars. What do they share, and how do they differ?',
        [
          'They share the same mass number (40) but have different numbers of protons',
          'They share the same number of protons but different mass numbers',
          'They are the same element with different numbers of neutrons',
          'They share the same number of electrons in every shell',
        ], 0,
        'Isobars match in mass number but differ in protons, so they are different elements. "Same protons, different mass" is the trap — that is the isotope pattern, not the isobar one.',
        2),
      q('How can you tell isotopes apart from isobars?',
        [
          'Isotopes are the same element (same protons, different mass); isobars are different elements (different protons, same mass)',
          'Isotopes are different elements; isobars are the same element',
          'Isotopes always weigh more than isobars',
          'There is no real difference between them',
        ], 0,
        'The key is what stays the same: isotopes keep the protons (same element), isobars keep the mass number (different elements). The reversed option swaps the two definitions, which is the most common mix-up.',
        3),
    ],
  },

  // ── p95 iupac-symbols ───────────────────────────────────────────────────────
  {
    slug: 'iupac-symbols',
    subtitle: 'Why gold is "Au" and sodium is "Na" — letters that aren\'t even in the names',
    hook: cur(
      'Look at the symbol for gold: Au. For sodium: Na. For iron: Fe. Not one of these letters even appears in the English name. Did scientists just invent them to confuse students? In fact there is a clever, centuries-old reason hidden inside these short codes — and a strict rule for how every symbol must be written. Where do they come from?',
      'Many of them come from the elements\' old Latin names.',
      'Symbols are a universal shorthand approved by IUPAC so scientists everywhere mean the same thing. Many come from Latin names — gold is Au (aurum), sodium Na (natrium), iron Fe (ferrum). The rule: the first letter is a capital and the second, if there is one, is small — Co for cobalt, never CO.'
    ),
    hero: img(
      'A glowing wall of chemical element symbols, with a few Latin-rooted ones like Au, Na and Fe shining brightest',
      'Ultra-wide cinematic banner (16:5 ratio). A grid-like wall of glowing chemical element symbols floating in the dark, with a few — Au, Na, Fe, K — highlighted and brighter than the rest. Conveys a universal code for the elements. Cool rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'A few elements whose symbols come from Latin names, shown beside those Latin names',
      'Educational diagram of Latin-derived element symbols. Clean technical illustration on a dark background (#0a0a0a or near-black). A neat list pairing each symbol with its Latin source: Na — Natrium (sodium), K — Kalium (potassium), Fe — Ferrum (iron), Au — Aurum (gold), Ag — Argentum (silver), Pb — Plumbum (lead). Dark background, orange accent labels, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Why must the symbol for cobalt be written "Co" and never "CO"?',
      [
        'The first letter is a capital and the second is small; "CO" (two capitals) would mean carbon joined with oxygen',
        'Cobalt is too rare to deserve a two-capital symbol',
        '"CO" is harder to read than "Co"',
        'Cobalt always travels with oxygen, so CO would be confusing',
      ],
      0,
      'Writing "CO" with two capitals reads as carbon (C) plus oxygen (O) — a completely different substance — so the second letter must be small. "Too rare" is irrelevant: the rule about capitals applies to every element, common or rare.',
      2),
    quiz: [
      q('The symbol for sodium is —',
        ['Na', 'So', 'S', 'Sd'], 0,
        'Sodium\'s symbol is Na, from its Latin name natrium. "So" is the trap — symbols are not simply the first two letters of the English name; many come from Latin.',
        1),
      q('The symbol for iron is "Fe", which shares no letters with the English word "iron". Why?',
        [
          'It comes from iron\'s Latin name, ferrum',
          'The letters were chosen completely at random',
          '"Fe" is simply quicker to write than "Ir"',
          'Iron atoms always join together in twos',
        ], 0,
        'Fe comes from the Latin ferrum, which is why it looks unrelated to "iron". "Chosen at random" is the trap — the symbols follow Latin names, not chance.',
        2),
      q('A student writes the symbol for magnesium as "MG". What is wrong, and why does it matter?',
        [
          'The second letter must be small (Mg); written as "MG" it reads as two separate elements, M and G',
          'Magnesium has no symbol at all and should be written in full',
          'The symbol should be three letters, not two',
          'Nothing is wrong — "MG" and "Mg" mean the same thing',
        ], 0,
        'Two capital letters read as two element symbols, so magnesium must be Mg, not MG. "Nothing is wrong" misses exactly why the capital/small rule exists — it keeps each element unambiguous.',
        3),
    ],
  },
], 8).catch((e) => { console.error(e); process.exit(1); });
