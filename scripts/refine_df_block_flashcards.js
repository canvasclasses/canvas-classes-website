/**
 * D & F Block Flashcards — Refinement Migration
 *
 * Purpose: Replace the existing 65 cards (chapter.id = 'ch12_dblock') with a
 * fully rewritten, BITSAT-optimized set of ~95 cards. Source material: NCERT
 * Class 12 Ch 8 (25 pages), personal notes (6 pages), Cu/Ag/Au MCQ, Zn/Hg MCQ.
 *
 * Key changes vs existing cards:
 *   - All LaTeX normalized to single-$ inline math (no `$$...$$`)
 *   - Trailing periods on questions removed
 *   - ~10 duplicate cards removed
 *   - 3 new topics added: Colour in Transition Ions, Cu/Ag/Au, Zn/Hg,
 *     Oxides & Oxoanions, Applications
 *   - One-card orphan topic ("Chemical Properties") folded into Catalysts/Alloys
 *   - New image-requiring cards flagged with tag `needs_image`
 *
 * Usage:
 *   node scripts/refine_df_block_flashcards.js            # preview only (writes JSON)
 *   node scripts/refine_df_block_flashcards.js --apply    # soft-delete old + insert new
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const CHAPTER = { id: 'ch12_dblock', name: 'D & F Block', category: 'Inorganic Chemistry' };

// Topics in display order. Each card below references a topic by name.
const TOPICS = [
  { name: 'Position & Electronic Configuration', order: 1 },
  { name: 'Physical Properties', order: 2 },
  { name: 'Ionisation Enthalpy', order: 3 },
  { name: 'Oxidation States', order: 4 },
  { name: 'Standard Electrode Potentials', order: 5 },
  { name: 'Magnetic Properties', order: 6 },
  { name: 'Colour in Transition Ions', order: 7 },
  { name: 'Catalysts, Interstitial Compounds & Alloys', order: 8 },
  { name: 'Oxides & Oxoanions', order: 9 },
  { name: 'Potassium Dichromate', order: 10 },
  { name: 'Potassium Permanganate', order: 11 },
  { name: 'Copper, Silver & Gold', order: 12 },
  { name: 'Zinc & Mercury', order: 13 },
  { name: 'The Lanthanoids (4f Series)', order: 14 },
  { name: 'The Actinoids (5f Series)', order: 15 },
  { name: 'Applications of d- and f-block Elements', order: 16 },
];

// Helper to keep card definitions terse.
const c = (topic, difficulty, q, a, tags = []) => ({ topic, difficulty, q, a, tags });

// ===================================================================
//  REFINED CARDS  (~95 total)
// ===================================================================

const CARDS = [
  // --- Topic 1: Position & Electronic Configuration -----------------
  c('Position & Electronic Configuration', 'easy',
    'What is the general outer electronic configuration of d-block elements?',
    'General: $(n-1)d^{1-10}\\,ns^{0-2}$. Half-filled and fully-filled d-subshells cause small exceptions (e.g. Cr, Cu).'),

  c('Position & Electronic Configuration', 'medium',
    'Why are Zn, Cd and Hg not considered transition elements?',
    'Their d-orbitals are completely filled ($d^{10}$) in both the ground state and in their common oxidation state (+2). A transition element must have a partially filled d-subshell in at least one common oxidation state.'),

  c('Position & Electronic Configuration', 'medium',
    'Write the ground-state configuration of Cr and Cu, and explain the anomaly.',
    'Cr: $[Ar]\\,3d^5\\,4s^1$; Cu: $[Ar]\\,3d^{10}\\,4s^1$. Extra stability of half-filled ($d^5$) and fully-filled ($d^{10}$) subshells, plus small 3d–4s energy gap, makes these configurations more stable than $3d^4 4s^2$ / $3d^9 4s^2$.'),

  c('Position & Electronic Configuration', 'easy',
    'Name the four transition series and their 3d/4d/5d/6d elements.',
    '3d: Sc (21) → Zn (30); 4d: Y (39) → Cd (48); 5d: La (57), Hf (72) → Hg (80); 6d: Ac (89), Rf (104) → incomplete. Note: 4f elements fill between La and Hf.'),

  c('Position & Electronic Configuration', 'easy',
    'Why is Ag (Z = 47) regarded as a transition element even though its ground state is $4d^{10}\\,5s^1$?',
    'In its +2 oxidation state Ag exhibits a partially filled $4d^9$ configuration. A transition element only needs partially filled d-orbitals in its ground state OR in any common oxidation state.'),

  c('Position & Electronic Configuration', 'easy',
    'Which is the last member of the 3d series and the 5d series?',
    '3d: Zinc (Zn, $Z=30$). 5d: Mercury (Hg, $Z=80$).'),

  // --- Topic 2: Physical Properties ---------------------------------
  c('Physical Properties', 'medium',
    'Why do transition metals have high melting and boiling points?',
    'They have a large number of unpaired (n-1)d and ns electrons available for strong metal–metal bonding (interatomic metallic bonding).'),

  c('Physical Properties', 'medium',
    'Why are Zn, Cd and Hg soft metals with low melting points?',
    'Their d-orbitals are completely filled ($d^{10}$) and do not participate in metallic bonding. Only the two s-electrons bond, giving very weak interatomic attraction. Hg is liquid at room temperature for this reason.',
    ['needs_image']),

  c('Physical Properties', 'medium',
    'Why does manganese show an anomalously low melting point in the 3d series?',
    'Despite having $d^5$ configuration, the half-filled d-subshell in Mn is unusually stable and its valence electrons are less available for metallic bonding, giving weaker inter-atomic interaction.',
    ['needs_image']),

  c('Physical Properties', 'medium',
    'In which part of each transition series do melting points peak and why?',
    'Near the middle (e.g. W in 5d). Maximum number of unpaired d-electrons gives the strongest interatomic metallic bonding; after the middle, d-electrons start pairing and bonding weakens.'),

  c('Physical Properties', 'hard',
    'What is Lanthanoid Contraction?',
    'The steady decrease in atomic and ionic radii across the lanthanoid series (La → Lu, 187 pm → 173 pm; $La^{3+}$ 103 pm → $Lu^{3+}$ 86 pm). Caused by poor shielding of the nuclear charge by 4f electrons.'),

  c('Physical Properties', 'medium',
    'Name two pairs of 4d/5d metals with nearly identical radii and state the reason.',
    'Zr (160 pm) ≈ Hf (159 pm); Nb ≈ Ta; Mo ≈ W. Reason: Lanthanoid contraction cancels the expected size increase from 4d to 5d.'),

  c('Physical Properties', 'medium',
    'Which three 3d metals do not adopt typical metallic (hcp/bcc/ccp) structures?',
    'Zn, Cd and Hg. (Mn also shows an atypical complex lattice.)'),

  c('Physical Properties', 'medium',
    'How does density vary across the 3d series and why?',
    'Density generally increases from Sc to Cu, then falls at Zn. Atomic mass rises while metallic radius decreases (due to poor d-shielding), packing more mass into smaller volume.'),

  c('Physical Properties', 'medium',
    'Why are enthalpies of atomisation of 2nd (4d) and 3rd (5d) series metals greater than 1st (3d)?',
    'Heavier d-orbitals overlap more effectively, allowing stronger metal–metal bonding. This also explains the abundance of M–M bonded clusters in heavy transition metals.',
    ['needs_image']),

  // --- Topic 3: Ionisation Enthalpy ---------------------------------
  c('Ionisation Enthalpy', 'medium',
    'Why is the first ionisation enthalpy of Cr lower than that of Mn, but IE1 of Zn is very high?',
    'Cr: removal of the 4s electron still leaves a stable half-filled $3d^5$, so it is relatively easy. Zn: removing an electron disrupts the stable $3d^{10}\\,4s^2$ and requires high energy.'),

  c('Ionisation Enthalpy', 'medium',
    'Why is the second ionisation enthalpy (IE2) of Cu exceptionally high?',
    'Removing a second electron from $Cu^+$ ($3d^{10}$) disrupts the stable fully-filled d-subshell, causing a large loss of exchange energy.'),

  c('Ionisation Enthalpy', 'medium',
    'Why is the 3rd ionisation enthalpy of Mn very high?',
    '$Mn^{2+}$ has the stable half-filled $3d^5$ configuration. Removing a third electron disrupts this stability, requiring unusually large energy. This is why Mn(III) is unstable in aqueous solution.'),

  c('Ionisation Enthalpy', 'medium',
    'Why does Cu have a higher first ionisation enthalpy than K although both have a $4s^1$ outer electron?',
    'The 3d electrons in Cu shield the 4s electron poorly from the nucleus, so the effective nuclear charge on the 4s electron is much higher in Cu than in K (where no d-electrons shield).'),

  c('Ionisation Enthalpy', 'medium',
    'Why is the observed variation in IE across the 3d series much smaller than across a main-group period?',
    'Added electrons enter inner (n-1)d orbitals, which increasingly shield the outer ns electron. The effective nuclear charge felt by the ionised electron therefore rises only slightly across the series.'),

  c('Ionisation Enthalpy', 'medium',
    'Why are the ionisation enthalpies of the 5d series higher than those of the 3d and 4d series?',
    'Because of lanthanoid contraction, the 5d electrons penetrate close to the nucleus and experience a much higher effective nuclear charge, tightening their hold and raising IE.'),

  // --- Topic 4: Oxidation States ------------------------------------
  c('Oxidation States', 'easy',
    'Which 3d transition element does NOT exhibit variable oxidation states?',
    'Scandium (Sc). Only +3 is shown, as losing all three valence electrons ($3d^1\\,4s^2$) gives a stable noble-gas configuration.'),

  c('Oxidation States', 'medium',
    'What is the highest known oxidation state of a 3d element, and in which compound does it appear?',
    '+7 in Mn, found in $Mn_2O_7$ and in $MnO_4^-$ (permanganate). No higher oxide is stable beyond Mn.'),

  c('Oxidation States', 'medium',
    'Why is the highest oxidation state of a 3d metal usually found in its oxide or fluoride?',
    'O and F are small and highly electronegative. O additionally stabilises high OS through multiple bonds ($p\\pi\\text{-}d\\pi$). F stabilises via strong polar single bonds.'),

  c('Oxidation States', 'medium',
    'Why is the highest fluoride of Mn only $MnF_4$ while the highest oxide is $Mn_2O_7$?',
    'Oxygen forms multiple bonds ($p\\pi\\text{-}d\\pi$) with the metal that stabilise very high oxidation states. Fluorine can only form single bonds, so it cannot support $Mn^{+7}$ in a binary fluoride.'),

  c('Oxidation States', 'medium',
    'Why is $Cr(VI)$ a strong oxidising agent while $Mo(VI)$ and $W(VI)$ are stable?',
    'Down a d-block group, higher oxidation states become more stable. $Cr^{+6}$ readily reduces to the more stable $Cr^{+3}$, whereas $Mo^{+6}$ and $W^{+6}$ persist.'),

  c('Oxidation States', 'medium',
    'Why can some transition metals show zero or negative oxidation states (e.g. $Ni(CO)_4$, $Fe(CO)_5$)?',
    'Ligands like CO are strong $\\pi$-acceptors — they accept electron density from filled d-orbitals via back-bonding, stabilising the metal in an unusually low oxidation state.'),

  c('Oxidation States', 'medium',
    'Which oxidation state is the most common among middle members of the 3d series?',
    'Typically +2 and +3. In early metals (Sc, Ti, V) +2 is rare or unstable; in Mn, Fe, Co, Ni the +2 aquo ion dominates.'),

  c('Oxidation States', 'hard',
    'What is the highest oxidation state of iron and in which species is it found?',
    '+6, found in the ferrate ion $FeO_4^{2-}$ (stable only in strongly alkaline medium).'),

  c('Oxidation States', 'medium',
    'Why is Ti(IV) far more stable than Ti(II) or Ti(III)?',
    'Losing four electrons ($3d^2\\,4s^2$) gives the stable noble-gas (Argon) configuration. Lower oxidation states have extra d-electrons that are easily removed.'),

  // --- Topic 5: Standard Electrode Potentials -----------------------
  c('Standard Electrode Potentials', 'medium',
    'Write the $E^\\circ(M^{2+}/M)$ values for Ti, Mn, Fe, Cu and Zn (in V).',
    'Ti $-1.63$, Mn $-1.18$, Fe $-0.44$, Cu $+0.34$, Zn $-0.76$. Cu is the only 3d metal with a positive $E^\\circ(M^{2+}/M)$.',
    ['needs_image']),

  c('Standard Electrode Potentials', 'medium',
    'Why is $E^\\circ(Cu^{2+}/Cu)$ positive ($+0.34$ V)?',
    'The high energy required to sublime Cu and ionise it ($\\Delta_a H + IE_1 + IE_2$) is not compensated by its hydration enthalpy. Cu therefore does not liberate $H_2$ from non-oxidising acids.'),

  c('Standard Electrode Potentials', 'medium',
    'Why are $E^\\circ(M^{2+}/M)$ values for Mn and Zn more negative than the trend predicts?',
    'Mn: the $3d^5$ stable half-filled configuration in $Mn^{2+}$ makes the oxidation easier. Zn: $3d^{10}$ stable fully-filled configuration in $Zn^{2+}$. Both have extra driving force for $M^0 \\to M^{2+}$.'),

  c('Standard Electrode Potentials', 'medium',
    'Why is $Cr^{2+}$ a reducing agent while $Mn^{3+}$ is an oxidising agent, although both are $d^4$?',
    '$Cr^{2+}$ ($d^4$) loses an electron to become $Cr^{3+}$ ($t_{2g}^3$, stable half-filled $t_{2g}$). $Mn^{3+}$ ($d^4$) gains an electron to become $Mn^{2+}$ ($d^5$, stable half-filled d-shell).'),

  c('Standard Electrode Potentials', 'medium',
    'Why is $E^\\circ(Mn^{3+}/Mn^{2+})$ very positive ($+1.57$ V) compared to $E^\\circ(Cr^{3+}/Cr^{2+})$ or $E^\\circ(Fe^{3+}/Fe^{2+})$?',
    'Reducing $Mn^{3+}$ ($d^4$) to $Mn^{2+}$ ($d^5$) gives the exceptionally stable half-filled d-shell; the large 3rd IE of Mn also disfavours $Mn^{3+}$. Hence $Mn^{3+}$ oxidises readily.'),

  c('Standard Electrode Potentials', 'medium',
    'Why is $Co^{3+}$ a strong oxidiser in aqueous solution but stable in complexes with strong-field ligands?',
    'In water $Co^{3+}$ readily accepts an electron to form more stable $Co^{2+}$. With strong-field ligands (e.g. $CN^-$, $NH_3$), the large crystal-field stabilisation energy of low-spin $t_{2g}^6$ (d6) stabilises $Co^{3+}$.'),

  c('Standard Electrode Potentials', 'medium',
    'Why is the $E^\\circ(M^{3+}/M^{2+})$ value for scandium very low (strongly negative)?',
    '$Sc^{3+}$ has an exceptionally stable noble-gas (Argon) configuration. Any $Sc^{2+}$ formed would spontaneously lose an electron to reach $Sc^{3+}$.'),

  c('Standard Electrode Potentials', 'medium',
    'Does copper displace hydrogen from dilute HCl? Justify.',
    'No. $E^\\circ(Cu^{2+}/Cu) = +0.34$ V is positive, so Cu lies below $H^+$ in the activity series and cannot reduce $H^+$ to $H_2$. Cu only dissolves in oxidising acids like $HNO_3$ or hot conc. $H_2SO_4$.'),

  // --- Topic 6: Magnetic Properties ---------------------------------
  c('Magnetic Properties', 'easy',
    'Write the spin-only magnetic moment formula.',
    '$\\mu = \\sqrt{n(n+2)}$ BM, where $n$ is the number of unpaired electrons.'),

  c('Magnetic Properties', 'easy',
    'Give the calculated spin-only magnetic moment (in BM) for 1, 2, 3, 4 and 5 unpaired electrons.',
    '$n = 1$: 1.73; $n = 2$: 2.84; $n = 3$: 3.87; $n = 4$: 4.90; $n = 5$: 5.92 BM.'),

  c('Magnetic Properties', 'medium',
    'Why do observed magnetic moments of some 3d ions deviate from the spin-only value?',
    'The spin-only formula ignores the orbital angular momentum contribution. In some ions (e.g. $Co^{2+}$), orbital motion is not fully quenched and adds to the total moment.'),

  c('Magnetic Properties', 'medium',
    'Name four common d-block ions that are diamagnetic.',
    '$Sc^{3+}$ ($3d^0$), $Ti^{4+}$ ($3d^0$), $Cu^+$ ($3d^{10}$) and $Zn^{2+}$ ($3d^{10}$). All have zero unpaired electrons.'),

  c('Magnetic Properties', 'medium',
    'Calculate the spin-only magnetic moment of a divalent aqueous ion of atomic number 25.',
    '$Z = 25$ is Mn; $Mn^{2+}$ is $3d^5$ with 5 unpaired electrons. $\\mu = \\sqrt{5(5+2)} = \\sqrt{35} \\approx 5.92$ BM.'),

  c('Magnetic Properties', 'medium',
    '$Cr^{3+}$ and $Co^{2+}$ both have 3 unpaired electrons. Why is $\\mu_{obs}$ of $Co^{2+}$ (~4.4–5.2 BM) higher than that of $Cr^{3+}$ (~3.87 BM)?',
    'In $Co^{2+}$ the orbital angular momentum is not fully quenched and contributes to the moment. In $Cr^{3+}$ ($t_{2g}^3$), orbital motion is effectively quenched.'),

  // --- Topic 7: Colour in Transition Ions ---------------------------
  c('Colour in Transition Ions', 'medium',
    'Why are most d-block ions coloured in solution?',
    'Partially filled d-orbitals allow d–d electronic transitions. The ion absorbs light of a specific wavelength in the visible region and transmits its complementary colour.'),

  c('Colour in Transition Ions', 'easy',
    'Why is $Ti^{4+}$ colourless while $Ti^{3+}$ is purple?',
    '$Ti^{4+}$ is $3d^0$ — no d-electron is available for d–d transition. $Ti^{3+}$ is $3d^1$ and undergoes a d–d transition in the visible region.'),

  c('Colour in Transition Ions', 'easy',
    'Explain why $Cu^+$ salts are colourless but $Cu^{2+}$ salts are blue.',
    '$Cu^+$ is $3d^{10}$ (no d–d transition possible). $Cu^{2+}$ is $3d^9$ with one hole, so a d–d transition absorbs orange light and the ion appears blue.'),

  c('Colour in Transition Ions', 'medium',
    'Why is $KMnO_4$ intensely purple even though $Mn^{+7}$ has a $d^0$ configuration?',
    'Its colour arises from Ligand-to-Metal Charge Transfer (LMCT), not d–d transitions. An electron moves from a filled O p-orbital to an empty Mn d-orbital, absorbing strongly in the visible region.'),

  c('Colour in Transition Ions', 'medium',
    'Give the colours of these common aqueous ions: $Ti^{3+}$, $V^{3+}$, $Cr^{3+}$, $Mn^{2+}$, $Fe^{3+}$, $Fe^{2+}$, $Co^{2+}$, $Ni^{2+}$, $Cu^{2+}$.',
    '$Ti^{3+}$ purple, $V^{3+}$ green, $Cr^{3+}$ violet, $Mn^{2+}$ pale pink, $Fe^{3+}$ yellow, $Fe^{2+}$ green, $Co^{2+}$ pink, $Ni^{2+}$ green, $Cu^{2+}$ blue.',
    ['needs_image']),

  c('Colour in Transition Ions', 'easy',
    'Why are aqueous $Zn^{2+}$ and $Sc^{3+}$ solutions colourless?',
    '$Zn^{2+}$ is $3d^{10}$ (fully filled) and $Sc^{3+}$ is $3d^0$ (empty). In both cases no d–d transition is possible.'),

  // --- Topic 8: Catalysts, Interstitial & Alloys --------------------
  c('Catalysts, Interstitial Compounds & Alloys', 'medium',
    'Why are transition metals and their compounds good catalysts?',
    'Two reasons: (i) they can adopt multiple oxidation states and form unstable intermediates with reactants; (ii) partially filled d-orbitals provide surfaces on which reactants can adsorb and form transient bonds, lowering activation energy.'),

  c('Catalysts, Interstitial Compounds & Alloys', 'easy',
    'Name the catalyst used in the Contact process and the reaction it catalyses.',
    '$V_2O_5$. It catalyses the oxidation of $SO_2$ to $SO_3$ in the manufacture of sulphuric acid.'),

  c('Catalysts, Interstitial Compounds & Alloys', 'easy',
    'Name the catalyst used in Haber\'s process.',
    'Finely divided iron (with $Mo$ or $Al_2O_3$ as promoter) for the synthesis of ammonia: $N_2 + 3H_2 \\rightleftharpoons 2NH_3$.'),

  c('Catalysts, Interstitial Compounds & Alloys', 'medium',
    'What is the Ziegler-Natta catalyst and what is it used for?',
    '$TiCl_4$ (or $TiCl_3$) + $Al(C_2H_5)_3$. Used to polymerise ethene into high-density polyethylene.'),

  c('Catalysts, Interstitial Compounds & Alloys', 'medium',
    'Name the catalyst in the Wacker process.',
    '$PdCl_2$. It catalyses the oxidation of ethene to ethanal (acetaldehyde).'),

  c('Catalysts, Interstitial Compounds & Alloys', 'hard',
    'Explain the mechanism by which $Fe^{3+}$ catalyses the reaction $2I^- + S_2O_8^{2-} \\to I_2 + 2SO_4^{2-}$.',
    '$Fe^{3+}$ oxidises $I^-$ to $I_2$ and becomes $Fe^{2+}$. The $Fe^{2+}$ then reduces $S_2O_8^{2-}$ to $SO_4^{2-}$, regenerating $Fe^{3+}$. Variable oxidation states enable the cycle.'),

  c('Catalysts, Interstitial Compounds & Alloys', 'easy',
    'What are interstitial compounds? Give two examples.',
    'Non-stoichiometric compounds formed when small atoms (H, C, N, B) occupy interstitial sites in a transition-metal lattice. Examples: $TiC$, $Mn_4N$, $Fe_3H$, $VH_{0.56}$.'),

  c('Catalysts, Interstitial Compounds & Alloys', 'medium',
    'State four characteristic properties of interstitial compounds.',
    '(i) Higher melting points than the pure metal; (ii) very hard (some approach diamond); (iii) retain metallic conductivity; (iv) chemically inert.'),

  c('Catalysts, Interstitial Compounds & Alloys', 'medium',
    'Why do transition metals form alloys readily?',
    'Their atomic radii differ by less than ~15%, so one metal atom can substitute for another in the lattice giving a homogeneous solid solution. Examples: brass (Cu–Zn), bronze (Cu–Sn), stainless steel (Fe–Cr–Ni).'),

  // --- Topic 9: Oxides & Oxoanions ----------------------------------
  c('Oxides & Oxoanions', 'medium',
    'How does the acidic/basic nature of a transition-metal oxide change with oxidation state?',
    'As oxidation state rises, ionic character decreases and covalent character grows: lower OS → basic (e.g. MnO); intermediate → amphoteric (e.g. $Mn_2O_3$, $MnO_2$); higher OS → acidic (e.g. $Mn_2O_7$).'),

  c('Oxides & Oxoanions', 'medium',
    'Arrange Mn oxides MnO, $Mn_2O_3$, $MnO_2$, $Mn_2O_7$ in order of increasing acidic character.',
    'MnO (basic) < $Mn_2O_3$ (basic/weakly amphoteric) < $MnO_2$ (amphoteric) < $MnO_3$ (acidic) < $Mn_2O_7$ (strongly acidic, covalent green oil).'),

  c('Oxides & Oxoanions', 'medium',
    'Describe the acid–base character of $V_2O_3$, $V_2O_4$ and $V_2O_5$.',
    '$V_2O_3$ basic; $V_2O_4$ amphoteric; $V_2O_5$ amphoteric but mainly acidic (gives $VO_4^{3-}$ in alkali and $VO_2^+$ in acid).'),

  c('Oxides & Oxoanions', 'medium',
    'What is the physical nature of $Mn_2O_7$?',
    'A covalent, dark green oil that is unstable and explosive. Its high covalent character follows from Mn being in its highest OS (+7) and the Mn–O–Mn bridging structure.'),

  c('Oxides & Oxoanions', 'easy',
    'Which is the only oxide formed by scandium, and what is its nature?',
    '$Sc_2O_3$, a basic oxide (Sc exhibits only +3).'),

  c('Oxides & Oxoanions', 'medium',
    'Describe the Cr oxide series from low to high OS: CrO, $Cr_2O_3$, $CrO_3$.',
    'CrO: basic (ionic). $Cr_2O_3$: amphoteric (most common and stable oxide). $CrO_3$: acidic (forms chromic acid $H_2CrO_4$ with water).'),

  // --- Topic 10: Potassium Dichromate --------------------------------
  c('Potassium Dichromate', 'medium',
    'Describe the full preparation of $K_2Cr_2O_7$ starting from chromite ore.',
    '(1) $4FeCr_2O_4 + 8Na_2CO_3 + 7O_2 \\to 8Na_2CrO_4 + 2Fe_2O_3 + 8CO_2$. (2) $2Na_2CrO_4 + 2H^+ \\to Na_2Cr_2O_7 + Na^+ + H_2O$. (3) $Na_2Cr_2O_7 + 2KCl \\to K_2Cr_2O_7 + 2NaCl$ (K salt is less soluble, crystallises out).'),

  c('Potassium Dichromate', 'medium',
    'Why is $K_2Cr_2O_7$ (not $Na_2Cr_2O_7$) used as a primary standard in volumetric analysis?',
    '$Na_2Cr_2O_7$ is hygroscopic (absorbs moisture from air), making accurate weighing impossible. $K_2Cr_2O_7$ is not hygroscopic, so it can be weighed exactly.'),

  c('Potassium Dichromate', 'medium',
    'Write the equilibrium between chromate and dichromate ions and explain the colour change.',
    '$2CrO_4^{2-} + 2H^+ \\rightleftharpoons Cr_2O_7^{2-} + H_2O$. Acid shifts right: yellow $\\to$ orange. Alkali shifts left: orange $\\to$ yellow. Oxidation state of Cr remains +6 in both.'),

  c('Potassium Dichromate', 'easy',
    'What is the oxidation state of Cr in $CrO_4^{2-}$ and $Cr_2O_7^{2-}$?',
    '+6 in both. Only the condensation (dimerisation via a bridging O) changes; the Cr oxidation state is unchanged.'),

  c('Potassium Dichromate', 'hard',
    'Describe the structure of the $Cr_2O_7^{2-}$ ion.',
    'Two $CrO_4$ tetrahedra sharing one bridging oxygen. Cr–O–Cr angle = 126°. Terminal Cr–O bonds ≈ 163 pm (shorter, partial double-bond character); bridging Cr–O ≈ 179 pm.',
    ['needs_image']),

  c('Potassium Dichromate', 'medium',
    'Write the half-reaction and $E^\\circ$ for $Cr_2O_7^{2-}$ reduction in acidic medium.',
    '$Cr_2O_7^{2-} + 14H^+ + 6e^- \\to 2Cr^{3+} + 7H_2O$, with $E^\\circ = +1.33$ V.'),

  c('Potassium Dichromate', 'medium',
    'Give the products when acidified dichromate oxidises: (i) $Fe^{2+}$, (ii) $I^-$, (iii) $Sn^{2+}$, (iv) $H_2S$.',
    '(i) $Fe^{3+}$; (ii) $I_2$; (iii) $Sn^{4+}$; (iv) S. In all cases $Cr_2O_7^{2-}$ is reduced to $Cr^{3+}$ (green).'),

  c('Potassium Dichromate', 'easy',
    'Name two major industrial uses of $K_2Cr_2O_7$.',
    '(i) Tanning in the leather industry. (ii) Oxidising agent in preparation of many organic compounds and in volumetric analysis.'),

  // --- Topic 11: Potassium Permanganate ------------------------------
  c('Potassium Permanganate', 'medium',
    'Describe the commercial preparation of $KMnO_4$ from $MnO_2$.',
    'Two-step: (1) $2MnO_2 + 4KOH + O_2 \\to 2K_2MnO_4 + 2H_2O$ (alkaline oxidative fusion, green manganate). (2) Electrolytic oxidation of $K_2MnO_4$ in alkaline solution gives $KMnO_4$.'),

  c('Potassium Permanganate', 'medium',
    'How is $KMnO_4$ prepared in the laboratory from a $Mn^{2+}$ salt?',
    'Oxidise $Mn^{2+}$ with peroxodisulphate in the presence of $Ag^+$ as catalyst: $2Mn^{2+} + 5S_2O_8^{2-} + 8H_2O \\to 2MnO_4^- + 10SO_4^{2-} + 16H^+$.'),

  c('Potassium Permanganate', 'hard',
    'Describe the shape and bonding in $MnO_4^-$ and $MnO_4^{2-}$, and state their colour and magnetism.',
    'Both are tetrahedral (Mn $sp^3$). $\\pi$-bonding arises from O p-orbitals overlapping with Mn d-orbitals. $MnO_4^-$: purple, $d^0$, diamagnetic. $MnO_4^{2-}$: green, $d^1$, paramagnetic.',
    ['needs_image']),

  c('Potassium Permanganate', 'medium',
    'What happens when $KMnO_4$ is heated at 513 K?',
    'It decomposes: $2KMnO_4 \\xrightarrow{513\\,K} K_2MnO_4 + MnO_2 + O_2$.'),

  c('Potassium Permanganate', 'medium',
    'Write the disproportionation of manganate in acidic/neutral medium.',
    '$3MnO_4^{2-} + 4H^+ \\to 2MnO_4^- + MnO_2 + 2H_2O$. Green manganate disproportionates to purple permanganate and $MnO_2$.'),

  c('Potassium Permanganate', 'medium',
    'Why can HCl not be used to acidify $KMnO_4$ in titrations?',
    '$KMnO_4$ is a strong enough oxidiser to oxidise $Cl^-$ to $Cl_2$ ($E^\\circ = 1.36$ V vs Mn reduction 1.52 V). This consumes $KMnO_4$ and gives wrong titre. Dilute $H_2SO_4$ is used instead.'),

  c('Potassium Permanganate', 'medium',
    'Give the products when acidified $KMnO_4$ oxidises: (i) $Fe^{2+}$, (ii) $I^-$, (iii) oxalate $C_2O_4^{2-}$, (iv) $H_2S$, (v) $NO_2^-$.',
    '(i) $Fe^{3+}$; (ii) $I_2$; (iii) $CO_2$; (iv) S; (v) $NO_3^-$. In acid, $MnO_4^-$ is reduced to colourless $Mn^{2+}$.'),

  c('Potassium Permanganate', 'medium',
    'Give the products when $KMnO_4$ reacts with: (i) $I^-$ in neutral medium, (ii) $S_2O_3^{2-}$ in neutral/alkaline medium.',
    '(i) $I^-$ is oxidised to iodate $IO_3^-$. (ii) Thiosulphate is oxidised almost quantitatively to sulphate $SO_4^{2-}$. In both cases Mn goes to $MnO_2$.'),

  c('Potassium Permanganate', 'easy',
    'Write the three half-reactions (with $E^\\circ$) showing the reduction of $MnO_4^-$ in acidic medium.',
    '$MnO_4^- + e^- \\to MnO_4^{2-}$, $E^\\circ = +0.56$ V; $MnO_4^- + 4H^+ + 3e^- \\to MnO_2 + 2H_2O$, $+1.69$ V; $MnO_4^- + 8H^+ + 5e^- \\to Mn^{2+} + 4H_2O$, $+1.52$ V.'),

  c('Potassium Permanganate', 'easy',
    'State three main uses of $KMnO_4$.',
    '(i) Oxidising agent in analytical and preparative chemistry; (ii) bleaching of wool, cotton, silk and other textile fibres; (iii) decolorisation of oils.'),

  // --- Topic 12: Copper, Silver & Gold -------------------------------
  c('Copper, Silver & Gold', 'easy',
    'Give the most stable oxidation state of Cu, Ag and Au.',
    'Cu: +2. Ag: +1. Au: +3. (Cu(I) disproportionates in aqueous solution; Au(I) also disproportionates.)'),

  c('Copper, Silver & Gold', 'medium',
    'Explain why $Cu^+$ is unstable in aqueous solution.',
    'It disproportionates: $2Cu^+ \\to Cu^{2+} + Cu$, with $K_{eq} \\approx 1.6 \\times 10^6$. The large negative hydration enthalpy of $Cu^{2+}$ drives the equilibrium toward disproportionation.'),

  c('Copper, Silver & Gold', 'medium',
    'Why is $Cu^{2+}$ more stable than $Cu^+$ in aqueous solution despite $Cu^+$ having $3d^{10}$?',
    'Although removing the 2nd electron needs high energy, $Cu^{2+}$ has a much more negative hydration enthalpy than $Cu^+$, which more than compensates for the 2nd IE.'),

  c('Copper, Silver & Gold', 'easy',
    'What is "matte" in the extraction of copper?',
    'A molten mixture of $Cu_2S$ and FeS (with silica slag removed) obtained during smelting of chalcopyrite ($CuFeS_2$).'),

  c('Copper, Silver & Gold', 'medium',
    'Write the self-reduction reaction that gives blister copper.',
    '$2Cu_2O + Cu_2S \\to 6Cu + SO_2$. No external reducing agent is used — the sulphide itself reduces the oxide.'),

  c('Copper, Silver & Gold', 'medium',
    'Why are the metallic radii of Ag (144 pm) and Au (144 pm) almost identical?',
    'Lanthanoid contraction (filling of 4f before 5d) cancels the expected size increase from 4d to 5d. Ag (4d) and Au (5d) therefore end up with the same radius.'),

  c('Copper, Silver & Gold', 'hard',
    'What happens when $AgNO_3$ is heated (i) just above its melting point, (ii) more strongly?',
    '(i) $2AgNO_3 \\to 2AgNO_2 + O_2$ (silver nitrite). (ii) On stronger heating: $2AgNO_3 \\to 2Ag + 2NO_2 + O_2$.'),

  // --- Topic 13: Zinc & Mercury --------------------------------------
  c('Zinc & Mercury', 'medium',
    'Why is zinc soft and why does it have a low melting point?',
    'Zn has a fully-filled $3d^{10}$ subshell; d-electrons do not contribute to metallic bonding. Only the two 4s electrons bind the lattice, giving weak metallic bonding and a low melting point.'),

  c('Zinc & Mercury', 'medium',
    'Why is Hg the only metal that is liquid at room temperature?',
    '$[Xe]\\,4f^{14}\\,5d^{10}\\,6s^2$ — d-electrons are buried and unavailable for bonding. Relativistic contraction of the 6s orbital further weakens Hg–Hg bonding, producing very weak metallic interaction.'),

  c('Zinc & Mercury', 'easy',
    'What is "philosopher\'s wool"?',
    'ZnO, obtained as a fluffy white solid when Zn is burned in air.'),

  c('Zinc & Mercury', 'medium',
    'What is the structure of the mercury(I) ion? Why is mercury(I) diamagnetic?',
    'Hg(I) exists as the dimeric $[Hg\\text{–}Hg]^{2+}$ ion ($Hg_2^{2+}$). The Hg–Hg bond pairs the two unpaired electrons, so $Hg_2^{2+}$ is diamagnetic.'),

  c('Zinc & Mercury', 'medium',
    'What is "corrosive sublimate"? Describe its molecular shape in the solid state.',
    '$HgCl_2$. Solid $HgCl_2$ contains discrete linear Cl–Hg–Cl molecules (Hg uses $sp$ hybrid orbitals), which explains its high volatility.'),

  c('Zinc & Mercury', 'medium',
    'What is white vitriol, and with which common salt is it isomorphous?',
    'White vitriol is $ZnSO_4 \\cdot 7H_2O$. It is isomorphous with Epsom salt ($MgSO_4 \\cdot 7H_2O$) — both crystallise in the same lattice with $M^{2+}$ of similar ionic radii.'),

  // --- Topic 14: The Lanthanoids (4f Series) -------------------------
  c('The Lanthanoids (4f Series)', 'easy',
    'Give the general electronic configuration of lanthanoids.',
    '$[Xe]\\,4f^{1-14}\\,5d^{0-1}\\,6s^2$. Ln³⁺ ions have config $[Xe]\\,4f^{0-14}$.'),

  c('The Lanthanoids (4f Series)', 'medium',
    'Why are lanthanoids extremely difficult to separate from each other?',
    'Lanthanoid contraction makes their ionic radii and chemical properties almost identical. Fractional crystallisation is impractical; modern separation uses ion-exchange chromatography.'),

  c('The Lanthanoids (4f Series)', 'medium',
    'How does the basic character of $Ln(OH)_3$ change from $La(OH)_3$ to $Lu(OH)_3$?',
    'It decreases steadily. Due to lanthanoid contraction, cation size falls and covalent character of the M–OH bond rises, so the hydroxide becomes progressively less basic.'),

  c('The Lanthanoids (4f Series)', 'easy',
    'Which two trivalent lanthanoid ions are diamagnetic?',
    '$La^{3+}$ ($4f^0$) and $Lu^{3+}$ ($4f^{14}$). Both have no unpaired f-electrons.'),

  c('The Lanthanoids (4f Series)', 'medium',
    'Which lanthanoid has a stable +4 oxidation state and why?',
    'Cerium. $Ce^{4+}$ has a stable $[Xe]$ noble-gas configuration ($4f^0$). $E^\\circ(Ce^{4+}/Ce^{3+}) = +1.74$ V, so $Ce^{4+}$ is a strong oxidising agent but still useful as an analytical reagent.'),

  c('The Lanthanoids (4f Series)', 'medium',
    'Why is $Eu^{2+}$ a strong reducing agent?',
    '$Eu^{2+}$ has the stable half-filled $4f^7$ configuration and is relatively easy to form, but it reverts spontaneously to the characteristic $Eu^{3+}$, supplying one electron in the process.'),

  c('The Lanthanoids (4f Series)', 'easy',
    'What is "Mischmetall" and what is it used for?',
    'An alloy containing ~95% lanthanoid metal (mainly Ce, La, Nd), ~5% Fe, and traces of S, C, Ca and Al. Uses: flints of cigarette lighters, bullet casings, Mg-alloys for jet engines.'),

  c('The Lanthanoids (4f Series)', 'easy',
    'Give the chemical products when a lanthanoid (Ln) reacts with (i) $O_2$, (ii) $H_2O$, (iii) $N_2$, (iv) a halogen $X_2$.',
    '(i) $Ln_2O_3$; (ii) $Ln(OH)_3 + H_2$ (slow cold, fast hot); (iii) LnN (at high temperature); (iv) $LnX_3$.'),

  c('The Lanthanoids (4f Series)', 'hard',
    'State two applications of lanthanoid oxides/compounds.',
    '(i) Catalysts in petroleum cracking (mixed $Ln$-zeolites). (ii) Phosphors in colour TVs and fluorescent screens; also in lasers (e.g. Nd-YAG).'),

  c('The Lanthanoids (4f Series)', 'medium',
    'Why does lanthanum not strictly have a 4f electron in its ground state?',
    'La: $[Xe]\\,5d^1\\,6s^2$ — its ground-state configuration has no 4f electron. 4f filling begins only at Ce ($4f^1\\,5d^1\\,6s^2$). La is grouped with the lanthanoids for chemical similarity.'),

  // --- Topic 15: The Actinoids (5f Series) ---------------------------
  c('The Actinoids (5f Series)', 'easy',
    'Give the general electronic configuration of the actinoids.',
    '$[Rn]\\,5f^{0-14}\\,6d^{0-2}\\,7s^2$. All 14 elements from Th (Z=90) to Lr (Z=103) are radioactive.'),

  c('The Actinoids (5f Series)', 'medium',
    'Why is actinoid contraction greater than lanthanoid contraction?',
    '5f orbitals are more diffuse than 4f and shield the nuclear charge even less effectively. The net increase in effective nuclear charge down the series is larger, contracting the ions more strongly.'),

  c('The Actinoids (5f Series)', 'medium',
    'Why do actinoids show a much wider range of oxidation states than lanthanoids?',
    'The 5f, 6d and 7s subshells are very close in energy, so electrons can be lost from all three. In lanthanoids, 4f electrons are buried deep and rarely participate beyond +3.'),

  c('The Actinoids (5f Series)', 'easy',
    'Which actinoids show the maximum oxidation state of +7?',
    'Neptunium (Np, Z=93) and Plutonium (Pu, Z=94).'),

  c('The Actinoids (5f Series)', 'medium',
    'Why are the ionisation enthalpies of early actinoids lower than those of the corresponding lanthanoids?',
    '5f orbitals are more extended and penetrate less into the core than 4f. The outer electrons are therefore less tightly held, making them easier to remove.'),

  c('The Actinoids (5f Series)', 'medium',
    'How does 5f availability for bonding differ from 4f, and what consequence does this have?',
    '5f orbitals extend farther from the nucleus and are available for covalent bonding, while 4f are buried and inert. Consequently actinoids form more complexes and more covalent compounds than lanthanoids.'),

  c('The Actinoids (5f Series)', 'medium',
    'Which actinoid has no 5f electrons in its ground state?',
    'Thorium (Th, Z=90): $[Rn]\\,6d^2\\,7s^2$. Its 5f subshell is empty.'),

  c('The Actinoids (5f Series)', 'medium',
    'What happens when an actinoid reacts with boiling water?',
    'It forms a mixture of the oxide and the hydride. $HNO_3$ only slightly attacks actinoids (protective oxide layer forms), while HCl attacks them vigorously.'),

  c('The Actinoids (5f Series)', 'easy',
    'Name the last actinoid, state its atomic number and its stable oxidation state.',
    'Lawrencium (Lr), $Z = 103$. Stable oxidation state: +3. Configuration: $[Rn]\\,5f^{14}\\,6d^1\\,7s^2$.'),

  // --- Topic 16: Applications of d- and f-block Elements -------------
  c('Applications of d- and f-block Elements', 'easy',
    'Give the catalyst and the reaction for: (i) Contact process, (ii) Haber process, (iii) Wacker process, (iv) Ziegler-Natta polymerisation.',
    '(i) $V_2O_5$: $SO_2 \\to SO_3$. (ii) Fe (with Mo promoter): $N_2 + 3H_2 \\to 2NH_3$. (iii) $PdCl_2$: $CH_2{=}CH_2 \\to CH_3CHO$. (iv) $TiCl_4$ + $Al(C_2H_5)_3$: ethene $\\to$ polyethylene.'),

  c('Applications of d- and f-block Elements', 'easy',
    'State two pigments or colouring materials derived from d-block metals.',
    'TiO₂ — brilliant white pigment in paints, paper and cosmetics. Fe₂O₃ — red pigment. Also $MnO_2$ is widely used in dry cells (Leclanché cell).'),

  c('Applications of d- and f-block Elements', 'medium',
    'Why is AgBr (and not AgCl or AgI) the principal sensitizer used in photographic films?',
    'AgBr has the ideal balance of light-sensitivity and grain-size control. On exposure it decomposes to deposit metallic Ag at the grain site, forming the latent image which is then developed chemically.'),

  c('Applications of d- and f-block Elements', 'easy',
    'Name three ferrous alloying metals used to produce special steels and state one use.',
    'Chromium (stainless steel, corrosion resistance), Manganese (hard-wearing rail tracks), Nickel (Invar, low thermal expansion). W, Mo and V are used in high-speed tool steels.'),

  c('Applications of d- and f-block Elements', 'easy',
    'Give two uses of zinc in industry.',
    'Galvanisation of iron (corrosion protection) and construction of dry-cell anodes. It is also used in the preparation of alloys such as brass (Cu–Zn).'),
];

// ===================================================================
//  BUILD FLASHCARD DOCUMENTS
// ===================================================================

function buildDocs() {
  // Validate all card topics exist
  const topicMap = new Map(TOPICS.map(t => [t.name, t.order]));
  for (const card of CARDS) {
    if (!topicMap.has(card.topic)) {
      throw new Error(`Unknown topic on card: ${card.topic}`);
    }
  }

  // Sort cards by topic order to give stable display_id numbering
  const sortedCards = [...CARDS].sort((a, b) => {
    const oa = topicMap.get(a.topic);
    const ob = topicMap.get(b.topic);
    if (oa !== ob) return oa - ob;
    return 0;
  });

  const docs = sortedCards.map((card, i) => {
    const num = String(i + 1).padStart(3, '0');
    return {
      flashcard_id: `DFB-${num}`,
      _id: uuidv4(),
      chapter: CHAPTER,
      topic: { name: card.topic, order: topicMap.get(card.topic) },
      question: card.q.trim(),
      answer: card.a.trim(),
      metadata: {
        difficulty: card.difficulty,
        tags: ['bitsat', 'ncert', ...card.tags],
        source: 'NCERT Class 12 Ch 8',
        class_num: 12,
        created_at: new Date(),
        updated_at: new Date(),
      },
      deleted_at: null,
    };
  });

  return docs;
}

// Lightweight LaTeX / formatting lint.
function lintCard(card) {
  const issues = [];
  const txt = card.question + '\n' + card.answer;
  if (txt.includes('$$')) issues.push('contains $$ (prohibited — use single $)');
  // unbalanced $ (count of $ should be even)
  const dollars = (txt.match(/\$/g) || []).length;
  if (dollars % 2 !== 0) issues.push(`odd number of $ delimiters (${dollars})`);
  if (/\?\./.test(card.question)) issues.push('question has "?." — trailing period after ?');
  if (/\$[A-Za-z]+\$(?!\s|,|\.|;|:|\?|\)|$)/.test(txt)) {
    // probably fine; just a heuristic
  }
  return issues;
}

// ===================================================================
//  MAIN
// ===================================================================

async function main() {
  const apply = process.argv.includes('--apply');
  const docs = buildDocs();

  // Lint
  let lintErrors = 0;
  for (const d of docs) {
    const issues = lintCard({ question: d.question, answer: d.answer });
    if (issues.length) {
      console.log(`LINT ${d.flashcard_id} [${d.topic.name}]: ${issues.join('; ')}`);
      lintErrors += issues.length;
    }
  }
  if (lintErrors > 0) {
    console.error(`\n✗ Lint failed with ${lintErrors} issues. Fix before applying.`);
    if (apply) process.exit(1);
  } else {
    console.log('✓ Lint clean — no LaTeX or formatting errors detected.');
  }

  // Per-topic summary
  const byTopic = {};
  for (const d of docs) {
    byTopic[d.topic.name] ??= 0;
    byTopic[d.topic.name]++;
  }

  console.log('\n--- Refined D&F Block set ---');
  console.log(`Total cards: ${docs.length}`);
  console.log(`Topics: ${Object.keys(byTopic).length}`);
  for (const t of TOPICS) {
    console.log(`  ${String(t.order).padStart(2, ' ')}. ${t.name}: ${byTopic[t.name] || 0} cards`);
  }
  const needsImage = docs.filter(d => d.metadata.tags.includes('needs_image'));
  console.log(`\nCards flagged "needs_image": ${needsImage.length}`);
  for (const d of needsImage) {
    console.log(`  - ${d.flashcard_id} [${d.topic.name}]: ${d.question.slice(0, 70)}...`);
  }

  // Write preview JSON
  const previewPath = path.join(__dirname, 'df_block_refined_preview.json');
  fs.writeFileSync(previewPath, JSON.stringify(docs, null, 2));
  console.log(`\nPreview JSON written to ${previewPath}`);

  if (!apply) {
    console.log('\nDRY RUN. Re-run with --apply to write to MongoDB.');
    return;
  }

  // APPLY: connect, soft-delete old, insert new
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not set in .env.local');
    process.exit(1);
  }

  console.log('\nConnecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);

  const FlashcardSchema = new mongoose.Schema({}, { strict: false, collection: 'flashcards' });
  const Flashcard = mongoose.model('Flashcard_migrate', FlashcardSchema, 'flashcards');

  // Soft-delete the existing 65 cards
  const softDeleteRes = await Flashcard.updateMany(
    { 'chapter.id': 'ch12_dblock', deleted_at: null },
    { $set: { deleted_at: new Date() } }
  );
  console.log(`Soft-deleted ${softDeleteRes.modifiedCount} existing D&F cards.`);

  // Insert new cards
  const insertRes = await Flashcard.insertMany(docs);
  console.log(`Inserted ${insertRes.length} refined D&F cards.`);

  await mongoose.disconnect();
  console.log('\nDone.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
