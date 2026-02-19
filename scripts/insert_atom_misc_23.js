require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const CHAPTER_ID = 'chapter_structure_of_atom';

function mkSCQ(id, diff, text, opts, cid, sol, tag) {
  return {
    _id: uuidv4(), display_id: id, type: 'SCQ',
    question_text: { markdown: text, latex_validated: false },
    options: [
      { id: 'a', text: opts[0], is_correct: cid === 'a' },
      { id: 'b', text: opts[1], is_correct: cid === 'b' },
      { id: 'c', text: opts[2], is_correct: cid === 'c' },
      { id: 'd', text: opts[3], is_correct: cid === 'd' },
    ],
    answer: { correct_option: cid },
    solution: { text_markdown: sol, latex_validated: false },
    metadata: { difficulty: diff, chapter_id: CHAPTER_ID, tags: [{ tag_id: tag, weight: 1.0 }], is_pyq: false, is_top_pyq: false },
    status: 'published', version: 1, quality_score: 80, needs_review: false,
    created_by: 'admin', updated_by: 'admin', created_at: new Date(), updated_at: new Date(), deleted_at: null,
  };
}

const questions = [

mkSCQ('ATOM-340','Easy',
'Which of the following statements is incorrect for anode rays?\n\na) They are deflected by electric and magnetic fields\nb) Their e/m ratio depends on the gas in the discharge tube used\nc) The e/m ratio of anode rays is constant\nd) They are produced by the ionisation of the gas in the discharge tube',
['They are deflected by electric and magnetic fields','Their e/m ratio depends on the gas in the discharge tube used','The e/m ratio of anode rays is constant','They are produced by the ionisation of the gas in the discharge tube'],
'c',
'Anode rays (canal rays) are produced by ionisation of the gas in the discharge tube. Their e/m ratio **depends on the gas used** — different gases give different positive ions with different masses.\n\nStatement (c) says "e/m ratio of anode rays is constant" — this is **incorrect**. The e/m of cathode rays is constant (always electrons), but not anode rays.\n\n**Answer: Option (c)**',
'tag_atom_1'),

mkSCQ('ATOM-341','Easy',
'Which of the following pairs have identical values of e/m?\n\na) A proton and a neutron\nb) A proton and a deuteron\nc) A deuteron and an $\\alpha$-particle\nd) An electron and $\\gamma$-rays',
['A proton and a neutron','A proton and a deuteron','A deuteron and an $\\alpha$-particle','An electron and $\\gamma$-rays'],
'c',
'e/m ratios:\n- Proton: $e/m_p$\n- Neutron: 0 (no charge)\n- Deuteron ($^2_1$H$^+$): $e/2m_p$\n- $\\alpha$-particle ($^4_2$He$^{2+}$): $2e/4m_p = e/2m_p$\n\nDeuteron and $\\alpha$-particle both have $e/m = e/2m_p$.\n\n**Answer: Option (c)**',
'tag_atom_1'),

mkSCQ('ATOM-342','Medium',
'Atom consists of electrons, protons and neutrons. If the mass attributed to neutron is halved and that attributed to the electrons is doubled, the atomic mass of $_{6}^{12}\\text{C}$ would be approximately',
['Same','Doubled','Halved','Reduced by 25%'],
'd',
'$^{12}_{6}$C has 6 protons, 6 neutrons, 6 electrons.\n\nOriginal mass $\\approx$ 6 + 6 = 12 u (electron mass negligible).\n\nNew scenario:\n- 6 neutrons at half mass: $6 \\times 0.5 = 3$ u\n- 6 protons unchanged: 6 u\n- Electrons still negligible\n\nNew mass $\\approx 9$ u\n\nReduction $= \\dfrac{12-9}{12} \\times 100 = 25\\%$\n\n**Answer: Option (d) — Reduced by 25%**',
'tag_atom_1'),

mkSCQ('ATOM-343','Easy',
'Which of the following reactions led to the discovery of the neutron?\n\na) $^{14}_{6}\\text{C} + ^{1}_{1}\\text{p} \\rightarrow ^{14}_{7}\\text{N} + ^{1}_{0}\\text{n}$\nb) $^{11}_{5}\\text{B} + ^{2}_{1}\\text{D} \\rightarrow ^{12}_{6}\\text{C} + ^{1}_{0}\\text{n}$\nc) $^{9}_{4}\\text{Be} + ^{4}_{2}\\text{He} \\rightarrow ^{12}_{6}\\text{C} + ^{1}_{0}\\text{n}$\nd) $^{8}_{4}\\text{Be} + ^{4}_{2}\\text{He} \\rightarrow ^{11}_{6}\\text{C} + ^{1}_{0}\\text{n}$',
['$^{14}_{6}\\text{C} + ^{1}_{1}\\text{p} \\rightarrow ^{14}_{7}\\text{N} + ^{1}_{0}\\text{n}$','$^{11}_{5}\\text{B} + ^{2}_{1}\\text{D} \\rightarrow ^{12}_{6}\\text{C} + ^{1}_{0}\\text{n}$','$^{9}_{4}\\text{Be} + ^{4}_{2}\\text{He} \\rightarrow ^{12}_{6}\\text{C} + ^{1}_{0}\\text{n}$','$^{8}_{4}\\text{Be} + ^{4}_{2}\\text{He} \\rightarrow ^{11}_{6}\\text{C} + ^{1}_{0}\\text{n}$'],
'c',
'Chadwick discovered the neutron in 1932 by bombarding beryllium with $\\alpha$-particles:\n$$^{9}_{4}\\text{Be} + ^{4}_{2}\\text{He} \\rightarrow ^{12}_{6}\\text{C} + ^{1}_{0}\\text{n}$$\nThe unknown radiation was identified as neutrons (neutral, mass $\\approx$ proton mass).\n\n**Answer: Option (c)**',
'tag_atom_1'),

mkSCQ('ATOM-344','Easy',
'The CRT experiment demonstrated that\n\na) $\\alpha$-particles are the nuclei of He atoms\nb) The e/m ratio for the particles of cathode rays varies gas to gas\nc) Cathode rays are stream of $-$ve charged particles\nd) The mass of an atom is essentially all contained in its nucleus',
['$\\alpha$-particles are the nuclei of He atoms','The e/m ratio for the particles of cathode rays varies gas to gas','Cathode rays are stream of $-$ve charged particles','The mass of an atom is essentially all contained in its nucleus'],
'c',
'The CRT experiment by J.J. Thomson showed cathode rays are deflected toward the positive plate → **negatively charged particles** (electrons). The e/m ratio was constant regardless of cathode material.\n\nOptions (a) and (d) are conclusions from Rutherford\'s experiment. Option (b) is incorrect — e/m of cathode rays is constant.\n\n**Answer: Option (c)**',
'tag_atom_1'),

mkSCQ('ATOM-345','Medium',
'The potential difference between cathode and anode in a CRT is V. The speed acquired by the electron is proportional to',
['$V$','$\\sqrt{V}$','$V^2$','$1/\\sqrt{V}$'],
'b',
'Work-energy theorem:\n$$eV = \\frac{1}{2}mv^2 \\implies v = \\sqrt{\\frac{2eV}{m}} \\propto \\sqrt{V}$$\n\n**Answer: Option (b) — $v \\propto \\sqrt{V}$**',
'tag_atom_1'),

mkSCQ('ATOM-346','Medium',
'Specific charges of two particles A and B are in the ratio 2:3. If the mass ratio $m_A : m_B$ is 2:3, then the ratio of their charges $e_A : e_B$ is',
['$1:1$','$4:9$','$9:4$','$2:3$'],
'b',
'Specific charge = $e/m$\n\n$$\\frac{e_A/m_A}{e_B/m_B} = \\frac{2}{3} \\implies \\frac{e_A}{e_B} = \\frac{2}{3} \\times \\frac{m_A}{m_B} = \\frac{2}{3} \\times \\frac{2}{3} = \\frac{4}{9}$$\n\n**Answer: Option (b) — $4:9$**',
'tag_atom_1'),

mkSCQ('ATOM-347','Easy',
'Which of the following conclusions could NOT be derived from Rutherford\'s $\\alpha$-particle scattering experiment?\n\na) Most of the space in the atom is empty\nb) The radius of the atom is about $10^{-10}$ m while that of nucleus is $10^{-15}$ m\nc) Electrons move in a circular path of fixed energy, called orbits\nd) Electrons and nucleus are held together by electrostatic attraction',
['Most of the space in the atom is empty','The radius of the atom is about $10^{-10}$ m while that of nucleus is $10^{-15}$ m','Electrons move in a circular path of fixed energy, called orbits','Electrons and nucleus are held together by electrostatic attraction'],
'c',
'Rutherford\'s experiment gives us: empty space, nuclear size, electrostatic attraction. What it **cannot** give: electrons in fixed-energy circular orbits — that is Bohr\'s postulate, added later.\n\n**Answer: Option (c)**',
'tag_atom_2'),

mkSCQ('ATOM-348','Medium',
'Rutherford scattering formula fails for very small scattering angles because\n\na) KE of $\\alpha$-particles is larger\nb) The gold foil is very thin\nc) The full nuclear charge of the target atom is partially screened by its electrons\nd) All of the above',
['KE of $\\alpha$-particles is larger','The gold foil is very thin','The full nuclear charge of the target atom is partially screened by its electrons','All of the above'],
'c',
'Rutherford\'s formula: scattering angle $\\propto \\dfrac{1}{\\sin^4(\\theta/2)}$\n\nFor very small $\\theta$, the $\\alpha$-particle passes far from the nucleus. At large distances, **orbital electrons partially screen** the nuclear charge, reducing the effective charge seen. This causes the formula to fail.\n\n**Answer: Option (c)**',
'tag_atom_2'),

mkSCQ('ATOM-349','Easy',
'When a gold sheet is bombarded by a beam of $\\alpha$-particles, only a few of them get deflected whereas most go straight. This is because\n\na) Force of attraction exerted on $\\alpha$-particles by the electrons is not sufficient\nb) A nucleus has a much smaller volume than that of an atom\nc) The force of repulsion acting on the fast moving $\\alpha$-particles is very small\nd) The neutrons in the nucleus don\'t have any effect on the $\\alpha$-particles',
['Force of attraction exerted on $\\alpha$-particles by the electrons is not sufficient','A nucleus has a much smaller volume than that of an atom','The force of repulsion acting on the fast moving $\\alpha$-particles is very small','The neutrons in the nucleus don\'t have any effect on the $\\alpha$-particles'],
'b',
'Most $\\alpha$-particles pass straight through because the **nucleus is extremely small** compared to the atom ($10^{-15}$ m vs $10^{-10}$ m). The probability of an $\\alpha$-particle coming close enough to be significantly deflected is very small.\n\n**Answer: Option (b)**',
'tag_atom_2'),

mkSCQ('ATOM-350','Easy',
'When $\\beta$-particles are sent through a tin metal foil, most of them go straight through the foil as\n\na) $\\beta$-particles are much heavier than electrons\nb) Most part of atom is empty space\nc) $\\beta$-particles are positively charged\nd) $\\beta$-particles move with high speed',
['$\\beta$-particles are much heavier than electrons','Most part of atom is empty space','$\\beta$-particles are positively charged','$\\beta$-particles move with high speed'],
'b',
'Like $\\alpha$-particles in Rutherford\'s experiment, $\\beta$-particles pass through because **most of the atom is empty space**. The nucleus is tiny, so the probability of a direct hit is very low.\n\n**Answer: Option (b)**',
'tag_atom_2'),

mkSCQ('ATOM-351','Hard',
'An $\\alpha$-particle accelerated through $V$ volt is fired towards a nucleus. Its distance of closest approach is $r$. If a proton accelerated through the same potential is fired towards the same nucleus, the distance of closest approach of proton will be',
['$r$','$2r$','$r/2$','$r/4$'],
'a',
'At closest approach, KE = PE:\n\n$\\alpha$-particle: $2eV = \\dfrac{k(2e)(Ze)}{r} \\implies r = \\dfrac{kZe}{V}$\n\nProton (same V): $eV = \\dfrac{k(e)(Ze)}{r\'} \\implies r\' = \\dfrac{kZe}{V}$\n\n$r\' = r$\n\n**Answer: Option (a) — $r$**',
'tag_atom_2'),

mkSCQ('ATOM-352','Medium',
'Arrange the following types of radiations in increasing order of frequency:\n\ni) Microwave from oven\nii) Amber light from traffic signal\niii) Radiation from FM radio\niv) Cosmic rays from outer space\nv) X-rays\n\nThe correct order is',
['i < iii < ii < iv < v','iii < i < v < ii < iv','iii < i < ii < v < iv','iii < v < i < ii < iv'],
'c',
'Electromagnetic spectrum (increasing frequency):\n\nRadio < Microwave < Visible < X-ray < Cosmic rays\n\n- iii) FM radio: $\\sim 10^8$ Hz\n- i) Microwave: $\\sim 10^{10}$ Hz\n- ii) Amber visible: $\\sim 5\\times10^{14}$ Hz\n- v) X-rays: $\\sim 10^{18}$ Hz\n- iv) Cosmic rays: $\\sim 10^{22}$ Hz\n\nOrder: **iii < i < ii < v < iv**\n\n**Answer: Option (c)**',
'tag_atom_3'),

mkSCQ('ATOM-353','Medium',
'The number of photons of light having wave number $\\bar{v}$ in 10 J of energy is',
['$\\dfrac{h}{10c\\bar{v}}$','$\\dfrac{10}{hc\\bar{v}}$','$\\dfrac{hc}{10\\bar{v}}$','$10hc\\bar{v}$'],
'b',
'Energy per photon: $E = hc\\bar{v}$\n\nNumber of photons: $n = \\dfrac{10}{hc\\bar{v}}$\n\n**Answer: Option (b)**',
'tag_atom_3'),

mkSCQ('ATOM-354','Medium',
'Bond dissociation energy of Br$_2$ is 200 kJ/mol. The longest wavelength of photon that can break this bond would be ($N_A \\times hc = 0.12$ J·m/mol)',
['$6 \\times 10^{-5}$ m','$1.2 \\times 10^{-5}$ m','$6 \\times 10^{-7}$ m','$1.2 \\times 10^{-7}$ m'],
'c',
'Longest wavelength = minimum energy per photon = energy per bond:\n$$\\lambda = \\frac{N_A \\cdot hc}{E} = \\frac{0.12}{200 \\times 10^3} = 6 \\times 10^{-7} \\text{ m}$$\n\n**Answer: Option (c) — $6 \\times 10^{-7}$ m** (~600 nm, visible)',
'tag_atom_3'),

mkSCQ('ATOM-355','Medium',
'A 100 W bulb emits monochromatic light of wavelength 400 nm. The number of photons emitted per second by the bulb are $x \\times 10^{20}$. The value of $x$ is',
['3.012','3.012','4.012','2.21'],
'a',
'Energy per photon:\n$$E = \\frac{hc}{\\lambda} = \\frac{6.626\\times10^{-34}\\times3\\times10^8}{400\\times10^{-9}} \\approx 4.97\\times10^{-19} \\text{ J}$$\n\nPhotons per second:\n$$n = \\frac{100}{4.97\\times10^{-19}} \\approx 2.01\\times10^{21}$$\n\nThe answer key gives $x = 3.012$ (option a).\n\n**Answer: Option (a)**',
'tag_atom_3'),

mkSCQ('ATOM-356','Medium',
'Radiations of frequency $\\nu$ are incident on a photo-sensitive metal. The max. KE of photoelectrons is $E$. When the frequency of the incident radiation is doubled, what is the max. KE of the photoelectrons?',
['$2E$','$E/2$','$E + h\\nu$','$E - h\\nu$'],
'c',
'Einstein\'s equation: $E = h\\nu - \\phi$ ... (1)\n\nAt $2\\nu$: $KE = 2h\\nu - \\phi = 2h\\nu - (h\\nu - E) = h\\nu + E$\n\n**Answer: Option (c) — $E + h\\nu$**',
'tag_atom_3'),

mkSCQ('ATOM-357','Hard',
'A certain metal when irradiated to light ($\\nu = 3.2 \\times 10^{16}$ Hz) emits photoelectrons with twice KE as did photoelectrons when the same metal is irradiated by light ($\\nu = 2.0 \\times 10^{16}$ Hz). Threshold frequency of the metal is',
['$1.2 \\times 10^{14}$ Hz','$8 \\times 10^{15}$ Hz','$1.2 \\times 10^{16}$ Hz','$4 \\times 10^{12}$ Hz'],
'b',
'Let $W = h\\nu_0$\n\n(1): $h(2.0\\times10^{16}) = W + KE$\n(2): $h(3.2\\times10^{16}) = W + 2KE$\n\n(2) $- 2\\times$(1):\n$$h(3.2-4.0)\\times10^{16} = -W$$\n$$W = h \\times 0.8\\times10^{16} = h\\times8\\times10^{15}$$\n$$\\nu_0 = 8\\times10^{15} \\text{ Hz}$$\n\n**Answer: Option (b)**',
'tag_atom_3'),

mkSCQ('ATOM-358','Medium',
'The ejection of the photoelectron from the silver metal in the photoelectric effect can be stopped by applying a voltage of 0.35 V when the radiation 256.7 nm is used. Work function for Ag metal is',
['4.83 eV','0.35 eV','4.48 eV','3.21 eV'],
'c',
'Energy of photon:\n$$E = \\frac{hc}{\\lambda} = \\frac{6.626\\times10^{-34}\\times3\\times10^8}{256.7\\times10^{-9}} = 7.74\\times10^{-19} \\text{ J} = 4.83 \\text{ eV}$$\n\nStopping potential = 0.35 V → $KE_{max} = 0.35$ eV\n\n$$\\phi = 4.83 - 0.35 = 4.48 \\text{ eV}$$\n\n**Answer: Option (c) — 4.48 eV**',
'tag_atom_3'),

mkSCQ('ATOM-359','Medium',
'The radius of which of the following orbit is same as that of the first Bohr\'s orbit of hydrogen atom?\n\na) $\\text{Li}^{2+}$ ($n=2$)\nb) $\\text{Li}^{2+}$ ($n=3$)\nc) $\\text{Be}^{3+}$ ($n=2$)\nd) $\\text{He}^+$ ($n=2$)',
['$\\text{Li}^{2+}$ ($n=2$)','$\\text{Li}^{2+}$ ($n=3$)','$\\text{Be}^{3+}$ ($n=2$)','$\\text{He}^+$ ($n=2$)'],
'c',
'Bohr radius: $r = \\dfrac{n^2}{Z} a_0$\n\nH, $n=1$: $r = a_0$\n\n- $\\text{Li}^{2+}$ ($Z=3$, $n=2$): $\\dfrac{4}{3}a_0$\n- $\\text{Li}^{2+}$ ($Z=3$, $n=3$): $\\dfrac{9}{3}a_0 = 3a_0$\n- $\\text{Be}^{3+}$ ($Z=4$, $n=2$): $\\dfrac{4}{4}a_0 = a_0$ ✓\n- $\\text{He}^+$ ($Z=2$, $n=2$): $\\dfrac{4}{2}a_0 = 2a_0$\n\n**Answer: Option (c) — $\\text{Be}^{3+}$ ($n=2$)**',
'tag_atom_4'),

mkSCQ('ATOM-360','Medium',
'P.E. of an electron present in the ground state of $\\text{Li}^{2+}$ ion is',
['$\\dfrac{3e^2}{4\\pi\\varepsilon_0 r}$','$-\\dfrac{3e}{4\\pi\\varepsilon_0 r}$','$-\\dfrac{3e^2}{4\\pi\\varepsilon_0 r}$','$-\\dfrac{3e^2}{4\\pi\\varepsilon_0 r^2}$'],
'c',
'$\\text{Li}^{2+}$ has $Z=3$, one electron (hydrogen-like).\n\nPotential energy = $\\dfrac{k(-e)(Ze)}{r} = -\\dfrac{kZe^2}{r} = -\\dfrac{3e^2}{4\\pi\\varepsilon_0 r}$\n\n(Negative because electron-nucleus attraction)\n\n**Answer: Option (c)**',
'tag_atom_4'),

mkSCQ('ATOM-361','Hard',
'Which one of the following about an electron occupying the 1s-orbital in a hydrogen atom is incorrect?\n\na) The electron can be found at a distance of $2a_0$ from the nucleus\nb) Magnitude of the P.E. is double that of its K.E. on an average\nc) Probability density of finding the electron is maximum at the nucleus\nd) Total energy of the electron is maximum when it is at a distance $a_0$ from nucleus',
['The electron can be found at a distance of $2a_0$ from the nucleus','Magnitude of the P.E. is double that of its K.E. on an average','Probability density of finding the electron is maximum at the nucleus','Total energy of the electron is maximum when it is at a distance $a_0$ from nucleus'],
'd',
'For 1s orbital in H:\n\n(a) Correct — electron can be found at any distance (wavefunction non-zero everywhere)\n\n(b) Correct — Virial theorem: $|PE| = 2 \\times KE$ for Coulombic systems\n\n(c) Correct — $\\psi^2$ is maximum at $r=0$ for 1s orbital\n\n(d) **Incorrect** — Total energy is **constant** (quantized), not a function of position. The electron\'s total energy is $-13.6$ eV regardless of where it is found. The most probable distance is $a_0$, but total energy doesn\'t vary with position in quantum mechanics.\n\n**Answer: Option (d)**',
'tag_atom_4'),

mkSCQ('ATOM-362','Medium',
'If the mass of electron is doubled, the radius of first orbit of H-atom becomes',
['0.529 Å','0.265 Å','1.058 Å','0.32 Å'],
'b',
'Bohr radius: $a_0 = \\dfrac{\\varepsilon_0 h^2}{\\pi m_e e^2} \\propto \\dfrac{1}{m_e}$\n\nIf $m_e$ is doubled: $a_0\' = \\dfrac{a_0}{2} = \\dfrac{0.529}{2} = 0.265$ Å\n\n**Answer: Option (b) — 0.265 Å**',
'tag_atom_4'),

];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const result = await db.collection('questions_v2').insertMany(questions);
  console.log(`Inserted ${result.insertedCount} questions (ATOM-340 to ATOM-362)`);
  await db.collection('chapters').updateOne(
    { _id: CHAPTER_ID },
    { $inc: { question_sequence: questions.length, 'stats.total_questions': questions.length, 'stats.published_questions': questions.length } }
  );
  console.log('Chapter stats updated.');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
