'use strict';
/**
 * Ch8 "Journey Inside the Atom" — AUGMENT batch 1: pages 84–89 (atomic-models arc).
 * Adds hook + hero (+ model diagram) + reasoning_prompt + 3-Q quiz to each existing
 * page, grounded in iesc108.pdf. Existing prose/callouts preserved. published stays false.
 *   node scripts/science-augment/build_ch8_b1.js [--dry]
 */
const { img, cur, reason, q, applyAug } = require('./_lib');
const DIAG = (alt, prompt) => img(alt, prompt, '4:3');

applyAug([
  // ── p84 what-is-an-atom ─────────────────────────────────────────────────────
  {
    slug: 'what-is-an-atom',
    subtitle: 'The smallest piece of an element — so tiny that a million of them stack up to the thickness of one page',
    hook: cur(
      'Take this page between your fingers — it feels thin, but solid. Now here is something hard to believe: if you could stack atoms one on top of another, it would take about a *million* of them just to match the thickness of this single page. Your hand, this book, the air you breathe — all of it is built from these unimaginably tiny pieces. So what exactly is an atom, and how can we be sure something we can never see is even there?',
      'An atom is far too small to see, even with an ordinary microscope.',
      'An atom is the smallest particle of an element. They are so small that about a million would stack up to the thickness of one page — yet everything around you is built from them. This chapter is the journey inside the atom.'
    ),
    hero: img(
      'Everyday objects — a house, a brick, a human body — zooming down step by step to the tiny atoms they are made of',
      'Ultra-wide cinematic banner (16:5 ratio). A sweeping left-to-right zoom: on the left, familiar large objects — a house, a brick, a child — and as the eye moves right they dissolve into ever-smaller pieces, ending on the far right in a cluster of glowing spherical atoms. Conveys that everything is built from unimaginably tiny atoms. Warm rim light against a deep dark background, painterly cinematic Indian-illustration style. No text overlay.'
    ),
    reason: reason('logical',
      'You cannot see a single atom even under a good school microscope. What is the soundest reason?',
      [
        'Atoms are millions of times smaller than the tiniest thing such a microscope can show',
        'Atoms are colourless, and colourless things can never be seen',
        'Atoms move far too fast for any lens to catch them',
        'Atoms always hide deep inside larger molecules',
      ],
      0,
      'An atom is about a ten-billionth of a metre across — far below what an ordinary microscope can resolve, so size is the real reason. "Colourless, so invisible" is the trap: glass and air are colourless yet we see their effects; the issue is that atoms are simply too small.',
      2),
    quiz: [
      q('An atom is best described as —',
        [
          'the smallest particle of an element',
          'the smallest particle of a mixture',
          'a particle just large enough to see with a hand lens',
          'the heaviest particle found in matter',
        ], 0,
        'An atom is the smallest particle of an element. "Smallest particle of a mixture" is the trap — a mixture is made of different substances, not a single element, and can always be separated into smaller parts.',
        1),
      q('About how many atoms stacked on top of one another would equal the thickness of a sheet of paper (about 0.1 mm)?',
        [
          'About a million',
          'About ten',
          'About a thousand',
          'About a hundred',
        ], 0,
        'A sheet of paper is roughly 0.1 mm thick and an atom about a ten-billionth of a metre, so about a million atoms stack up across it. "About a thousand" badly underestimates just how tiny an atom is.',
        2),
      q('Two students argue. One says, "Atoms must be coloured, because coloured objects are made of atoms." Why is this wrong?',
        [
          'Atoms themselves have no colour; an object\'s colour comes from how it interacts with light',
          'Atoms are actually all grey, so objects should all look grey',
          'Only the atoms on the surface of an object carry its colour',
          'Atoms change colour depending on how warm the object is',
        ], 0,
        'Atoms do not have a colour of their own — what we call an object\'s colour comes from the way it reflects and absorbs light, not from coloured atoms. "Atoms are all grey" is just another version of the same mistake: giving atoms a colour they do not have.',
        3),
    ],
  },

  // ── p85 acharya-kanads-parmanu ──────────────────────────────────────────────
  {
    slug: 'acharya-kanads-parmanu',
    subtitle: 'How an Indian sage reasoned his way to the idea of the atom — 2,000 years before any experiment',
    hook: cur(
      'More than 2,000 years ago — long before microscopes, test tubes, or any experiment existed — an Indian sage named Kanad sat and reasoned his way to an astonishing idea. He thought: if you keep cutting a piece of matter into smaller and smaller bits, you must finally reach a piece so small it cannot be cut any further. He called it the *parmanu*. He had no equipment at all — only careful thought. How could someone arrive at the idea of the atom with nothing but reasoning?',
      'He imagined dividing matter again and again until dividing was no longer possible.',
      'Kanad reasoned that endless cutting must end at an uncuttable particle — the *parmanu* — recorded in the Sanskrit text *Vaisesika Sutras*. The Greek thinkers Leucippus and Democritus reached a similar idea and called it *atomos* ("indivisible"). But these were imagined ideas, not experiments — the first scientific atomic theory came from John Dalton in 1808.'
    ),
    hero: img(
      'An ancient Indian sage deep in thought, with faint glowing particles of matter dividing into ever-smaller points around him',
      'Ultra-wide cinematic banner (16:5 ratio). An ancient Indian sage seated in contemplation on the left, and flowing to the right a stream of matter breaking into smaller and smaller glowing particles until a single tiny point remains. Conveys arriving at the idea of the smallest indivisible particle through pure reasoning. Warm amber rim light against a deep dark background, painterly cinematic Indian-illustration style. No text overlay.'
    ),
    reason: reason('analogical',
      'Kanad in India and the Greek thinkers reached the same "uncuttable particle" idea on their own, with no experiments at all. What does this best show?',
      [
        'Careful reasoning can lead to powerful ideas, but those ideas still need experiments to be confirmed',
        'Ideas reached by reasoning are always correct and need no testing',
        'The two civilisations must have copied the idea from each other',
        'An idea is only worth anything once a machine has been built for it',
      ],
      0,
      'Two cultures reasoning to the same idea shows how powerful careful thinking is — but neither could prove it, which is why Dalton\'s later experiments mattered. "Reasoning is always correct" is the trap: many reasoned ideas turn out wrong, so testing is exactly what science adds.',
      3),
    quiz: [
      q('The ancient Indian sage who proposed the "parmanu", an uncuttable particle of matter, was —',
        [
          'Acharya Kanad',
          'John Dalton',
          'Democritus',
          'J. J. Thomson',
        ], 0,
        'Acharya Kanad proposed the parmanu, recorded in the Vaisesika Sutras. "Democritus" is the trap — he proposed a very similar idea (atomos), but in ancient Greece, not India.',
        1),
      q('What is the main difference between Kanad\'s parmanu idea and John Dalton\'s atomic theory?',
        [
          'Dalton\'s theory was based on scientific experiments, while Kanad\'s idea came from reasoning alone',
          'Kanad used experiments, while Dalton only guessed',
          'Both were based on identical experiments done centuries apart',
          'Dalton\'s theory was about mixtures, not atoms',
        ], 0,
        'Kanad reached his idea by pure reasoning; Dalton, in 1808, built his theory on scientific experiments — that is the key difference. The reversed option is the trap: it was Dalton, not Kanad, who had experimental evidence.',
        2),
      q('The Greek thinkers chose the word "atomos" for the smallest particle. Why was it a fitting name for what they imagined?',
        [
          'It means "indivisible", matching their idea of a particle that cannot be cut any further',
          'It means "tiny", which is all they wished to say about it',
          'It means "invisible", since the particle could not be seen',
          'It means "building block", describing how matter is assembled',
        ], 0,
        'They pictured a particle that could not be divided, and "atomos" means exactly that — indivisible. "Tiny" is the tempting near-miss: the particle is tiny, but the name they chose points to its uncuttable nature, not just its size.',
        3),
    ],
  },

  // ── p86 thomsons-model ──────────────────────────────────────────────────────
  {
    slug: 'thomsons-model',
    subtitle: 'The first real picture of the atom\'s insides — and why it looked like a watermelon',
    hook: cur(
      'When J. J. Thomson discovered that atoms contain tiny *negative* particles, he ran straight into a puzzle. An atom as a whole carries no charge — so if there are negative bits inside, where is the positive charge hiding to balance them? His answer was a picture you could almost eat: an atom is like a watermelon — positive "pulp" filling the whole sphere, with negative "seeds" dotted all the way through. Why did a perfectly neutral atom force scientists to imagine it this way?',
      'For the whole atom to have no charge, the positive and negative must exactly balance.',
      'Thomson pictured the atom as a sphere of positive charge (the pulp) with electrons (the seeds) spread through it, so the charges balance and the atom stays neutral. It was the first genuine attempt to describe the atom\'s structure — later replaced, but an important first step.'
    ),
    hero: img(
      'A glowing watermelon split open, its red pulp and dark seeds standing in for an atom\'s positive charge and electrons',
      'Ultra-wide cinematic banner (16:5 ratio). A halved watermelon floating against darkness, its red pulp glowing like a sphere of charge and its dark seeds dotted evenly through it, subtly suggesting an atom. Conveys the "plum-pudding / watermelon" picture of the early atom. Warm rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Thomson\'s model: a positive sphere with negatively charged electrons embedded throughout it',
      'Thomson\'s atomic model diagram. Clean technical illustration on a dark background (#0a0a0a or near-black). A single large sphere shaded to suggest uniform positive charge, with several small electrons embedded and spread evenly throughout it. Label: Positive sphere, Electron. Dark background, orange accent labels and thin leader lines, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'Thomson found that electrons are negatively charged, yet a whole atom carries no charge at all. What did this force him to conclude?',
      [
        'The atom must also contain positive charge that exactly balances the electrons',
        'The electrons inside an atom must really be positive after all',
        'Atoms must usually carry a small negative charge overall',
        'Electrons must sit only on the outside surface of the atom',
      ],
      0,
      'If the negative electrons are inside but the atom is neutral, there must be matching positive charge to cancel them — which is exactly what Thomson proposed. "Atoms carry a small negative charge" contradicts the starting fact that the atom is neutral.',
      2),
    quiz: [
      q('In Thomson\'s model, an atom is —',
        [
          'a sphere of positive charge with electrons embedded throughout it',
          'a tiny dense nucleus with electrons orbiting far around it',
          'mostly empty space with all mass at the centre',
          'electrons moving only in fixed energy shells',
        ], 0,
        'Thomson pictured positive charge spread through a sphere with electrons dotted inside. The "tiny dense nucleus with orbiting electrons" is the trap — that is Rutherford\'s later model, which replaced Thomson\'s.',
        1),
      q('Why is Thomson\'s atom often compared to a watermelon?',
        [
          'The positive charge is spread out like the red pulp, with electrons dotted through it like seeds',
          'It is round and green on the outside like a watermelon\'s skin',
          'Its electrons are sweet and its nucleus is sour',
          'It can be split cleanly into two equal halves',
        ], 0,
        'The comparison works because the positive charge fills the sphere like pulp while electrons sit inside it like seeds. "Round and green outside" misses the point — the comparison is about how charge is arranged inside, not the fruit\'s skin.',
        2),
      q('Thomson showed the electron is negative and far lighter than the whole atom. Which important conclusion follows?',
        [
          'Atoms are not indivisible after all — they contain even smaller particles',
          'The electron is the heaviest part of the atom',
          'Atoms must carry an overall positive charge',
          'Atoms truly cannot be divided into anything smaller',
        ], 0,
        'Finding a particle smaller than the atom proved the atom is not the indivisible ball Dalton imagined. "Atoms cannot be divided" is the very idea this discovery overturned.',
        3),
    ],
  },

  // ── p87 rutherfords-model ───────────────────────────────────────────────────
  {
    slug: 'rutherfords-model',
    subtitle: 'How a particle bouncing off "see-through" gold foil revealed the atom\'s tiny, dense core',
    hook: cur(
      'Rutherford\'s team fired a stream of tiny particles at a sheet of gold foil so thin it was almost see-through. They expected every particle to sail straight through, like a bullet through tissue paper. Most did — but every so often, one came bouncing *straight back*. Rutherford said it was as astonishing as firing a shell at tissue paper and having it bounce back and hit you. What could possibly be hiding inside a "see-through" sheet of gold to throw a particle backwards?',
      'Something extremely small, very dense, and positively charged must sit inside the atom.',
      'A few particles bounced back because they struck a tiny, dense, positively charged core — the nucleus. Most of the atom is empty space, so most particles pass straight through. This gave Rutherford\'s nuclear model: a tiny nucleus at the centre with electrons orbiting around it, like planets around the Sun.'
    ),
    hero: img(
      'A beam of glowing particles striking a thin sheet of gold foil — most passing through, a single one rebounding sharply backward',
      'Ultra-wide cinematic banner (16:5 ratio). A narrow beam of glowing particles streaming from the left into a thin shimmering sheet of gold foil; most streak straight through to the right, while one dramatic particle ricochets sharply backward. Conveys the shock of the gold-foil experiment. Cool rim light with warm gold accents against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'The gold-foil experiment: alpha particles hitting gold foil, most passing through, some deflected, a few bouncing back off the tiny nucleus',
      'Gold-foil (alpha-scattering) experiment diagram. Clean technical illustration on a dark background (#0a0a0a or near-black). A beam of alpha particles travels from the left toward a column of gold atoms (each shown with a tiny dense central nucleus); most arrows pass straight through, a few bend at angles, and one rebounds backward after striking a nucleus. Show arrows for the particle paths. Label: Alpha particles, Gold foil, Nucleus, Deflected particle. Dark background, orange accent labels and arrows, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'In the gold-foil experiment, most particles passed straight through but a few bounced sharply back. What TWO things does this reveal about the atom?',
      [
        'Most of the atom is empty space, and it has a tiny, dense, positively charged core',
        'The atom is a solid ball throughout, with charge spread evenly inside',
        'The atom is entirely empty, with no solid part anywhere',
        'The atom\'s mass is spread thinly and evenly across its whole volume',
      ],
      0,
      'Particles passing straight through show mostly empty space; the rare hard bounce shows a small, dense, positive centre — both at once. "A solid ball throughout" is the trap: that was Thomson\'s picture, and it could not explain the bounce-backs.',
      3),
    quiz: [
      q('Rutherford\'s gold-foil experiment led to the discovery of the —',
        [
          'nucleus',
          'electron',
          'neutron',
          'energy shells',
        ], 0,
        'The bounced-back particles revealed a tiny dense core — the nucleus. "Electron" is the trap: that was Thomson\'s earlier discovery, not the result of the gold-foil experiment.',
        1),
      q('In Rutherford\'s experiment, why did most of the particles pass straight through the gold foil?',
        [
          'Because most of the atom is empty space',
          'Because the particles were negatively charged',
          'Because the gold nucleus pulled them gently through',
          'Because the foil was made of a single layer of atoms',
        ], 0,
        'Most of the atom is empty, so most particles meet nothing and pass straight on. "The particles were negative" is wrong and irrelevant — alpha particles are positive, and that is what makes the few that hit the nucleus bounce back.',
        2),
      q('Rutherford\'s model said electrons orbit the nucleus — but a circling electron should keep losing energy and spiral inward, so atoms would collapse. Since atoms do NOT collapse, what does this mean?',
        [
          'Rutherford\'s model was incomplete, and a better explanation of how electrons stay stable was needed',
          'Electrons must actually sit completely still inside the atom',
          'Atoms really do collapse, just far too slowly to notice',
          'The nucleus must be negative to stop the electrons falling in',
        ], 0,
        'Stable atoms contradict a model that predicts collapse, so the model needed fixing — which Bohr later did. "Electrons sit still" cannot be right either, because a still electron would simply be pulled straight into the positive nucleus.',
        3),
    ],
  },

  // ── p88 bohrs-model ─────────────────────────────────────────────────────────
  {
    slug: 'bohrs-model',
    subtitle: 'One bold rule that stopped electrons crashing into the nucleus — and let atoms last forever',
    hook: cur(
      'Rutherford\'s atom had a fatal flaw. An electron circling the nucleus should steadily lose energy and spiral inward, making every atom collapse in a flash. Yet atoms — and you — have lasted billions of years. Niels Bohr fixed this with one bold rule that sounds almost like magic: electrons are allowed to travel only on certain fixed "lanes", and while they stay on those lanes they never lose any energy. What are these special lanes, and why would an electron stick to them?',
      'Electrons are allowed only in fixed shells (energy levels), never in between.',
      'Bohr said electrons move only in fixed shells, or energy levels, named K, L, M, N… While an electron stays in its shell it does not lose energy, so the atom stays stable. An electron moves between shells only by gaining or losing a fixed amount of energy.'
    ),
    hero: img(
      'An atom with electrons travelling on glowing concentric rings around a bright central nucleus',
      'Ultra-wide cinematic banner (16:5 ratio). A central glowing nucleus with several luminous concentric circular orbits around it, electrons riding steadily along the rings, set against deep space. Conveys electrons confined to fixed, stable energy shells. Cool blue rim light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'Bohr model showing the nucleus and the K, L, M, N energy shells at increasing distances',
      'Bohr atomic model diagram. Clean technical illustration on a dark background (#0a0a0a or near-black). A central nucleus with four concentric circular shells around it at increasing radius, each labelled K-shell (n=1), L-shell (n=2), M-shell (n=3), N-shell (n=4), with a small electron shown on a shell. Label the nucleus and each shell. Dark background, orange accent labels and thin leader lines, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'In Bohr\'s model, why does an electron NOT lose energy and fall into the nucleus while it travels in its shell?',
      [
        'Each shell is a fixed energy level, so an electron keeps a constant energy while it stays in its shell',
        'The electron is too heavy to be pulled toward the nucleus',
        'The nucleus pushes the electron away with a negative charge',
        'The electron stops moving completely once it reaches a shell',
      ],
      0,
      'Bohr\'s key rule is that a shell is a fixed energy level — an electron in it neither gains nor loses energy, so it cannot spiral in. "The nucleus pushes it away" is wrong: the nucleus is positive and actually attracts the electron; the fixed-energy rule is what keeps it stable.',
      2),
    quiz: [
      q('In Bohr\'s model, the fixed paths along which electrons move around the nucleus are called —',
        [
          'shells (energy levels)',
          'nuclei',
          'protons',
          'electron clouds',
        ], 0,
        'Bohr\'s fixed paths are the shells, or energy levels. "Electron clouds" is the trap — that is the later, modern picture of the atom, not Bohr\'s fixed orbits.',
        1),
      q('Starting from the one nearest the nucleus, the shells of an atom are named —',
        [
          'K, L, M, N',
          'A, B, C, D',
          'N, M, L, K',
          'first, second, red, blue',
        ], 0,
        'The shells are named K, L, M, N going outward from the nucleus. "N, M, L, K" is the reversed-order trap — it lists them from the outside in, not from the nucleus out.',
        2),
      q('An electron in the L-shell (n = 2) has more energy than one in the K-shell (n = 1). What does this tell you about shells that lie farther from the nucleus?',
        [
          'The farther a shell is from the nucleus, the higher its energy',
          'The farther a shell is from the nucleus, the lower its energy',
          'All shells have exactly the same energy',
          'Only the K-shell has any energy at all',
        ], 0,
        'Since L (farther out) has more energy than K (closest), energy rises as shells get farther from the nucleus. The "lower energy farther out" option is the exact reverse of what the example shows.',
        3),
    ],
  },

  // ── p89 subatomic-particles ─────────────────────────────────────────────────
  {
    slug: 'subatomic-particles',
    subtitle: 'The three particles inside every atom — and the "missing mass" mystery that revealed the neutron',
    hook: cur(
      'Here was a riddle that puzzled scientists for years. A helium atom has just two protons — twice the protons of hydrogen — so surely it should weigh twice as much. But weigh it, and helium turns out to be about *four* times heavier than hydrogen. Two protons cannot explain four times the mass. Something heavy was hiding in the nucleus — something that carried weight but no electric charge. What was it?',
      'It is a particle with about the same mass as a proton, but with no charge at all.',
      'The missing mass came from the neutron — a particle with almost the same mass as a proton but no charge — discovered by James Chadwick in 1932. So the nucleus holds protons and neutrons (together called nucleons), while electrons move around outside it.'
    ),
    hero: img(
      'A glowing atomic nucleus packed with protons and neutrons, with a faint electron circling far outside',
      'Ultra-wide cinematic banner (16:5 ratio). A bright, dense central nucleus made of tightly packed spheres (protons and neutrons) glowing at the centre of the frame, with one faint electron tracing a wide orbit far around it. Conveys mass concentrated in the nucleus. Warm core glow with cool outer light against a deep dark background, painterly cinematic style. No text overlay.'
    ),
    diagram: DIAG(
      'A simple atom showing protons and neutrons in the nucleus and electrons in shells around it',
      'Labelled atom diagram. Clean technical illustration on a dark background (#0a0a0a or near-black). A central nucleus drawn as a cluster of protons (marked +) and neutrons (marked 0), with two concentric shells around it carrying electrons (marked −). Label: Proton, Neutron, Electron, Nucleus, Shell. Dark background, orange accent labels and thin leader lines, clean technical illustration style. No photorealism.'
    ),
    reason: reason('logical',
      'A helium atom has 2 protons but weighs about 4 times as much as a hydrogen atom (1 proton). What is the best explanation?',
      [
        'The helium nucleus also contains neutrons, which add mass but no charge',
        'Helium\'s electrons are extremely heavy and add the extra mass',
        'A helium atom actually has 4 protons, not 2',
        'Each proton in helium is heavier than a proton in hydrogen',
      ],
      0,
      'Helium has 2 protons plus 2 neutrons; the neutrons add mass (≈ 4 in total) without changing the charge. "Electrons are heavy" is the trap — electrons are so light their mass is ignored, so they cannot account for the extra weight.',
      3),
    quiz: [
      q('The neutron was discovered by —',
        [
          'James Chadwick',
          'Ernest Rutherford',
          'J. J. Thomson',
          'Niels Bohr',
        ], 0,
        'James Chadwick discovered the neutron in 1932. "Rutherford" is the trap — he discovered (and named) the proton and the nucleus, but not the neutron.',
        1),
      q('Which statement about the neutron is correct?',
        [
          'It has almost the same mass as a proton but carries no charge',
          'It is negatively charged, like an electron',
          'It is much lighter than an electron',
          'It carries the whole of the atom\'s positive charge',
        ], 0,
        'A neutron is roughly as heavy as a proton and is electrically neutral. "Negatively charged like an electron" is the trap — the neutron has no charge at all, which is exactly why the missing mass had no effect on charge.',
        2),
      q('Protons in a nucleus all carry positive charge and should push one another apart. Why does the nucleus not simply fly apart?',
        [
          'Neutrons sit among the protons and help bind everything with a strong nuclear force, easing the repulsion',
          'The protons are actually neutral once inside the nucleus',
          'The electrons outside pull the protons together',
          'There is only ever one proton in any nucleus, so nothing repels',
        ], 0,
        'Neutrons spacing out the protons, together with the strong nuclear force, hold the nucleus together against the repulsion. "Electrons pull the protons together" is the trap — electrons are far outside the nucleus and far too light to hold it.',
        3),
    ],
  },
], 8).catch((e) => { console.error(e); process.exit(1); });
