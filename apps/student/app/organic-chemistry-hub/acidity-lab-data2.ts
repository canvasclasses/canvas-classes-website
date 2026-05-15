// ── Carboxylic acid pKa data ──────────────────────────────────────────────────
export interface CaRow {
  y: string;
  acetic: number | null;
  ortho: number | null;
  meta: number | null;
  para: number | null;
  type: 'ewg' | 'edg' | 'neutral';
}

export const CA_DATA: CaRow[] = [
  { y:'H',      acetic:4.74, ortho:4.20, meta:4.20, para:4.20, type:'neutral' },
  { y:'CH₃',    acetic:4.87, ortho:3.91, meta:4.27, para:4.38, type:'edg' },
  { y:'C₂H₅',  acetic:4.82, ortho:3.79, meta:4.27, para:4.35, type:'edg' },
  { y:'F',       acetic:2.59, ortho:3.27, meta:3.86, para:4.14, type:'ewg' },
  { y:'Cl',      acetic:2.85, ortho:2.92, meta:3.83, para:3.97, type:'ewg' },
  { y:'Br',      acetic:2.90, ortho:2.85, meta:3.81, para:3.97, type:'ewg' },
  { y:'I',       acetic:3.18, ortho:2.86, meta:3.85, para:4.02, type:'ewg' },
  { y:'CN',      acetic:2.47, ortho:3.14, meta:3.64, para:3.55, type:'ewg' },
  { y:'CF₃',     acetic:3.06, ortho:null, meta:3.77, para:3.66, type:'ewg' },
  { y:'HO',      acetic:3.83, ortho:2.98, meta:4.08, para:4.57, type:'edg' },
  { y:'CH₃O',    acetic:3.57, ortho:4.09, meta:4.09, para:4.47, type:'edg' },
  { y:'C₆H₅',   acetic:4.31, ortho:3.46, meta:4.14, para:4.21, type:'neutral' },
  { y:'NO₂',     acetic:null, ortho:2.21, meta:3.49, para:3.42, type:'ewg' },
];

// ── Quiz questions ────────────────────────────────────────────────────────────
export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    q: 'Which is the most acidic?',
    options: ['ortho-NO₂ benzoic acid','meta-NO₂ benzoic acid','para-NO₂ benzoic acid','benzoic acid'],
    answer: 0,
    explanation: 'ortho-NO₂ (pKa 2.21) is most acidic. Both direct resonance withdrawal AND the ortho field effect operate simultaneously. meta (3.49) and para (3.42) are more acidic than unsubstituted benzoic acid (4.20) but less so than ortho.',
  },
  {
    q: 'Arrange in increasing order of acidity: (1) acetic acid (2) chloroacetic acid (3) dichloroacetic acid (4) trichloroacetic acid',
    options: ['1 < 2 < 3 < 4','4 < 3 < 2 < 1','1 < 3 < 2 < 4','2 < 1 < 4 < 3'],
    answer: 0,
    explanation: 'Each Cl replaces H and exerts a strong –I (inductive) effect, stabilising the carboxylate anion. More Cl atoms = stronger withdrawal = more acidic. pKa: CH₃COOH (4.74) > ClCH₂COOH (2.85) > Cl₂CHCOOH (1.48) > Cl₃CCOOH (0.66).',
  },
  {
    q: 'maleic acid (cis) vs fumaric acid (trans): which has the lower pKa₁ (more acidic)?',
    options: ['maleic acid (cis)','fumaric acid (trans)','They are identical','Depends on temperature'],
    answer: 0,
    explanation: 'Maleic acid pKa₁ = 1.92 vs fumaric acid pKa₁ = 3.02. After first ionisation of maleic acid, the carboxylate anion is stabilised by intramolecular H-bonding with the adjacent COOH group (possible only in the cis geometry). This dramatically lowers pKa₁.',
  },
  {
    q: 'Cyclopropane C–H bonds are more acidic than propane C–H bonds because:',
    options: ['Ring strain destabilises the C–H bond','Greater s-character in C–H bonds increases acidity','Cyclopropane has more hydrogen atoms','C–C bonds are weaker in cyclopropane'],
    answer: 1,
    explanation: 'The 60° bond angle in cyclopropane forces more p-character into the C–C ring bonds, leaving more s-character in the C–H bonds. Higher s-character means electron density is held closer to the carbon nucleus, better stabilising the carbanion formed after proton loss. pKa: cyclopropane (39) < cyclobutane (43) < propane (50).',
  },
  {
    q: 'ortho-tert-butyl benzoic acid is MORE acidic than para-tert-butyl benzoic acid. Why?',
    options: ['–tBu is EWG at ortho position','Steric inhibition of resonance + field effect at ortho','–tBu donates electrons at para only','Ortho position is always more acidic'],
    answer: 1,
    explanation: '–tBu is an EDG by hyperconjugation, so it should make benzoic acid less acidic. But at ortho, the bulk of tBu physically twists the COOH group out of conjugation with the ring (steric inhibition of resonance), preventing the neutral acid from being stabilised by delocalisation. The field effect through space also stabilises the anion. Net result: ortho-tBu benzoic acid (pKa 3.21) is more acidic than para (pKa ~3.98).',
  },
  {
    q: 'Which of these aliphatic acids is the most acidic?',
    options: ['F–CH₂–COOH (pKa 2.59)','Cl–CH₂–COOH (pKa 2.85)','Br–CH₂–COOH (pKa 2.90)','I–CH₂–COOH (pKa 3.18)'],
    answer: 0,
    explanation: 'Fluoroacetic acid is most acidic (pKa 2.59). Fluorine has the highest electronegativity of the halogens, exerting the strongest inductive (–I) effect through the CH₂ group to stabilise the carboxylate anion. The –I effect order is F > Cl > Br > I, which mirrors the acidity order perfectly.',
  },
  {
    q: 'cis-1,2-cyclohexanedicarboxylic acid has a lower pKa₁ than its trans isomer because:',
    options: ['The cis isomer is more stable conformationally','Both axial COOH groups enable intramolecular H-bonding in the anion','The trans isomer is less polar','cis isomers are always more acidic'],
    answer: 1,
    explanation: 'In cis-1,2-cyclohexanedicarboxylic acid, both COOH groups can occupy axial positions simultaneously, bringing them close in space. After the first ionisation, the carboxylate (COO⁻) is stabilised by intramolecular H-bonding with the adjacent COOH. This extra stabilisation lowers pKa₁. In the trans isomer, one group is axial and one equatorial — they are too far apart for effective H-bonding.',
  },
  {
    q: 'For benzoic acid derivatives, which substituent gives the LARGEST increase in acidity at the para position?',
    options: ['–F (para)','–Cl (para)','–NO₂ (para)','–CF₃ (para)'],
    answer: 2,
    explanation: '–NO₂ at para (pKa 3.42) gives the largest acidity increase. It acts by both –I (induction) and –M (resonance withdrawal), with full resonance conjugation at para. –F at para is surprisingly weak (4.14) because its +M resonance donation partly counteracts –I. –Cl and –CF₃ are intermediate. –NO₂ has the largest Hammett σ_para value (+0.78).',
  },
  {
    q: 'p-methoxybenzoic acid (anisic acid) has a higher pKa than benzoic acid because:',
    options: ['–OCH₃ is electron-withdrawing by induction','–OCH₃ donates electrons by resonance at para, destabilising carboxylate','–OCH₃ reduces ring aromaticity','The methoxy group is too large'],
    answer: 1,
    explanation: '–OCH₃ is a powerful +M donor (EDG by resonance). At para, it pushes electron density into the ring and toward the COOH group via resonance, destabilising the carboxylate anion (which needs to withdraw electrons). This makes p-methoxybenzoic acid less acidic (pKa 4.47) than benzoic acid (pKa 4.20). Note: at ortho, steric and field effects complicate matters — ortho-OCH₃ actually has pKa 4.09 (slightly more acidic than benzoic).',
  },
  {
    q: 'Which acid is more acidic: phenylacetic acid (C₆H₅–CH₂–COOH) or benzoic acid (C₆H₅–COOH)?',
    options: ['Phenylacetic acid (pKa 4.31)','Benzoic acid (pKa 4.20)','They are identical','Depends on solvent'],
    answer: 1,
    explanation: 'Benzoic acid (pKa 4.20) is more acidic than phenylacetic acid (pKa 4.31). In benzoic acid, the COOH is directly conjugated with the ring, allowing resonance delocalisation of the negative charge into the aromatic ring after ionisation. In phenylacetic acid, the CH₂ insulator breaks this conjugation — the phenyl group can only exert a weak inductive effect through CH₂.',
  },
];
