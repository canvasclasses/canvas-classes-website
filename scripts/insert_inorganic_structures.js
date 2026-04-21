/**
 * Insert "Inorganic Structures & Molecular Architecture" flashcard chapter.
 * 76 cards across 7 topics — all questions require structural reasoning,
 * not mere formula recall.
 *
 * Usage:
 *   node scripts/insert_inorganic_structures.js           # dry run
 *   node scripts/insert_inorganic_structures.js --apply   # write to DB
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');

const CHAPTER = {
  id:       'inorganic_structures',
  name:     'Inorganic Structures & Molecular Architecture',
  category: 'Inorganic Chemistry',
};

const TOPICS = {
  VSEPR:    { name: 'Hybridisation & VSEPR — Anomalies & Non-Obvious Shapes', order: 1 },
  NP:       { name: 'Nitrogen & Phosphorus Compound Structures',              order: 2 },
  SO:       { name: 'Sulfur & Oxygen Compound Structures',                    order: 3 },
  HAL:      { name: 'Halogen & Noble Gas Compound Structures',                order: 4 },
  OXOACID:  { name: 'Phosphorus Oxoacid Bond Architecture',                   order: 5 },
  COMPARE:  { name: 'Comparative Structural Analysis',                        order: 6 },
  CRYSTAL:  { name: 'Coordination & Crystal Geometry',                        order: 7 },
};

function card(id, topic, difficulty, question, answer) {
  return {
    _id: uuidv4(),
    flashcard_id: id,
    chapter: { ...CHAPTER },
    topic: { name: topic.name, order: topic.order },
    question,
    answer,
    deleted_at: null,
    metadata: {
      difficulty,
      tags: [topic.name, CHAPTER.name],
      source: 'Canvas Chemistry',
      class_num: 12,
      created_at: new Date(),
      updated_at: new Date(),
    },
  };
}

// ─── Cards ────────────────────────────────────────────────────────────────────

const CARDS = [

  // ── Topic 1: Hybridisation & VSEPR Anomalies ─────────────────────────────

  card('ISTR-001', TOPICS.VSEPR, 'medium',
    `$\\ce{NH3}$ has a bond angle of 107°, yet $\\ce{NF3}$ has only 102.5° despite identical geometry (pyramidal, 1 lone pair). Explain the smaller angle in $\\ce{NF3}$ using electron-pair repulsion.`,
    `In $\\ce{NH3}$, H is less electronegative than N — bond pairs stay close to N and repel each other strongly. In $\\ce{NF3}$, highly electronegative F pulls bond pairs away from N, reducing bp–bp repulsion. The lone pair on N is unchanged, so its relative dominance grows in $\\ce{NF3}$ → bonds close in → smaller angle.`
  ),

  card('ISTR-002', TOPICS.VSEPR, 'medium',
    `$\\ce{H2O}$ has a bond angle of 104.5° while $\\ce{H2S}$ has only 92°. Both have 2 bonding pairs and 2 lone pairs. Why does $\\ce{H2S}$ approach 90°?`,
    `S is a period-3 element and uses nearly pure 3p orbitals for bonding (hybridisation is negligible), giving angles close to the 90° p–p orbital intersection. In $\\ce{H2O}$, the smaller O and shorter O–H bonds force strong repulsion, requiring sp³-like hybridisation to minimise energy → 104.5°.`
  ),

  card('ISTR-003', TOPICS.VSEPR, 'medium',
    `In $\\ce{PCl5}$ (trigonal bipyramidal), axial P–Cl bonds (219 pm) are longer than equatorial P–Cl bonds (204 pm). What causes this difference?`,
    `Axial bonds face repulsion from all three equatorial bond pairs at 90° (three 90° interactions), while equatorial bonds face only two axial pairs at 90° plus two equatorial at 120° (less total repulsion). Greater repulsion elongates axial bonds. Axial positions also use more p/d character (less s-character) → inherently weaker and longer bonds.`
  ),

  card('ISTR-004', TOPICS.VSEPR, 'medium',
    `$\\ce{SF4}$ has 4 bonding pairs and 1 lone pair in a trigonal bipyramidal electron geometry. The lone pair can sit axial or equatorial. Which position does it choose, and why?`,
    `The lone pair occupies the **equatorial** position → see-saw shape. An equatorial lone pair has only 2 interactions at 90° (with the 2 axial bonds). An axial lone pair would have 3 interactions at 90° (with all 3 equatorial bonds). Fewer 90° interactions = less repulsion → equatorial placement wins.`
  ),

  card('ISTR-005', TOPICS.VSEPR, 'medium',
    `$\\ce{ClF3}$ has a T-shape, not a trigonal planar shape. Where do its 2 lone pairs sit, and what is the approximate F(equatorial)–Cl–F(axial) bond angle?`,
    `Both lone pairs occupy equatorial positions in the trigonal bipyramidal parent geometry. Two F atoms are axial and one is equatorial → T-shape. F(eq)–Cl–F(ax) ≈ **87.5°** (less than 90°), because the equatorial lone pairs push the axial F atoms toward each other.`
  ),

  card('ISTR-006', TOPICS.VSEPR, 'medium',
    `In $\\ce{XeF2}$, Xe has 5 electron domains (2 bond pairs + 3 lone pairs). All 3 lone pairs sit in equatorial positions, leaving F atoms at axial positions. Explain why lone pairs must be equatorial here.`,
    `An equatorial lone pair has only 2 interactions at 90° (with 2 axial neighbors). An axial lone pair would have 3 interactions at 90° (with 3 equatorial neighbors). Three lone pairs each choosing equatorial to minimise 90° repulsions forces both F atoms to the axial positions → **linear** $\\ce{F-Xe-F}$ molecule.`
  ),

  card('ISTR-007', TOPICS.VSEPR, 'medium',
    `$\\ce{XeF4}$ has 6 electron domains. Of the two possible relative positions for the 2 lone pairs (cis/90° or trans/180°), which does the molecule adopt, and what shape results?`,
    `The 2 lone pairs adopt **trans (180°) positions** — both axial — to place them as far apart as possible (lp–lp 180° repulsion < 90° repulsion). The 4 F atoms occupy the equatorial plane → **square planar** molecule. A cis arrangement (90° lp–lp) would be far more repulsive.`
  ),

  card('ISTR-008', TOPICS.VSEPR, 'easy',
    `$\\ce{PCl5}$ is stable, but $\\ce{NCl5}$ has never been synthesised. Give a structural reason.`,
    `N is in period 2 and has no d-orbitals — its valence shell is limited to 2s and 2p (maximum 8 electrons). $\\ce{NCl5}$ would require 10 electrons on N (5 bonds) → impossible. P is in period 3 and has empty 3d orbitals available, allowing sp³d hybridisation and 5 bonds → $\\ce{PCl5}$ exists.`
  ),

  card('ISTR-009', TOPICS.VSEPR, 'hard',
    `$\\ce{CO2}$ is linear, but $\\ce{NO2}$ is bent (134°). Both are triatomic with the central atom bonded to 2 oxygens. What is the structural origin of the bend in $\\ce{NO2}$?`,
    `C in $\\ce{CO2}$ uses all 4 valence electrons in 2 C=O double bonds → no lone pair → sp hybridisation → linear. N in $\\ce{NO2}$ has 5 valence electrons: 4 in two N–O bonds + 1 unpaired electron (odd-electron radical). This odd electron occupies space like a "half lone pair," repelling the N–O bonds → bent at 134°. Note: $\\ce{NO2^-}$ (full lone pair) has a smaller angle (~115°).`
  ),

  card('ISTR-010', TOPICS.VSEPR, 'easy',
    `Rank $\\ce{CH4}$, $\\ce{NH3}$, $\\ce{H2O}$ by decreasing bond angle and explain the trend.`,
    `$\\ce{CH4}$ (109.5°) > $\\ce{NH3}$ (107°) > $\\ce{H2O}$ (104.5°). Each lone pair added compresses bond angles because lone pairs occupy more angular space than bond pairs (lone pairs are closer to the nucleus). 0 lone pairs → ideal tetrahedral; 1 lp → slightly compressed; 2 lp → most compressed.`
  ),

  card('ISTR-011', TOPICS.VSEPR, 'easy',
    `$\\ce{BF3}$ is planar but $\\ce{NF3}$ is pyramidal, despite both having 3 F atoms. What determines the fundamentally different architecture?`,
    `B has 3 valence electrons → forms 3 bonds with zero lone pairs → 3 electron domains → sp² → trigonal planar. N has 5 valence electrons → 3 bonds + 1 lone pair → 4 electron domains → sp³ → trigonal pyramidal. The lone pair on N is the 4th domain that changes everything.`
  ),

  card('ISTR-012', TOPICS.VSEPR, 'medium',
    `Both $\\ce{IF5}$ and $\\ce{BrF5}$ are square pyramidal. How many lone pairs does each central atom have, and why is the apical F–M–F(equatorial) angle less than 90°?`,
    `Each has **1 lone pair** on the central atom (6 electron domains: 5 bp + 1 lp → octahedral parent). The lone pair sits at one axial position. It pushes the 4 equatorial F atoms away from itself, compressing the apical F–M–F(eq) angle to ≈84–85° (below 90°). Hybridisation: sp³d².`
  ),

  // ── Topic 2: Nitrogen & Phosphorus Compound Structures ────────────────────

  card('ISTR-013', TOPICS.NP, 'medium',
    `The P–P–P bond angle in $\\ce{P4}$ (white phosphorus) is only 60°, far below the ideal sp³ angle of 109.5°. What direct consequence does this strain have on reactivity?`,
    `60° creates severe angle strain (orbital overlap occurs at the wrong angle — so-called "banana bonds"). This weakens the P–P bonds to ~200 kJ/mol (vs N≡N at 945 kJ/mol). The stored strain energy is released in reactions, making white P spontaneously flammable in air.`
  ),

  card('ISTR-014', TOPICS.NP, 'medium',
    `In $\\ce{P4O6}$, each pair of P atoms from the original $\\ce{P4}$ tetrahedron is connected by one bridging O atom. How many P–O–P bridges are there, and what is the total P–O bond count?`,
    `The $\\ce{P4}$ tetrahedron has 6 edges → **6 P–O–P bridges** (one O inserted into each P–P edge). Total P–O bonds = 12 (each bridge = 2 P–O bonds; 6 × 2 = 12). Equivalently: each of 4 P atoms forms 3 P–O bonds → 4 × 3 = 12.`
  ),

  card('ISTR-015', TOPICS.NP, 'hard',
    `$\\ce{P4O10}$ contains both bridging and terminal P–O bonds. How many of each type are present, and which is shorter — and why?`,
    `**Bridging P–O–P**: 12 (same 6 bridges as in $\\ce{P4O6}$, counting 2 bonds per bridge). **Terminal P=O**: 4 (one extra =O per P atom vs $\\ce{P4O6}$). Total P–O = 16. Terminal P=O bonds are **shorter** (~143 pm vs ~162 pm for bridging) due to pπ–dπ back-bonding from O lone pairs into empty P 3d orbitals — partial double bond character.`
  ),

  card('ISTR-016', TOPICS.NP, 'hard',
    `The N–N bond in $\\ce{N2O4}$ (175 pm) is far longer than a normal N–N single bond (145 pm). What structural feature causes this weakness, and what observable phenomenon confirms it?`,
    `Each N in $\\ce{N2O4}$ already bonds to 2 electronegative O atoms, depleting electron density on N. The N–N bond forms between two electron-poor N centers → minimal σ overlap → very weak (~57 kJ/mol). Confirmation: $\\ce{N2O4}$ (colourless) readily dissociates to brown $\\ce{NO2}$ on warming — the N–N bond breaks homolytically.`
  ),

  card('ISTR-017', TOPICS.NP, 'medium',
    `$\\ce{N2O4}$ has a direct N–N bond. $\\ce{N2O5}$ does not. What connects the two $\\ce{NO2}$ groups in $\\ce{N2O5}$?`,
    `An **N–O–N bridge**: structure is $\\ce{O2N-O-NO2}$. In the solid state, $\\ce{N2O5}$ is actually ionic: $\\ce{[NO2]+[NO3]-}$ (nitronium nitrate). In the gas phase it is covalent with an asymmetric N–O–N linkage (~112°). No direct N–N bond exists in $\\ce{N2O5}$.`
  ),

  card('ISTR-018', TOPICS.NP, 'hard',
    `Compare $\\ce{N2O4}$ and $\\ce{N2O5}$: identify (i) the bond type linking the two nitrogen centres, and (ii) the geometry around each N in each molecule.`,
    `**$\\ce{N2O4}$**: direct N–N single bond (175 pm); each N is trigonal planar (sp², 3 N=O/N–O bonds, no lone pair). **$\\ce{N2O5}$**: N–O–N bridge; each terminal N is sp² (bonded to 2 oxygens + the bridge oxygen). The +5 oxidation state of N in $\\ce{N2O5}$ vs +4 in $\\ce{N2O4}$ arises from the extra O insertion.`
  ),

  card('ISTR-019', TOPICS.NP, 'medium',
    `$\\ce{B2H6}$ has only 12 valence electrons yet appears to require 7 bonds. What type of bonding resolves this electron deficiency, and how many such bonds are present?`,
    `$\\ce{B2H6}$ contains **2 three-centre two-electron (3c-2e) bonds** formed by the 2 bridging H atoms. Each bridge (B–H–B) is held by only 2 electrons spread over 3 atoms — no octet violation per B (only 6 electrons around each B). This leaves 4 terminal B–H bonds (8 electrons). Bridging B–H bonds (133 pm) are longer and weaker than terminal B–H bonds (119 pm).`
  ),

  card('ISTR-020', TOPICS.NP, 'medium',
    `Borazine ($\\ce{B3N3H6}$) is called "inorganic benzene." List the structural similarities and the key chemical difference.`,
    `**Similarities**: 6-membered ring; alternating B–N bonds of equal length (~144 pm, between single and double); planar; sp² hybridisation at all ring atoms; delocalized π electrons. **Key difference**: the B–N bond is polar (B is Lewis-acid, N is Lewis-base), so borazine undergoes addition reactions across B–N rather than substitution — far less aromatic stability than benzene.`
  ),

  card('ISTR-021', TOPICS.NP, 'medium',
    `The $\\ce{[B4O5(OH)4]^{2-}}$ anion in borax contains two distinct types of boron. Identify them, their hybridisation, and how many OH groups each type carries.`,
    `**Tetrahedral B (sp³)**: 2 atoms, each with 2 B–OH and 2 bridging B–O–B bonds. These carry the −1 charge each (total −2 for the anion). **Trigonal planar B (sp²)**: 2 atoms, each with 3 bridging B–O bonds and 0 OH groups. The formal negative charge is concentrated on the sp³ centres.`
  ),

  card('ISTR-022', TOPICS.NP, 'hard',
    `Count the number of bridging B–O–B linkages in one $\\ce{[B4O5(OH)4]^{2-}}$ unit systematically.`,
    `sp² B (×2) each form 3 bonds to bridging O → 6 bonds to bridging O. sp³ B (×2) each form 2 bonds to bridging O + 2 bonds to OH → 4 bonds to bridging O. Total bonds to bridging O = 10. Each bridging O participates in exactly 2 B–O bonds → bridges = 10 ÷ 2 = **5 B–O–B linkages**.`
  ),

  card('ISTR-023', TOPICS.NP, 'easy',
    `White phosphorus ($\\ce{P4}$) ignites spontaneously in air; red phosphorus requires a match. Compare their structures to explain the reactivity difference.`,
    `White P: discrete $\\ce{P4}$ molecules with 60° angle strain → highly strained, reactive P–P bonds. Red P: polymeric chains where one P–P bond per $\\ce{P4}$ unit is broken to link tetrahedra into a network → angle strain is relieved → much more stable. Red P has a higher activation energy for oxidation and does not undergo spontaneous combustion.`
  ),

  card('ISTR-024', TOPICS.NP, 'easy',
    `In $\\ce{H3PO4}$, count all P–O bonds and classify each as P=O or P–OH. State the hybridisation of P.`,
    `P has **4 bonds** total: **1 P=O** (terminal, shorter, partial double bond character) + **3 P–OH** (ionizable, longer). Hybridisation: **sp³** (tetrahedral). All 3 P–OH protons are ionizable → tribasic acid. The P=O bond is strengthened by pπ–dπ back-bonding from O lone pairs to P 3d orbitals.`
  ),

  // ── Topic 3: Sulfur & Oxygen Compound Structures ─────────────────────────

  card('ISTR-025', TOPICS.SO, 'easy',
    `$\\ce{SO2}$ is angular (119°) while $\\ce{SO3}$ is trigonal planar (120°). What single feature in $\\ce{SO2}$ causes the change from planar to bent?`,
    `$\\ce{SO2}$: S has 1 lone pair + 2 S=O bonds → 3 electron domains → sp² → **bent**. $\\ce{SO3}$: S has 0 lone pairs + 3 S=O bonds → 3 electron domains → sp² → **trigonal planar**. The lone pair on S in $\\ce{SO2}$ occupies the third sp² position and compresses the O–S–O angle from 120° to 119°.`
  ),

  card('ISTR-026', TOPICS.SO, 'medium',
    `$\\ce{H2SO4}$ has two S–O bond lengths: 154 pm and 143 pm. Identify which bonds are which and explain the difference.`,
    `**154 pm**: S–OH bonds (single bonds; H is ionizable). **143 pm**: S=O terminal bonds (shorter because O lone pairs back-donate into empty S 3d orbitals → partial double bond character, bond order > 1). Greater bond order → shorter, stronger bond. The two terminal S=O groups are also the main contributors to $\\ce{H2SO4}$'s dehydrating power.`
  ),

  card('ISTR-027', TOPICS.SO, 'medium',
    `$\\ce{H2SO5}$ (Caro's acid) and $\\ce{H2SO4}$ both contain S in the +6 state, but $\\ce{H2SO5}$ is a far stronger oxidizer. Identify the single structural difference.`,
    `$\\ce{H2SO5}$ contains a **peroxide bond** (–O–O–): structure HO–S(=O)₂–O–O–H, where one S–OH of $\\ce{H2SO4}$ is replaced by S–OOH. The weak O–O bond (~150 kJ/mol) cleaves to release reactive oxidising species. $\\ce{H2SO4}$ has no O–O bond → far weaker oxidizer under the same conditions.`
  ),

  card('ISTR-028', TOPICS.SO, 'medium',
    `$\\ce{H2S2O7}$ (oleum) forms when $\\ce{SO3}$ absorbs into $\\ce{H2SO4}$. Describe the bridge connecting the two S centres and count the terminal S=O bonds in one molecule.`,
    `Bridge: a single **S–O–S linkage** (one bridging O). Structure: HO–S(=O)₂–**O**–S(=O)₂–OH. Each S has 2 terminal S=O bonds → **4 terminal S=O bonds** per molecule. Additionally: 2 S–OH groups and 1 bridging S–O–S. Compare to $\\ce{H2S2O8}$ which has an S–O–O–S bridge (peroxide).`
  ),

  card('ISTR-029', TOPICS.SO, 'medium',
    `Compare the bridges in $\\ce{H2S2O8}$ (Marshall's acid) and $\\ce{H2S2O7}$. Which is the stronger oxidizer and why?`,
    `**$\\ce{H2S2O7}$**: S–O–S bridge (ether-type, stable). **$\\ce{H2S2O8}$**: S–O–O–S bridge (peroxide bond, O–O). $\\ce{H2S2O8}$ is the stronger oxidizer because the O–O peroxide bond is very weak (~150 kJ/mol) and cleaves to give $\\ce{HSO4^.}$ radicals — powerful enough to oxidise Mn²⁺ to $\\ce{MnO4^-}$ in the presence of $\\ce{Ag+}$ catalyst.`
  ),

  card('ISTR-030', TOPICS.SO, 'easy',
    `Ozone's O–O bond length (128 pm) is intermediate between a single O–O bond (148 pm) and a double O=O bond (121 pm). What is the O–O bond order, and how does it arise?`,
    `Bond order = **1.5**. Ozone has two equivalent resonance structures (O=O–O ↔ O–O=O). Delocalisation spreads the π electrons equally over both O–O links → each has bond order 1.5. The bent shape (117°) arises from 1 lone pair on the central O.`
  ),

  card('ISTR-031', TOPICS.SO, 'medium',
    `Using Pauling's oxoacid rule (more non-OH oxygens = stronger acid), arrange $\\ce{H2SO3}$ and $\\ce{H2SO4}$ by acid strength and identify the number of non-OH oxygens in each.`,
    `$\\ce{H2SO3}$: **1 non-OH S=O** → moderate acid (Ka₁ ≈ 1.5×10⁻²). $\\ce{H2SO4}$: **2 non-OH S=O** → strong acid (Ka₁ > 1). Each additional S=O group withdraws electron density from S → weakens and polarises the O–H bond → increases acidity by ~10⁵ per extra =O group (Pauling's approximation).`
  ),

  card('ISTR-032', TOPICS.SO, 'medium',
    `$\\ce{H2SO3}$ is a reducing agent yet it has no S–H bonds (unlike phosphorous acid). What structural feature makes it reducing?`,
    `$\\ce{H2SO3}$ has S in the +4 oxidation state — two below its maximum of +6. The lone pair on S and the low oxidation state make S a potential electron donor: S(+4) → S(+6) as $\\ce{H2SO4}$. This oxidizability (not a structural S–H bond) drives the reducing behaviour. Example: $\\ce{H2SO3 + Cl2 + H2O -> H2SO4 + 2HCl}$.`
  ),

  card('ISTR-033', TOPICS.SO, 'hard',
    `Dilute $\\ce{H2SO4}$ liberates $\\ce{H2}$ from reactive metals, but concentrated $\\ce{H2SO4}$ oxidises $\\ce{Cu}$ to release $\\ce{SO2}$ instead. What is the electron-transfer difference?`,
    `Dilute: H⁺ is the oxidising agent — gets reduced (H⁺→H₂), S stays +6. Concentrated: the undissociated $\\ce{H2SO4}$ molecule acts as oxidiser — **S(+6) is reduced to S(+4)** as $\\ce{SO2}$. Low water activity in concentrated acid prevents H⁺-mediated reduction; instead, the S=O bonds of the intact acid accept electrons from Cu. Result: $\\ce{Cu + 2H2SO4(conc) -> CuSO4 + SO2 + 2H2O}$.`
  ),

  card('ISTR-034', TOPICS.SO, 'easy',
    `Both $\\ce{SO2}$ and $\\ce{O3}$ are isoelectronic (18 valence electrons), angular, and have the same bond order of 1.5. Yet $\\ce{SO2}$ is a pollutant while $\\ce{O3}$ is a stratospheric shield. What gives both a bond order of 1.5?`,
    `Both have two equivalent bonds in resonance: $\\ce{SO2}$: O=S–O ↔ O–S=O; $\\ce{O3}$: O=O–O ↔ O–O=O. Delocalisation of the π electrons over both bonds gives each bond order 1.5. The central atom in both has 1 lone pair (sp²) → bent geometry.`
  ),

  // ── Topic 4: Halogen & Noble Gas Compound Structures ─────────────────────

  card('ISTR-035', TOPICS.HAL, 'medium',
    `In the series $\\ce{ClF}$, $\\ce{ClF3}$, $\\ce{ClF5}$, what happens to the oxidation state and Lewis acidity of Cl as F atoms increase? How does this affect reactivity?`,
    `Cl becomes increasingly δ+ as more electronegative F atoms pull electron density away: +1, +3, +5. Higher oxidation state → greater Lewis acidity of Cl. Each step also increases fluorinating power (Cl can accept more electrons from a substrate). However, greater steric crowding and shorter Cl–F bonds in higher fluorides can reduce selectivity.`
  ),

  card('ISTR-036', TOPICS.HAL, 'hard',
    `In $\\ce{ClF3}$ (T-shaped), which Cl–F bonds are shorter — axial or equatorial — and what is the orbital reason?`,
    `**Equatorial** Cl–F bonds (159.8 pm) are shorter and stronger. In a trigonal bipyramidal arrangement, equatorial bonds use sp²-hybridised orbitals (higher s-character → shorter, stronger). Axial bonds use sp³d orbitals (more d/p character, less s → longer, weaker). Additionally, the 2 equatorial lone pairs repel the axial bonds, elongating them further.`
  ),

  card('ISTR-037', TOPICS.HAL, 'hard',
    `$\\ce{XeF2}$ is a stable compound despite Xe being a noble gas. Provide a molecular orbital (3c-4e bond) explanation for its stability.`,
    `The Xe–F bonds in $\\ce{XeF2}$ are described by a **three-centre four-electron (3c-4e)** bond along the F–Xe–F axis: bonding MO (both F and Xe contribute, electron density in bonding region), non-bonding MO (electron density on the two F atoms only, not on Xe), and the antibonding MO (empty). Four electrons go into the bonding and non-bonding MOs → net bonding, but no antibonding occupation → stable; Xe retains near-noble-gas configuration.`
  ),

  card('ISTR-038', TOPICS.HAL, 'easy',
    `Using VSEPR alone, predict the shape of $\\ce{XeF4}$: state the number of lone pairs on Xe, the parent geometry, and the molecular shape.`,
    `Xe: 8 valence e⁻; 4 Xe–F bonds use 8 e⁻ → 4 bonding pairs + 2 lone pairs = **6 electron domains** → octahedral parent. The 2 lone pairs minimise repulsion by sitting **trans (180° apart), both axial**. The 4 F atoms occupy the equatorial plane → **square planar** molecule.`
  ),

  card('ISTR-039', TOPICS.HAL, 'hard',
    `$\\ce{XeF2}$ (3 lp) is linear and $\\ce{XeF4}$ (2 lp) is square planar — both regular shapes. But $\\ce{XeF6}$ (1 lp) is a distorted octahedron. Why does the single lone pair in $\\ce{XeF6}$ cause irregularity while the multiple lone pairs in $\\ce{XeF2}$ and $\\ce{XeF4}$ do not?`,
    `In $\\ce{XeF2}$ and $\\ce{XeF4}$, the multiple lone pairs find symmetric positions (all equatorial, or both axial) that restore molecular symmetry. In $\\ce{XeF6}$, only 1 lone pair must be placed in a 7-domain pentagonal bipyramidal arrangement — no position is equivalent to its mirror image → the lone pair is **"stereochemically active"** and distorts the octahedral geometry asymmetrically.`
  ),

  card('ISTR-040', TOPICS.HAL, 'medium',
    `$\\ce{BrF5}$ is square pyramidal. How many lone pairs on Br, and why is the apical F–Br–F(equatorial) angle less than 90°?`,
    `Br: 7 valence e⁻; 5 bonds + **1 lone pair** = 6 electron domains → octahedral parent → square pyramidal. The lone pair occupies one axial position and repels the 4 equatorial F atoms away from itself → apical F–Br–F(eq) angle **≈84.8°** (below 90°). Without the lone pair repulsion, the angle would be exactly 90°.`
  ),

  card('ISTR-041', TOPICS.HAL, 'hard',
    `In a trigonal bipyramidal molecule such as $\\ce{PF3Cl2}$, do F atoms prefer axial or equatorial positions? Give the structural reason.`,
    `F prefers **axial** positions. Axial bonds in trigonal bipyramidal systems have more p-character (less s-character) → less electron density near P. Electronegative F is most stable in positions where it can pull the bonding pair away from P efficiently, which is enhanced by the higher-p-character axial bonds. Less electronegative groups (e.g., alkyl) prefer equatorial (more s-character, more electron density).`
  ),

  card('ISTR-042', TOPICS.HAL, 'medium',
    `Predict the shapes and hybridisation of Xe in $\\ce{XeO3}$ and $\\ce{XeO4}$.`,
    `**$\\ce{XeO3}$**: Xe has 8 valence e⁻; 3 Xe=O bonds use 6 e⁻ + 1 lone pair → 4 electron domains → sp³ → **trigonal pyramidal** (like $\\ce{NH3}$). **$\\ce{XeO4}$**: 4 Xe=O bonds use all 8 e⁻ → no lone pair → 4 electron domains → sp³ → **tetrahedral** (like $\\ce{SO4^{2-}}$). More Xe=O bonds also stabilises $\\ce{XeO4}$ through back-bonding.`
  ),

  card('ISTR-043', TOPICS.HAL, 'easy',
    `$\\ce{HF}$ has a boiling point of 19.5°C while $\\ce{HCl}$ boils at −85°C, yet $\\ce{HF}$ is a weaker acid. Explain both observations structurally.`,
    `**High BP of HF**: F–H...F hydrogen bonds (strong, due to F being the most electronegative element) form extended chains in liquid HF → much more energy needed to vaporise → BP 19.5°C vs −85°C for $\\ce{HCl}$ (no H-bonding). **Weak acid**: the H–F bond is very short and strong (570 kJ/mol) → hard to dissociate despite high polarity. $\\ce{HCl}$: weaker H–Cl bond → easier dissociation → stronger acid.`
  ),

  card('ISTR-044', TOPICS.HAL, 'medium',
    `Among $\\ce{BF3}$, $\\ce{BCl3}$, $\\ce{BI3}$, which is the strongest Lewis acid? This contradicts naive electronegativity expectations — explain.`,
    `Strongest Lewis acid: **$\\ce{BI3} > BCl3 > BF3}$**. Despite F being most electronegative, $\\ce{BF3}$ is the weakest Lewis acid because F lone pairs back-donate into the empty B 2p orbital (2p–2p pπ–pπ overlap is excellent) → partial B=F double bond → B's empty orbital is partially filled → reduced Lewis acidity. I has poor 5p–2p overlap with B → essentially no back-bonding → B 2p orbital stays empty and strongly Lewis acidic.`
  ),

  card('ISTR-045', TOPICS.HAL, 'medium',
    `$\\ce{SiCl4}$ is rapidly hydrolysed by water, but $\\ce{CCl4}$ is inert under normal conditions. Both are tetrahedral. What orbital difference explains this?`,
    `Si in $\\ce{SiCl4}$ has empty **3d orbitals** available for coordination → water's O lone pair can attack Si → forms a 5-coordinate intermediate → hydrolysis proceeds. C in $\\ce{CCl4}$ is period 2 with no accessible d-orbitals — the C valence shell is full (2s²2p⁴ fully engaged) → no coordination site for water's attack → $\\ce{CCl4}$ is hydrolytically inert.`
  ),

  card('ISTR-046', TOPICS.HAL, 'hard',
    `In the halogen oxoacid series $\\ce{HClO}$, $\\ce{HClO2}$, $\\ce{HClO3}$, $\\ce{HClO4}$: (i) give the number of non-OH oxygens on Cl in each, (ii) state the hybridisation of Cl throughout the series.`,
    `Non-OH oxygens: $\\ce{HClO}$: **0**; $\\ce{HClO2}$: **1**; $\\ce{HClO3}$: **2**; $\\ce{HClO4}$: **3**. Hybridisation of Cl: all are **sp³** throughout the series ($\\ce{HClO}$: 1 bond + 2 lp + 1 lone bond partner? No: Cl–O–H with 2 lp on Cl → sp³; each added =O adds a bond and removes a lone pair, staying at 4 electron domains). Acid strength increases with non-OH oxygens: $\\ce{HClO < HClO2 < HClO3 < HClO4}$.`
  ),

  // ── Topic 5: Phosphorus Oxoacid Bond Architecture ────────────────────────

  card('ISTR-047', TOPICS.OXOACID, 'easy',
    `$\\ce{H3PO2}$ (hypophosphorous acid) has the formula suggesting it is tribasic, yet it is monobasic. What does this tell you about its structure?`,
    `2 of the 3 H atoms are directly bonded to P (P–H bonds), not to O. Only **1 P–OH** group is ionizable. Structure: HP(=O)(OH)H — **1 P=O**, **1 P–OH**, **2 P–H**. P–H bonds are non-acidic. Monobasic, Ka ≈ 5.9×10⁻².`
  ),

  card('ISTR-048', TOPICS.OXOACID, 'easy',
    `$\\ce{H3PO3}$ (phosphorous acid) is dibasic, not tribasic. Identify the structural formula, count P=O, P–OH, and P–H bonds, and explain why one H is not ionizable.`,
    `Structure: HP(=O)(OH)₂ → **1 P=O**, **2 P–OH**, **1 P–H**. The P–H bond does not ionize: P and H have similar electronegativities, and P–H is not an O–H bond — there is no O to withdraw electron density and stabilize the conjugate base. Basicity = number of P–OH bonds = 2.`
  ),

  card('ISTR-049', TOPICS.OXOACID, 'medium',
    `$\\ce{H3PO2}$ has 2 P–H bonds, $\\ce{H3PO3}$ has 1, and $\\ce{H3PO4}$ has 0. Arrange them by reducing power and explain the structural basis.`,
    `Reducing power: **$\\ce{H3PO2} > H3PO3 > H3PO4}$** ($\\ce{H3PO4}$ is non-reducing). P–H bonds are the source of reducing equivalents: they allow P to be oxidised (P–H breaks → P=O forms, releasing electrons). More P–H bonds = more oxidizable sites. $\\ce{H3PO4}$ with zero P–H bonds cannot donate electrons this way.`
  ),

  card('ISTR-050', TOPICS.OXOACID, 'medium',
    `$\\ce{H4P2O7}$ forms by condensation of two $\\ce{H3PO4}$ molecules. Count its P–OH, P=O, and P–O–P bonds and state its basicity.`,
    `Structure: HO(O=)P–O–P(=O)(OH)₂ (two PO₄ tetrahedra sharing one O). Bonds: **4 P–OH** (2 per P), **2 P=O** (1 per P), **1 bridging P–O–P**. Basicity = **4** (tetrabasic — all 4 OH groups ionize). Total P–O bonds = 4(P–OH) + 2(P=O) + 2(P–O from bridge) = 8 per molecule.`
  ),

  card('ISTR-051', TOPICS.OXOACID, 'medium',
    `$(\\ce{HPO3})_n$ (meta-phosphoric acid) is formed by removing one water from $\\ce{H3PO4}$. Is it a reducing agent? What is its basicity per unit, and what is its polymeric structure?`,
    `**Not a reducing agent** — no P–H bond. **Basicity = 1 per HPO₃ unit** (1 P–OH per P). Structure: cyclic $(\\ce{HPO3})_3$ trimer (or polymeric chain) — each P has 1 P–OH, 1 P=O, and 2 bridging P–O–P bonds linking the ring/chain. Unlike $\\ce{H3PO4}$ (3 P–OH), HPO₃ has condensed away 2 water molecules per P, leaving only 1 ionizable OH.`
  ),

  card('ISTR-052', TOPICS.OXOACID, 'easy',
    `State the single structural rule that predicts the basicity of any phosphorus oxoacid, and apply it to $\\ce{H3PO4}$, $\\ce{H3PO3}$, $\\ce{H3PO2}$, $\\ce{H4P2O7}$.`,
    `**Rule: Basicity = number of P–OH bonds** (only ionizable group is O–H attached to P). Application: $\\ce{H3PO4}$: 3 P–OH → tribasic. $\\ce{H3PO3}$: 2 P–OH → dibasic. $\\ce{H3PO2}$: 1 P–OH → monobasic. $\\ce{H4P2O7}$: 4 P–OH → tetrabasic.`
  ),

  card('ISTR-053', TOPICS.OXOACID, 'hard',
    `Pauling's rule for oxoacid strength: pKa₁ ≈ 8 − 5n, where n = number of non-OH oxygens. Apply it to $\\ce{H3PO4}$, $\\ce{H2SO4}$, $\\ce{HClO4}$ and check against known values.`,
    `$\\ce{H3PO4}$ (n=1): pKa₁ ≈ 8−5 = **3** (actual ≈ 2.1 ✓ moderate acid). $\\ce{H2SO4}$ (n=2): pKa₁ ≈ 8−10 = **−2** (actual < 0 ✓ strong acid). $\\ce{HClO4}$ (n=3): pKa₁ ≈ 8−15 = **−7** (actual ≈ −10 ✓ strongest common oxoacid). Each extra non-OH oxygen increases Ka by ~10⁵.`
  ),

  card('ISTR-054', TOPICS.OXOACID, 'medium',
    `Deduce the oxidation state of P in $\\ce{H3PO2}$, $\\ce{H3PO3}$, $\\ce{H4P2O7}$ directly from their molecular formulas using oxidation state arithmetic.`,
    `$\\ce{H3PO2}$: 3(+1) + P + 2(−2) = 0 → **P = +1**. $\\ce{H3PO3}$: 3(+1) + P + 3(−2) = 0 → **P = +3**. $\\ce{H4P2O7}$: 4(+1) + 2P + 7(−2) = 0 → 2P = 10 → **P = +5**. Quick cross-check: the number of P–H bonds = (5 − OS)/2 for each formula.`
  ),

  card('ISTR-055', TOPICS.OXOACID, 'medium',
    `In the sulfur oxoacid series, why does adding each S=O group (non-OH oxygen) increase acid strength by approximately 10⁵ in Ka?`,
    `Each S=O group is strongly electron-withdrawing (electronegative O in a double bond). It pulls electron density away from S → S becomes more electrophilic → it in turn withdraws electron density from the O–H bonds → the O–H bond weakens and polarises → proton is more easily released. The inductive/resonance effect is amplified by the direct connection to the S centre bearing the O–H.`
  ),

  card('ISTR-056', TOPICS.OXOACID, 'hard',
    `$\\ce{H3PO3}$ reduces $\\ce{AgNO3}$ to precipitate Ag metal; $\\ce{H3PO4}$ does not. $\\ce{H2SO3}$ also reduces $\\ce{AgNO3}$. What structural property of $\\ce{H3PO3}$ drives reduction, and why is $\\ce{H2SO3}$'s mechanism different?`,
    `**$\\ce{H3PO3}$**: contains a P–H bond → P can be oxidised (P +3 → P +5 in $\\ce{H3PO4}$), donating electrons from the P–H bond to Ag⁺. **$\\ce{H2SO3}$**: no S–H bond; its reducing power comes from S being in the +4 state (not +6 maximum) → S can donate electrons directly (lone pair/oxidation to +6 in $\\ce{H2SO4}$). Two different structural origins: P–H bond vs low-oxidation-state lone pair.`
  ),

  // ── Topic 6: Comparative Structural Analysis ─────────────────────────────

  card('ISTR-057', TOPICS.COMPARE, 'medium',
    `Both $\\ce{CO2}$ and $\\ce{CS2}$ are linear and non-polar. Yet $\\ce{CS2}$ (BP 46°C) has a much higher boiling point than $\\ce{CO2}$ (sublimes −78.5°C). No dipole-dipole forces are present. What causes the difference?`,
    `Both rely solely on London dispersion (van der Waals) forces. $\\ce{CS2}$ has a larger, more polarisable electron cloud (S has more electrons and larger radius than O) → stronger dispersion interactions → higher BP. Molecular weight ($\\ce{CS2}$ = 76 vs $\\ce{CO2}$ = 44) reinforces this: more electrons = more London force. No dipole or H-bond contribution in either.`
  ),

  card('ISTR-058', TOPICS.COMPARE, 'medium',
    `Why does N exist as $\\ce{N2}$ (triple bond) while P exists as $\\ce{P4}$ (single P–P bonds), even though $\\ce{P4}$ has more bonds in total?`,
    `N≡N triple bond energy ≈ 945 kJ/mol; three N–N single bonds would give only 3×163 = 489 kJ/mol → triple bond is much more stable for N. P≡P triple bond ≈ 490 kJ/mol; three P–P single bonds give 3×201 = 603 kJ/mol → **three P–P single bonds are more stable than one P≡P triple bond**. Root cause: 2p–2p π overlap in N₂ is excellent (small atoms, compact orbitals); 3p–3p π overlap in P is poor (diffuse orbitals, poor sideways overlap).`
  ),

  card('ISTR-059', TOPICS.COMPARE, 'hard',
    `$\\ce{BeCl2}$ in the gas phase is linear (sp), but solid $\\ce{BeCl2}$ is polymeric. What bonds form the bridges in the polymeric/dimeric structure?`,
    `Cl lone pairs form **coordinate (dative) bonds** to the electron-deficient Be (Be has an empty orbital in the monomer). Each bridging Cl donates a lone pair → Be becomes sp³ (tetrahedral). This is analogous to the 3c-2e bridges in $\\ce{B2H6}$, except here Cl acts as the donor. The dimerisation satisfies Be's need to complete its valence shell.`
  ),

  card('ISTR-060', TOPICS.COMPARE, 'hard',
    `Arrange $\\ce{N2O}$, $\\ce{NO}$, $\\ce{NO2}$ in order of N–O bond order (lowest to highest) and give the bond order of each.`,
    `**$\\ce{NO2}$**: 2 equivalent N–O bonds via resonance → bond order **1.5**. **$\\ce{N2O}$** (linear, N–N=O): the N–O bond order ≈ **2** (one N–O double bond in the dominant resonance structure N=N=O). **$\\ce{NO}$**: MO theory gives bond order = (8−3)/2 = **2.5** (one unpaired electron in an antibonding π* MO). Order: $\\ce{NO2}$ (1.5) < $\\ce{N2O}$ (2) < $\\ce{NO}$ (2.5).`
  ),

  card('ISTR-061', TOPICS.COMPARE, 'easy',
    `$\\ce{H2O}$ is liquid at 25°C while $\\ce{H2S}$ is a gas. Give two structural reasons.`,
    `(1) **H-bonding**: O–H...O hydrogen bonds in $\\ce{H2O}$ form a 3D network (2 donor H + 2 acceptor lone pairs per molecule) → high BP (100°C). $\\ce{H2S}$ has negligible H-bonding → BP −60°C. (2) **Bond strength**: O–H bond (~459 kJ/mol) is far stronger than S–H (~363 kJ/mol) → $\\ce{H2O}$ is thermally more stable. Both intermolecular forces and bond energy favour $\\ce{H2O}$ as a liquid.`
  ),

  card('ISTR-062', TOPICS.COMPARE, 'hard',
    `The Lewis acid strength order of boron trihalides is $\\ce{BI3 > BBr3 > BCl3 > BF3}$ — opposite to the electronegativity order. Explain using back-bonding.`,
    `All BX₃ are sp² with an empty B 2p orbital (Lewis acid site). **Back-bonding**: X lone pairs can donate into the empty B 2p orbital → partial B=X double bond → partially satisfies B's Lewis acidity. 2p-2p overlap (F: small, perfect match) > 3p-2p (Cl) > 4p-2p (Br) > 5p-2p (I) in effectiveness. Thus $\\ce{BF3}$ has the most back-bonding (most self-satisfied) → weakest Lewis acid; $\\ce{BI3}$ has almost no back-bonding → strongest Lewis acid.`
  ),

  card('ISTR-063', TOPICS.COMPARE, 'hard',
    `HF is a stronger bond than HI (570 vs 297 kJ/mol), yet $\\ce{HI}$ is a stronger acid. Explain using the thermodynamic cycle for acid dissociation in water.`,
    `Three contributions to acid strength: (1) **bond dissociation energy** (BDE) — opposes ionisation; (2) **electron affinity of X** — favours X⁻ formation; (3) **hydration energy of X⁻** — favours dissolution. For HF: large BDE (570 kJ/mol) dominates — hard to dissociate → weak acid. For HI: very small BDE (297 kJ/mol) — easy to dissociate → strong acid. Although I⁻ hydration energy is lower than F⁻, the BDE difference is overwhelmingly decisive.`
  ),

  card('ISTR-064', TOPICS.COMPARE, 'medium',
    `$\\ce{SO2}$ is a gas at room temperature ($\\text{BP} = -10°\\text{C}$) while $\\ce{SO3}$ is a liquid ($\\text{BP} = 45°\\text{C}$). Both are small molecules. Explain.`,
    `$\\ce{SO2}$ is a polar bent molecule (net dipole). $\\ce{SO3}$ is trigonal planar and **non-polar** (dipoles cancel). Yet $\\ce{SO3}$ has a higher BP because it oligomerises: solid $\\ce{SO3}$ exists as cyclic trimers or polymeric chains (γ-form) linked by S–O–S bridges, dramatically increasing the effective molecular weight. Liquid $\\ce{SO3}$ is primarily $\\alpha/\\beta$-forms (trimeric). This association raises BP far above what the monomer's polarity would predict.`
  ),

  card('ISTR-065', TOPICS.COMPARE, 'medium',
    `$\\ce{NaCl}$ adopts a 6:6 rock-salt structure and $\\ce{CsCl}$ adopts an 8:8 structure. Using radius ratio rules, justify both, given $r(\\text{Na}^+) = 116$ pm, $r(\\text{Cs}^+) = 174$ pm, $r(\\text{Cl}^-) = 181$ pm.`,
    `Radius ratio = $r^+/r^-$. NaCl: 116/181 = **0.64** → range 0.414–0.732 → predicts **6:6 octahedral** (rock salt) ✓. CsCl: 174/181 = **0.96** → > 0.732 → predicts **8:8 cubic** (CsCl structure) ✓. Larger Cs⁺ can accommodate 8 Cl⁻ neighbours; smaller Na⁺ can only fit 6.`
  ),

  card('ISTR-066', TOPICS.COMPARE, 'easy',
    `Comparing isoelectronic species: $\\ce{CO2}$ and $\\ce{N2O}$ are both linear and have the same number of electrons. Why is $\\ce{N2O}$ a greenhouse gas while $\\ce{CO2}$ is better known as one? (Structural hint: symmetry and IR activity.)`,
    `$\\ce{CO2}$ (D∞h): symmetric linear molecule. Its symmetric stretch is IR-inactive (no change in dipole). The asymmetric stretch and bending modes are IR-active → absorbs in the IR → greenhouse effect. $\\ce{N2O}$ (C∞v): **asymmetric** linear molecule (N–N–O, the two ends differ) → even the "symmetric" stretch changes dipole → more IR modes are active → $\\ce{N2O}$ is actually ~300× more potent per molecule as a greenhouse gas than $\\ce{CO2}$.`
  ),

  // ── Topic 7: Coordination & Crystal Geometry ─────────────────────────────

  card('ISTR-067', TOPICS.CRYSTAL, 'easy',
    `$\\ce{[Pt(NH3)2Cl2]}$ is square planar with 2 geometrical isomers. Which isomer has anticancer activity, and what structural feature enables it to crosslink DNA?`,
    `**cis-platin** (cis isomer) is the anticancer agent. Its 2 Cl⁻ leaving groups are on the **same side** (adjacent positions, ~90° apart). When Cl⁻ is displaced by N atoms on adjacent guanine bases of a DNA strand, the 2 Pt–N bonds form a crosslink at the right distance (2.9 Å) to distort the double helix → inhibits DNA replication. The trans isomer (Cl 180° apart) places the binding sites too far apart to crosslink adjacent DNA bases.`
  ),

  card('ISTR-068', TOPICS.CRYSTAL, 'medium',
    `How many total stereoisomers does octahedral $\\ce{[Co(en)2Cl2]^+}$ have? Which are optically active?`,
    `**3 stereoisomers**: (1) trans-$\\ce{[Co(en)2Cl2]^+}$: Cl atoms trans to each other; has a C₂ axis and planes of symmetry → **not optically active**. (2) cis-Δ (left-hand propeller). (3) cis-Λ (right-hand propeller). The cis pair are non-superimposable mirror images → **optically active** (chiral). Total: 1 trans (achiral) + 2 cis enantiomers.`
  ),

  card('ISTR-069', TOPICS.CRYSTAL, 'hard',
    `Calculate the CFSE (in Δₒ units) for a d⁶ metal ion in an octahedral field for both high-spin and low-spin configurations. Ignore pairing energy.`,
    `In octahedral fields: t₂g set is −0.4Δₒ per electron, eₘ set is +0.6Δₒ per electron. **High-spin d⁶** (t₂g⁴ eₘ²): 4(−0.4) + 2(+0.6) = −1.6 + 1.2 = **−0.4Δₒ**. **Low-spin d⁶** (t₂g⁶ eₘ⁰): 6(−0.4) = **−2.4Δₒ** (stronger stabilisation, but actual net CFSE requires subtracting extra pairing energy cost of forcing 6 electrons into t₂g).`
  ),

  card('ISTR-070', TOPICS.CRYSTAL, 'medium',
    `Verify the formula NaCl by counting $\\ce{Na+}$ and $\\ce{Cl-}$ ions per unit cell. ($\\ce{Cl-}$ at corners and face-centres; $\\ce{Na+}$ at edge-centres and body-centre.)`,
    `**$\\ce{Cl-}$**: 8 corners × (1/8) + 6 face-centres × (1/2) = 1 + 3 = **4 Cl⁻** per unit cell. **$\\ce{Na+}$**: 12 edge-centres × (1/4) + 1 body-centre × 1 = 3 + 1 = **4 Na⁺** per unit cell. Ratio Na⁺:Cl⁻ = 4:4 = 1:1 → formula NaCl ✓.`
  ),

  card('ISTR-071', TOPICS.CRYSTAL, 'hard',
    `Zinc blende (cubic ZnS) and wurtzite (hexagonal ZnS) both have 4:4 coordination. What is the only structural difference between the two polymorphs?`,
    `In both, Zn²⁺ occupies half the tetrahedral voids of a close-packed S²⁻ lattice. **Zinc blende**: S²⁻ in **cubic close packing** (ABCABC stacking, FCC). **Wurtzite**: S²⁻ in **hexagonal close packing** (ABAB stacking). The Zn²⁺ coordination geometry is tetrahedral in both. The only difference is the stacking sequence of S²⁻ layers — same local bonding, different long-range crystal packing.`
  ),

  card('ISTR-072', TOPICS.CRYSTAL, 'hard',
    `$\\ce{Li2O}$ has the antifluorite structure (reverse of $\\ce{CaF2}$). In $\\ce{CaF2}$: Ca²⁺ is at FCC sites (CN 8), F⁻ fills all tetrahedral voids (CN 4). What are the coordination numbers of $\\ce{Li+}$ and $\\ce{O^{2-}}$ in $\\ce{Li2O}$? Verify the formula.`,
    `In antifluorite, anion/cation roles swap: **O²⁻ at FCC sites** (CN = **8**, surrounded by 8 Li⁺). **Li⁺ fills all tetrahedral voids** (CN = **4**, each Li⁺ surrounded by 4 O²⁻). Verification: FCC gives 4 O²⁻ per cell; 8 tetrahedral voids per FCC cell → 8 Li⁺ per cell. Li:O = 8:4 = 2:1 → $\\ce{Li2O}$ ✓.`
  ),

  card('ISTR-073', TOPICS.CRYSTAL, 'medium',
    `Using the radius ratio rule, predict the crystal structure of MgO. Given $r(\\ce{Mg^{2+}}) = 72$ pm, $r(\\ce{O^{2-}}) = 140$ pm.`,
    `Radius ratio = 72/140 = **0.514**. Range 0.414–0.732 predicts **6:6 octahedral coordination** (rock-salt / NaCl-type structure). MgO does indeed adopt the rock-salt structure experimentally — each Mg²⁺ is surrounded by 6 O²⁻ and vice versa.`
  ),

  card('ISTR-074', TOPICS.CRYSTAL, 'medium',
    `Adding $\\ce{CdCl2}$ to $\\ce{NaCl}$ creates a cation vacancy. What type of defect is this, how many vacancies does each $\\ce{Cd^{2+}}$ create, and what is the effect on conductivity?`,
    `This is an **impurity-induced vacancy (Schottky-type) defect**. Each Cd²⁺ replacing Na⁺ introduces an extra +1 charge, so **one additional Na⁺ vacancy is created per Cd²⁺** to maintain electrical neutrality (net 0: +2 from Cd²⁺, −1 from removing 1 Na⁺ site → −1 vacancy). The vacancies enable easier ion migration under an electric field → **increased electrical conductivity**; density decreases.`
  ),

  card('ISTR-075', TOPICS.CRYSTAL, 'hard',
    `Crystal field splitting in a tetrahedral complex (Δₜ) = (4/9)Δₒ for the same metal–ligand combination. Give the geometric reason.`,
    `In octahedral fields, all 6 ligands approach along bond axes and point directly at the eₘ (dₓ²₋ᵧ², d_z²) orbitals → strong, direct repulsion → large Δₒ. In tetrahedral fields, 4 ligands approach via face diagonals — none points directly at any d orbital. The t₂ (dxy, dyz, dxz) set is most destabilised, but the repulsions are indirect, weaker, and fewer ligands are present. Result: Δₜ ≈ (4/9)Δₒ. Since Δₜ < pairing energy P for almost all metals, tetrahedral complexes are nearly always **high-spin**.`
  ),

  card('ISTR-076', TOPICS.CRYSTAL, 'hard',
    `Octahedral $\\ce{[Co(NH3)3Cl3]}$ has fac and mer isomers. Which has a higher dipole moment, and why?`,
    `**fac** (facial) has a higher dipole moment. In fac: all 3 $\\ce{NH3}$ are on one face (mutual 90°), all 3 Cl on the opposite face — the molecule has a net dipole from the asymmetric distribution (all similar groups on one side). The fac isomer has C₃ᵥ symmetry, with a non-zero dipole along the C₃ axis. The **mer** isomer has a plane of symmetry through the mer plane (C₂ᵥ), partially cancelling the dipoles — lower net dipole moment.`
  ),

];

// ─── Run ──────────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  // Check for existing chapter
  const existing = await coll.countDocuments({ 'chapter.id': CHAPTER.id, deleted_at: null });
  if (existing > 0) {
    console.log(`⚠️  Chapter already has ${existing} cards. Aborting to prevent duplicates.`);
    await mongoose.disconnect();
    return;
  }

  // Print summary
  const byTopic = {};
  for (const c of CARDS) {
    const t = c.topic.name;
    byTopic[t] = (byTopic[t] ?? 0) + 1;
  }
  console.log(`\nPrepared ${CARDS.length} cards for: ${CHAPTER.name}`);
  for (const [t, n] of Object.entries(byTopic)) console.log(`  · ${t}  (${n})`);

  if (APPLY) {
    const result = await coll.insertMany(CARDS, { ordered: false });
    console.log(`\n✅ Inserted ${result.insertedCount} cards.`);
  } else {
    console.log('\n(dry run — pass --apply to insert)');
  }

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
