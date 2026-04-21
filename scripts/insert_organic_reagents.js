/**
 * Insert organic_reagents flashcards (70 cards, 7 topics × 10)
 * JEE / NEET / BITSAT scope only.
 *
 * Usage:
 *   node scripts/insert_organic_reagents.js           # dry run
 *   node scripts/insert_organic_reagents.js --apply   # write to DB
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');

const CHAPTER = {
  id: 'organic_reagents',
  name: 'Organic Reagents',
  category: 'Organic Chemistry',
};

// T = topicName, O = topicOrder, D = difficulty, I = imageNote
const T1 = { name: 'Reducing Agents',                   order: 1 };
const T2 = { name: 'Oxidising Agents',                  order: 2 };
const T3 = { name: 'Halogenation Reagents',             order: 3 };
const T4 = { name: 'Grignard & Nucleophilic Reagents',  order: 4 };
const T5 = { name: 'EAS Reagents & Catalysts',          order: 5 };
const T6 = { name: 'Elimination & Dehydration Reagents',order: 6 };
const T7 = { name: 'Tests, Detection & Miscellaneous',  order: 7 };

const CARDS = [

  // ══ T1 — Reducing Agents (ORGR-001 to ORGR-010) ══════════════════════════
  { t: T1, d: 'hard',
    q: 'A molecule contains both a ketone $\\ce{C=O}$ and an ester $\\ce{-COOR}$ group. Which hydride — $\\ce{LiAlH4}$ or $\\ce{NaBH4}$ — selectively reduces *only the ketone*, leaving the ester intact? Give the electronic reason.',
    a: '$\\ce{NaBH4}$. Esters have a resonance-stabilised carbonyl (the adjacent O lone pair delocalises into $\\ce{C=O}$, reducing electrophilicity). $\\ce{NaBH4}$ is mild and selective for more reactive carbonyls (aldehydes > ketones > nothing else). $\\ce{LiAlH4}$ is powerful enough to reduce esters, carboxylic acids, amides, and nitriles — it would reduce both groups.',
    img: null },

  { t: T1, d: 'medium',
    q: 'Rosenmund reduction converts $\\ce{RCOCl}$ to $\\ce{RCHO}$. Why is H₂/Pd–BaSO₄ (poisoned catalyst) used rather than ordinary H₂/Pd–C? What would happen with normal Pd–C?',
    a: 'Ordinary Pd–C would *over-reduce*: $\\ce{RCOCl -> RCHO -> RCH2OH}$ (primary alcohol). $\\ce{BaSO4}$ partially deactivates (poisons) the Pd surface — slow enough to stop at the aldehyde stage. The poisoning makes the catalyst "lazy": sufficient for C–Cl hydrogenolysis but not for the subsequent $\\ce{C=O}$ reduction.',
    img: null },

  { t: T1, d: 'hard',
    q: 'Stephen reduction ($\\ce{SnCl2}$/HCl/dry ether) converts a nitrile $\\ce{RCN}$ to an aldehyde $\\ce{RCHO}$. What is the organic intermediate, and why does the reaction stop there rather than proceeding to an amine?',
    a: 'The intermediate is an *aldimine hydrochloride* ($\\ce{R-CH=NH2+ Cl-}$), which precipitates out in the dry ether solvent. $\\ce{SnCl2}$/HCl is mild enough to stop at this salt. Aqueous workup hydrolyses the imine to $\\ce{RCHO}$. Compare: $\\ce{LiAlH4}$ takes a nitrile all the way to a *primary amine* $\\ce{RCH2NH2}$.',
    img: null },

  { t: T1, d: 'medium',
    q: 'Both Wolff–Kishner and Clemmensen reductions convert $\\ce{C=O}$ to $\\ce{CH2}$. A substrate has a *base-stable but acid-labile* protecting group. Which method should you choose, and what are the conditions for each?',
    a: 'Choose **Wolff–Kishner** ($\\ce{NH2NH2 . H2O}$ + KOH + ethylene glycol, ~200 °C, basic). Clemmensen (Zn–Hg/conc. HCl) uses strongly *acidic* conditions that would destroy the acid-labile group. Rule: acid-sensitive substrate → Wolff–Kishner; base-sensitive substrate → Clemmensen.',
    img: null },

  { t: T1, d: 'hard',
    q: '$\\ce{NaBH4}$ cannot reduce a carboxylic acid, but $\\ce{LiAlH4}$ reduces it to a primary alcohol. Give *two* reasons why $\\ce{NaBH4}$ fails with $\\ce{RCOOH}$.',
    a: '(i) $\\ce{RCOOH}$ first *protonates* $\\ce{NaBH4}$, generating $\\ce{H2}$ gas and consuming the reagent with no useful reduction. (ii) Even if excess were used, the carboxylate anion $\\ce{RCOO-}$ is a *poor electrophile* (negative charge repels $\\ce{H-}$). $\\ce{LiAlH4}$ proceeds via a harder, more reactive Al-hydride complex and is not protonated as easily.',
    img: null },

  { t: T1, d: 'medium',
    q: '$\\ce{Fe}$/HCl reduces $\\ce{ArNO2}$ to $\\ce{ArNH2}$. Can $\\ce{NaBH4}$ do the same? And which reagent gives *partial reduction* — stopping at $\\ce{ArNHOH}$ (phenylhydroxylamine)?',
    a: '$\\ce{NaBH4}$ does *not* reduce nitro groups. Selective partial reduction to $\\ce{ArNHOH}$: $\\ce{Zn}$/NH₄Cl (neutral conditions) or $\\ce{Na2S}$/$\\ce{NH4Cl}$. Full reduction to $\\ce{ArNH2}$: Fe/HCl, Sn/HCl, or H₂/Pd–C. Reduction ladder: $\\ce{NO2 -> [N=O] -> NHOH -> NH2}$.',
    img: 'Reduction ladder: NO₂ → NHOH → NH₂ step diagram' },

  { t: T1, d: 'hard',
    q: 'Lindlar\'s catalyst ($\\ce{H2}$, Pd/$\\ce{CaCO3}$, quinoline) and Na/liquid $\\ce{NH3}$ both reduce an internal alkyne to an alkene. How do the products differ in geometry, and what controls the stereochemistry in each case?',
    a: 'Lindlar\'s: *syn* addition of $\\ce{H2}$ → **cis (Z) alkene**. Na/liq. $\\ce{NH3}$ (dissolving metal): vinyl radical anion intermediate → **trans (E) alkene** (anti addition via two sequential single-electron transfers). Same substrate, same gross transformation ($\\ce{C#C -> C=C}$), *opposite* stereochemistry.',
    img: 'Show cis-alkene (Lindlar) vs trans-alkene (Na/NH₃) products' },

  { t: T1, d: 'medium',
    q: 'Clemmensen reduction uses Zn–Hg amalgam with conc. HCl. Why is the amalgam (Zn–Hg) used rather than pure zinc?',
    a: 'Zinc alone would react vigorously with conc. HCl, wasting the metal before it can reduce the carbonyl. The Hg amalgam makes Zn *less reactive* toward HCl (hydrogen overpotential is high on Hg) but still reactive enough for the carbonyl. Additionally, amalgam provides a clean metallic surface with minimal passivation.',
    img: null },

  { t: T1, d: 'medium',
    q: '$\\ce{LiAlH4}$ reduces an amide $\\ce{RCONH2}$ to a primary amine $\\ce{RCH2NH2}$. What does $\\ce{NaBH4}$ give with the same amide, and why?',
    a: '$\\ce{NaBH4}$ does *not* reduce primary or secondary amides — the $\\ce{C=O}$ of the amide is deactivated by nitrogen lone-pair resonance (very poor electrophile). $\\ce{LiAlH4}$ proceeds via a highly reactive aluminium hydride; after workup, gives $\\ce{RCH2NH2}$. Note: $\\ce{NaBH4}$ *can* reduce an *iminium* ion ($\\ce{C=N+R}$), but that is a different substrate.',
    img: null },

  { t: T1, d: 'medium',
    q: 'Identify the product when (i) benzaldehyde $\\ce{PhCHO}$ and (ii) benzoic acid $\\ce{PhCOOH}$ are each treated with $\\ce{NaBH4}$ in EtOH.',
    a: '(i) $\\ce{PhCHO + NaBH4 -> PhCH2OH}$ (benzyl alcohol) — $\\ce{NaBH4}$ reduces aldehydes readily. (ii) $\\ce{PhCOOH + NaBH4}$ → *no reaction* — carboxylic acids are not reduced (reasons: protonation of hydride + carboxylate anion is poor electrophile). To reduce $\\ce{PhCOOH}$ → $\\ce{PhCH2OH}$, use $\\ce{LiAlH4}$.',
    img: null },


  // ══ T2 — Oxidising Agents (ORGR-011 to ORGR-020) ═══════════════════════
  { t: T2, d: 'hard',
    q: 'Cold, dilute $\\ce{KMnO4}$ and hot, concentrated $\\ce{KMnO4/H2SO4}$ both react with $\\ce{CH2=CH2}$ but give completely different products. State the product in each case and give the colour change observed.',
    a: 'Cold dil. $\\ce{KMnO4}$ (Baeyer\'s reagent): *syn* dihydroxylation → ethylene glycol $\\ce{HOCH2CH2OH}$; purple $\\ce{KMnO4}$ → brown $\\ce{MnO2}$ (positive Baeyer\'s test). Hot conc. $\\ce{KMnO4/H2SO4}$: *oxidative cleavage* of $\\ce{C=C}$ → 2 $\\ce{CO2}$ (both carbons were terminal $\\ce{=CH2}$). For $\\ce{CH3CH=CHCH3}$: hot → 2 $\\ce{CH3COOH}$.',
    img: 'Two-pathway diagram: Baeyer\'s (diol) vs hot KMnO₄ (cleavage)' },

  { t: T2, d: 'hard',
    q: 'PCC (pyridinium chlorochromate) and Jones reagent ($\\ce{CrO3/H2SO4}$/acetone) are both Cr(VI) oxidants. Why does PCC stop at the *aldehyde* stage from a primary alcohol, while Jones continues to the *carboxylic acid*?',
    a: 'PCC is used in *anhydrous* DCM. Without water, the aldehyde intermediate cannot hydrate to a *gem-diol* ($\\ce{RCH(OH)2}$), which is the actual species further oxidised by Cr(VI). Jones reagent is *aqueous/acidic* — the aldehyde hydrates readily → carboxylic acid. Rule: 1° ROH + PCC → RCHO; 1° ROH + Jones → RCOOH.',
    img: null },

  { t: T2, d: 'medium',
    q: 'A secondary alcohol is treated with (i) PCC, (ii) Jones reagent, (iii) hot $\\ce{KMnO4}$. Predict and justify the product in each case.',
    a: 'All three give the **ketone** $\\ce{R2C=O}$. Secondary alcohols *cannot* be over-oxidised past the ketone stage (no α-H on both sides to form the gem-diol / carboxylate). So the identity of the Cr-oxidant or $\\ce{KMnO4}$ does *not* matter for 2° alcohols — contrast with primary alcohols where reagent choice is critical.',
    img: null },

  { t: T2, d: 'medium',
    q: 'Tollen\'s reagent $\\ce{Ag(NH3)2+}$ and Fehling\'s solution ($\\ce{Cu^{2+}}$ tartrate) both detect aldehydes. Which one reacts with *benzaldehyde* and which does *not*, and why?',
    a: 'Tollen\'s reacts with benzaldehyde → silver mirror ($\\ce{PhCHO}$ is oxidised to $\\ce{PhCOO-}$). Fehling\'s does *not* react with benzaldehyde — the $\\ce{Cu^{2+}}$ tartrate complex is a milder oxidant that only oxidises *aliphatic* aldehydes (not aromatic). This is a classic JEE/NEET distinction: both (+) → aliphatic aldehyde; Tollen\'s(+) but Fehling\'s(−) → aromatic aldehyde.',
    img: null },

  { t: T2, d: 'hard',
    q: 'Ozonolysis of 2-butene ($\\ce{CH3CH=CHCH3}$) with $\\ce{O3}$ followed by (i) $\\ce{Zn/H2O}$ (reductive) and (ii) $\\ce{H2O2/H2O}$ (oxidative) — give the products in each case.',
    a: '(i) Reductive workup ($\\ce{Zn/H2O}$ or $\\ce{(CH3)2S}$): $\\ce{C=O}$ groups exposed → two molecules of $\\ce{CH3CHO}$ (acetaldehyde). (ii) Oxidative workup ($\\ce{H2O2}$): further oxidises aldehydic products → two molecules of $\\ce{CH3COOH}$ (acetic acid). Key: reductive → aldehydes; oxidative → carboxylic acids from internal C=C.',
    img: 'Ozonolysis mechanism: ozonide intermediate → two pathways' },

  { t: T2, d: 'medium',
    q: 'Acidified $\\ce{KMnO4}$ completely oxidises a primary alkylbenzene $\\ce{ArCH2R}$ to $\\ce{ArCOOH}$ regardless of chain length. What structural feature is *required* on the side chain, and why does a $\\ce{-C(CH3)3}$ group resist this oxidation?',
    a: 'A *benzylic H* is required — hot acidic $\\ce{KMnO4}$ oxidises stepwise by abstracting the benzylic C–H, eventually cleaving to $\\ce{ArCOOH}$ + $\\ce{CO2}$ from shorter fragments. $\\ce{-C(CH3)3}$ has *no benzylic H* (the α-carbon has no H) → no initial oxidation step → the group is inert to $\\ce{KMnO4}$.',
    img: null },

  { t: T2, d: 'medium',
    q: 'NBS (N-bromosuccinimide) in $\\ce{CCl4}$ under hν selectively brominates the *benzylic position* of toluene. What would happen if $\\ce{Br2/FeBr3}$ were used on the same substrate?',
    a: 'NBS/hν → free-radical benzylic bromination → $\\ce{PhCH2Br}$ (side-chain product, no ring bromination). $\\ce{Br2/FeBr3}$ → ionic EAS → bromine enters the *ring* (ortho and para to $\\ce{CH3}$) → ortho- and para-bromotoluene. The two conditions (radical vs. ionic Lewis acid) are completely different in mechanism and site of bromination.',
    img: null },

  { t: T2, d: 'hard',
    q: 'A primary alcohol $\\ce{RCH2OH}$ is treated with $\\ce{MnO2}$ (activated). What is unusual about this oxidant, and what structural requirement must the substrate meet?',
    a: 'Activated $\\ce{MnO2}$ selectively oxidises *allylic and benzylic* alcohols to the corresponding aldehyde/ketone but does *not* oxidise isolated (non-conjugated) primary or secondary alcohols. Selectivity is surface-based: both the $\\ce{OH}$ and the adjacent $\\pi$-system must coordinate to the $\\ce{MnO2}$ surface. Useful when you need to oxidise a sensitive benzylic alcohol in the presence of a non-activated alcohol.',
    img: null },

  { t: T2, d: 'medium',
    q: 'What structural feature must a carbonyl compound have to give a *positive Fehling\'s test* (brick-red $\\ce{Cu2O}$ precipitate)? Explain why acetone fails.',
    a: 'Requirement: an *aliphatic aldehyde* $\\ce{RCHO}$ (must have a C–H on the carbonyl carbon to be oxidised). Acetone ($\\ce{CH3COCH3}$) is a ketone — no H on the carbonyl carbon, so $\\ce{Cu^{2+}}$ cannot oxidise it → no precipitate. Formic acid ($\\ce{HCOOH}$) is an exception — it also reduces Fehling\'s because the H bonded directly to C=O can be oxidised.',
    img: null },

  { t: T2, d: 'easy',
    q: 'What colour change occurs when acidified $\\ce{K2Cr2O7}$ oxidises a primary alcohol? What is this test\'s historical application?',
    a: 'Orange $\\ce{K2Cr2O7}$ (Cr⁶⁺) → green $\\ce{Cr^{3+}}$ as the alcohol is oxidised (1° ROH → aldehyde → carboxylic acid in aqueous acid). Historical: the older *breathalyser* test — exhaled ethanol reduces orange dichromate to green; the colour change is proportional to blood alcohol content.',
    img: null },


  // ══ T3 — Halogenation Reagents (ORGR-021 to ORGR-030) ════════════════════
  { t: T3, d: 'hard',
    q: '$\\ce{SOCl2}$ converts an alcohol to an alkyl chloride with *retention* of configuration at the reacting carbon, while $\\ce{PCl5}$ gives *inversion*. Explain the mechanistic difference.',
    a: '$\\ce{SOCl2}$: forms a chlorosulfite intermediate $\\ce{R-O-SOCl}$; internal delivery of $\\ce{Cl-}$ from the *same face* (SNi mechanism) → *retention*. If pyridine is added, the mechanism shifts to external $\\ce{Cl-}$ attack → *inversion*. $\\ce{PCl5}$: forms a phosphoryl intermediate that undergoes external $\\ce{Cl-}$ attack (SN2-like) → *inversion*.',
    img: 'SOCl₂ SNi (retention) vs PCl₅ SN2 (inversion) mechanisms' },

  { t: T3, d: 'medium',
    q: 'NBS in $\\ce{CCl4}$ + hν converts toluene to benzyl bromide. If $\\ce{Br2/FeBr3}$ is used instead, what forms and why is the NBS product different?',
    a: 'NBS/hν: radical mechanism → benzylic H abstracted → $\\ce{PhCH2Br}$ (side-chain). $\\ce{Br2/FeBr3}$: ionic EAS → $\\ce{Br+}$ attacks the ring → o- and p-bromotoluene (ring product). The key: *radical conditions* (hν, NBS) → side chain; *ionic conditions* (Lewis acid) → ring.',
    img: null },

  { t: T3, d: 'medium',
    q: 'Finkelstein reaction: $\\ce{RCl + NaI}$ (acetone) $\\ce{-> RI + NaCl}$. Why is acetone the solvent of choice, and what drives the equilibrium to the right?',
    a: '$\\ce{NaI}$ is *soluble* in acetone but the byproduct $\\ce{NaCl}$ is *insoluble* → precipitates out. By Le Chatelier\'s principle, removing $\\ce{NaCl}$ drives the SN2 equilibrium towards $\\ce{RI}$. This is a *solubility-driven* displacement. The same logic applies to $\\ce{RBr + NaI}$ → $\\ce{RI}$.',
    img: null },

  { t: T3, d: 'hard',
    q: 'Swarts reaction uses $\\ce{SbF3}$, $\\ce{AgF}$, or $\\ce{CoF2}$ to convert $\\ce{RCl}$ to $\\ce{RF}$. Why can\'t simple $\\ce{HF}$ be used for this purpose?',
    a: '$\\ce{HF}$ is a weak acid ($\\mathrm{p}K_a \\approx 3.2$) and $\\ce{F-}$ is a *very poor SN2 nucleophile* in protic media (extremely high hydration energy → $\\ce{F-}$ is tightly solvated, unavailable for back-side attack). Metal fluorides provide $\\ce{F-}$ in an anhydrous, less-solvated form via a metal-halide exchange mechanism rather than direct SN2.',
    img: null },

  { t: T3, d: 'hard',
    q: 'HBr adds to propene $\\ce{CH3CH=CH2}$ by two pathways. Give the major product and the *key intermediate* for (i) no peroxide and (ii) with peroxide (ROOR).',
    a: '(i) No peroxide — ionic Markovnikov: H⁺ adds to terminal $\\ce{CH2}$ → 2° carbocation ($\\ce{CH3CH+CH3}$) → $\\ce{Br-}$ attacks → **2-bromopropane**. (ii) Peroxide — radical anti-Markovnikov: $\\ce{Br•}$ adds to terminal $\\ce{CH2}$ (forms more stable 2° *radical* at internal C) → **1-bromopropane**. Peroxides reverse the regiochemistry only for HBr (not HCl or HI).',
    img: 'Markovnikov (cation) vs anti-Markovnikov (radical) pathway for HBr' },

  { t: T3, d: 'medium',
    q: 'Cl₂ reacts with methane under UV light via a *chain mechanism*. Write only the two chain-*propagation* steps and state the product from excess $\\ce{Cl2}$.',
    a: 'Propagation: (1) $\\ce{Cl• + CH4 -> HCl + CH3•}$; (2) $\\ce{CH3• + Cl2 -> CH3Cl + Cl•}$. The $\\ce{Cl•}$ regenerated in step 2 carries the chain. Excess $\\ce{Cl2}$: polyhalogenation → $\\ce{CH2Cl2 -> CHCl3 -> CCl4}$ (cannot be controlled cleanly — halogenation of methane gives a mixture).',
    img: null },

  { t: T3, d: 'hard',
    q: 'HBr adds to 1,3-butadiene at −80 °C and at 40 °C. Identify the *kinetic* and *thermodynamic* products and explain why they differ.',
    a: '−80 °C (kinetic): 1,2-addition → **3-bromobut-1-ene** (Br at C3, faster-forming). 40 °C (thermodynamic): 1,4-addition → **1-bromobut-2-ene** (more stable — internal alkene, allyl product). Both form via the same resonance-stabilised allylic carbocation intermediate $\\ce{CH2=CH-CH+CH3}$; low T captures kinetic product, high T allows equilibration to the more stable 1,4-product.',
    img: '1,2 vs 1,4 addition to 1,3-butadiene; allylic cation' },

  { t: T3, d: 'medium',
    q: 'Both $\\ce{SOCl2}$ and $\\ce{PCl5}$ convert $\\ce{RCOOH}$ to $\\ce{RCOCl}$ (acid chloride). Which is preferred in synthesis and why?',
    a: '$\\ce{SOCl2}$ preferred: $\\ce{RCOOH + SOCl2 -> RCOCl + SO2^ + HCl^}$ — both byproducts ($\\ce{SO2}$ and $\\ce{HCl}$) are *gases* and leave the reaction mixture automatically → simple workup. $\\ce{PCl5}$: byproduct $\\ce{POCl3}$ is a liquid (bp 105 °C) that must be *separated by distillation*, complicating purification.',
    img: null },

  { t: T3, d: 'medium',
    q: 'Iodination of benzene with $\\ce{I2}$ alone is thermodynamically unfavourable and practically difficult. What reagent makes iodination feasible and why?',
    a: '$\\ce{I2/HNO3}$ or $\\ce{I2/HIO3}$: the oxidising agent oxidises the $\\ce{HI}$ byproduct, preventing the *reversible* EAS from going back ($\\ce{HI}$ would otherwise deiodinate the ring). Also, $\\ce{I2}$ is a weak electrophile (large, low ionisation). Removing $\\ce{HI}$ drives the reaction forward (Le Chatelier). Alternatively: $\\ce{I2/H2SO4}$ or $\\ce{ICl}$ (stronger electrophile).',
    img: null },

  { t: T3, d: 'hard',
    q: 'Rank $\\ce{HCl}$, $\\ce{HBr}$, and $\\ce{HI}$ in *decreasing order of reactivity* for electrophilic addition to an alkene, and explain in terms of bond energies and acid strength.',
    a: '$\\ce{HI > HBr > HCl}$. The rate-determining step is protonation of the alkene by $\\ce{H+}$; stronger acid = faster protonation. Acid strength: $\\ce{HI > HBr > HCl}$ (H–X bond strength: $\\ce{H-I}$ weakest → easiest ionisation → most available $\\ce{H+}$). Note: for *radical* addition with peroxide, only HBr gives anti-Markovnikov product — $\\ce{Cl•}$ and $\\ce{I•}$ either react too fast or too slowly to give clean anti-Markovnikov.',
    img: null },


  // ══ T4 — Grignard & Nucleophilic Reagents (ORGR-031 to ORGR-040) ════════
  { t: T4, d: 'easy',
    q: 'Grignard reagent $\\ce{RMgX}$ reacts with $\\ce{HCHO}$, $\\ce{RCHO}$, and $\\ce{R2CO}$. State the *type* (1°, 2°, 3°) of alcohol produced in each case.',
    a: '$\\ce{RMgX + HCHO}$ → 1° alcohol $\\ce{RCH2OH}$ (formaldehyde adds 1 C). $\\ce{RMgX + R\'CHO}$ → 2° alcohol $\\ce{RCH(OH)R\'}$. $\\ce{RMgX + R\'2CO}$ → 3° alcohol $\\ce{R-C(OH)R\'2}$. Rule: each Grignard addition forms one new C–C bond at the carbonyl carbon.',
    img: null },

  { t: T4, d: 'medium',
    q: 'Grignard reagent reacts with $\\ce{CO2}$ then aqueous workup. Identify the product from $\\ce{PhMgBr + CO2}$, and explain why $\\ce{CO2}$ is a better "one-carbon electrophile" than a ketone in some syntheses.',
    a: '$\\ce{PhMgBr + CO2 -> PhCOOMgBr ->}$ (H₃O⁺) $\\ce{PhCOOH}$ (benzoic acid). $\\ce{CO2}$ adds only *once* (the carboxylate anion formed is much less electrophilic than the original $\\ce{CO2}$), so no double addition occurs. Ketones and aldehydes can add two equivalents of Grignard if excess is used. $\\ce{CO2}$ is a clean, controlled one-carbon homologation: $\\ce{ArX -> ArMgX -> ArCOOH}$.',
    img: null },

  { t: T4, d: 'hard',
    q: 'Why can\'t a Grignard reagent be prepared from a compound that contains an $\\ce{–OH}$, $\\ce{–NH}$, $\\ce{–SH}$, or $\\ce{–COOH}$ group in the same molecule?',
    a: 'These groups have *acidic protons* (pKₐ ≈ 10–16 for –OH phenol; ~50 for C–H). The Grignard reagent (R = strong carbanion) would be *immediately protonated* by these groups: $\\ce{RMgBr + R\'OH -> RH + R\'OMgBr}$. The Grignard is destroyed before it can reach the intended electrophile. Protection of –OH as an ether (e.g. THP) is required in advanced synthesis.',
    img: null },

  { t: T4, d: 'hard',
    q: '$\\ce{CH3MgBr}$ is added to methyl benzoate $\\ce{PhCOOCH3}$. After workup, is the product a secondary or tertiary alcohol? Show the two-step mechanism.',
    a: 'Tertiary alcohol $\\ce{PhC(OH)(CH3)2}$ (2-phenylpropan-2-ol). Step 1: $\\ce{CH3MgBr}$ attacks ester C=O → tetrahedral intermediate → $\\ce{-OCH3}$ expelled → acetophenone $\\ce{PhCOCH3}$ (ketone). Step 2: The ketone is *more reactive* than the starting ester → second equivalent of $\\ce{CH3MgBr}$ adds → tertiary alkoxide → H₃O⁺ → 3° alcohol. Grignard + ester always gives 3° alcohol (2 equiv. consumed).',
    img: 'Two-step Grignard on ester → ketone intermediate → tertiary alcohol' },

  { t: T4, d: 'medium',
    q: '$\\ce{HCN}$ adds to acetaldehyde $\\ce{CH3CHO}$ but not to diisopropyl ketone $\\ce{(iPr)2C=O}$. Give the product from acetaldehyde and explain the selectivity.',
    a: '$\\ce{CH3CHO + HCN -> CH3CH(OH)CN}$ (acetaldehyde cyanohydrin, a 2-hydroxynitrile; can be hydrolysed → lactic acid). Diisopropyl ketone: too sterically crowded for $\\ce{CN-}$ (small but attacks from below the plane). Order of electrophilicity: $\\ce{HCHO > RCHO > CH3COR > R2CO}$ (increasing steric + electronic deactivation).',
    img: null },

  { t: T4, d: 'medium',
    q: '$\\ce{NaHSO3}$ (sodium bisulfite) forms a crystalline adduct with some carbonyl compounds but not others. State which *classes* react and which don\'t, and give the use of this adduct.',
    a: 'Reacts: *all aldehydes*, *methyl ketones* $\\ce{CH3COR}$, and *cyclic ketones* with ≤8 ring members. Does *not* react: dialkyl ketones with large groups (steric block at carbonyl). Product: α-hydroxysulfonate salt (water-soluble, crystalline). Use: *purification* — isolate the adduct by filtration, then regenerate the aldehyde with $\\ce{Na2CO3}$ (basic) or HCl (acidic), separating it from non-reacting impurities.',
    img: null },

  { t: T4, d: 'medium',
    q: 'What product does $\\ce{NH2OH}$ (hydroxylamine) form with acetone, and what is the product called? Why are such derivatives useful in the lab?',
    a: '$\\ce{(CH3)2C=O + NH2OH -> (CH3)2C=NOH + H2O}$ (propan-2-one *oxime*). Mechanism: nucleophilic addition → hemiaminal → dehydration → C=NOH. Oximes are *crystalline solids* with sharp, tabulated melting points — allowing *identification* of an unknown ketone or aldehyde by comparing the oxime m.p. with a reference table (used when liquid carbonyls are hard to characterise directly).',
    img: null },

  { t: T4, d: 'medium',
    q: '2,4-DNP (Brady\'s reagent) is used to both *detect* and *identify* a carbonyl compound. How does the test do both tasks, and which task is more definitive?',
    a: '*Detection* (qualitative): orange/yellow precipitate with any aldehyde or ketone → confirms $\\ce{C=O}$ group. *Identification* (quantitative): the 2,4-dinitrophenylhydrazone derivative is crystalline; its *melting point* is specific to each carbonyl compound and matches tabulated values → identifies the exact compound. The m.p. is the more definitive result; the precipitate colour alone only says "some $\\ce{C=O}$ is present."',
    img: null },

  { t: T4, d: 'hard',
    q: 'Grignard reagent $\\ce{RMgX}$ reacts with *ethylene oxide* (oxirane). What product forms and why is this reaction synthetically valuable?',
    a: '$\\ce{RMgX}$ opens the epoxide at the *less hindered* carbon (SN2, basic conditions) → $\\ce{RCH2CH2OMgX}$ → H₃O⁺ → $\\ce{RCH2CH2OH}$ (primary alcohol, *exactly 2 carbons longer* than R). This is a clean "2-carbon homologation" with a primary alcohol product — more selective than formaldehyde (1 C added) and gives primary rather than secondary alcohol.',
    img: null },

  { t: T4, d: 'hard',
    q: 'Which of: (i) ester, (ii) acid chloride, (iii) nitrile, (iv) $\\ce{CO2}$ — gives a *ketone directly* on reaction with a Grignard reagent (without double addition)?',
    a: '**Nitrile** (iii): $\\ce{RCN + R\'MgX -> RCO-NMgX (imine)} ->$ (H₃O⁺) $\\ce{RCOR\'}$ (ketone). The imine metal complex is *less reactive* than the original nitrile → second addition does not occur. Acid chloride also gives ketone initially, but the ketone is *more reactive* than RCOCl → second Grignard adds → 3° alcohol. Ester: 3° alcohol (via ketone, as above). $\\ce{CO2}$: carboxylic acid.',
    img: null },


  // ══ T5 — EAS Reagents & Catalysts (ORGR-041 to ORGR-050) ════════════════
  { t: T5, d: 'hard',
    q: 'Friedel–Crafts alkylation requires $\\ce{AlCl3}$ in excess (>1 equiv.) and strictly anhydrous conditions. Give a distinct reason for *each* requirement.',
    a: 'Excess $\\ce{AlCl3}$: after the alkylation, $\\ce{AlCl3}$ forms a stable complex with the product (Lewis acid–Lewis base) → tied up catalyst; free $\\ce{AlCl3}$ must remain for further cycles. Anhydrous: water immediately hydrolyses $\\ce{AlCl3 + H2O -> Al(OH)3 + 3HCl}$, destroying the Lewis acid. Even traces of moisture kill the reaction.',
    img: null },

  { t: T5, d: 'hard',
    q: 'Friedel–Crafts alkylation of benzene with n-propyl chloride gives mainly *isopropylbenzene*, not n-propylbenzene. Why?',
    a: 'The n-propyl cation ($\\ce{CH3CH2CH2+}$, primary) rearranges via a *hydride shift* → isopropyl cation ($\\ce{(CH3)2CH+}$, secondary, more stable). This rearranged carbocation then attacks benzene → isopropylbenzene (cumene). FC alkylation always proceeds via a carbocation intermediate, so rearrangements are common for primary and secondary substrates.',
    img: null },

  { t: T5, d: 'hard',
    q: 'Friedel–Crafts *acylation* does not undergo rearrangement and gives only one product, while *alkylation* gives rearrangements and polyalkylation. Give one mechanistic reason for each difference.',
    a: 'No rearrangement in acylation: the acylium ion $\\ce{R-C#O+}$ is resonance-stabilised and does not rearrange (unlike a carbocation). No polyacylation: the newly installed $\\ce{C=O}$ group is an *electron-withdrawing* meta-director → ring is *less reactive* than benzene → second acylation is slow. Alkylation installs an alkyl group (activating, ortho/para director) → ring is *more reactive* → polyalkylation.',
    img: null },

  { t: T5, d: 'medium',
    q: 'Friedel–Crafts reactions *fail* completely for nitrobenzene, aniline, and benzoic acid as substrates. Identify the reason for each.',
    a: 'Nitrobenzene: strong $\\ce{-NO2}$ (EWG, meta-director) deactivates the ring — too electron-poor for electrophilic attack. Benzoic acid: $\\ce{-COOH}$ is deactivating (meta-director); also $\\ce{AlCl3}$ coordinates to the carboxylate oxygen. Aniline: $\\ce{-NH2}$ forms a Lewis acid–base complex with $\\ce{AlCl3}$ → $\\ce{-NH2 . AlCl3}$ (ammonium complex, strongly EW) → ring deactivated even more than $\\ce{-NO2}$.',
    img: null },

  { t: T5, d: 'medium',
    q: 'In benzene nitration, $\\ce{HNO3/H2SO4}$ is used. Write the two steps showing formation of the actual electrophile $\\ce{NO2+}$ (nitronium ion).',
    a: 'Step 1: $\\ce{HNO3 + H2SO4 -> H2NO3+ + HSO4-}$ (H₂SO₄ protonates the weaker acid $\\ce{HNO3}$). Step 2: $\\ce{H2NO3+ -> NO2+ + H2O}$ (protonated nitric acid loses water). $\\ce{H2SO4}$ is regenerated in the sigma-complex aromatisation step. $\\ce{NO2+}$ is the actual electrophile, not $\\ce{HNO3}$.',
    img: null },

  { t: T5, d: 'medium',
    q: 'Sulfonation of benzene is *reversible*, unlike nitration. How is this exploited in organic synthesis?',
    a: '$\\ce{C6H6 + SO3 -> C6H5SO3H}$ (sulfonation). Reversible: dilute $\\ce{H2SO4}$ at >200 °C → desulfonation (restores benzene). The $\\ce{-SO3H}$ group can act as a *temporary blocking group*: introduce it ortho to direct the next electrophile to a specific position, then remove it by desulfonation to give the desired substitution pattern.',
    img: null },

  { t: T5, d: 'hard',
    q: 'Gattermann reaction and Gattermann–Koch reaction share a name but are completely different. Distinguish them in one sentence each.',
    a: '**Gattermann** (halide route): $\\ce{ArNH2 -> ArN2+ -> ArCl/ArBr}$ using Cu powder (less pure than Sandmeyer\'s $\\ce{CuCl/CuBr}$). **Gattermann–Koch** (formylation): $\\ce{ArH + CO + HCl ->}$ ($\\ce{AlCl3/CuCl}$) $\\ce{-> ArCHO}$ — introduces an aldehyde group directly onto the ring. The Koch variation creates a *C–C bond*; the halide variation creates a *C–halogen bond*.',
    img: null },

  { t: T5, d: 'hard',
    q: 'Reimer–Tiemann reaction: phenol + $\\ce{CHCl3}$ + NaOH → salicylaldehyde. What is the reactive intermediate and why is the product predominantly *ortho*?',
    a: '$\\ce{CHCl3 + NaOH -> :CCl2}$ (dichlorocarbene) — the active electrophile. Under basic conditions, phenol is converted to the *phenoxide anion* ($\\ce{PhO-}$), which is highly activated for EAS. Carbene attacks the *ortho* position preferentially (ortho-directing effect of $\\ce{-O-}$ in basic conditions + steric/electronic proximity effects). The initial adduct is hydrolysed to give 2-hydroxybenzaldehyde (salicylaldehyde).',
    img: 'Dichlorocarbene formation + ortho attack on phenoxide' },

  { t: T5, d: 'medium',
    q: 'Diazonium salt $\\ce{ArN2+}$ undergoes coupling with phenol to give an azo dye. Under what pH must the coupling be done, and why does strongly acidic pH prevent it?',
    a: 'pH 8–10 (mildly alkaline). At this pH, phenol is partially deprotonated → *phenoxide* $\\ce{PhO-}$ (much more reactive toward electrophilic $\\ce{ArN2+}$ than neutral phenol — the ring is more electron-rich). Strongly acidic pH: phenoxide is fully protonated back to phenol → ring deactivated; also, at very low pH, the diazonium converts to the less reactive diazotate. Product: $\\ce{Ar-N=N-Ar\'-OH}$ (azo dye, coloured due to extended conjugation).',
    img: null },

  { t: T5, d: 'medium',
    q: 'Why does Friedel–Crafts alkylation with an *alkene* + $\\ce{H2SO4}$ give the same product as with an *alkyl halide* + $\\ce{AlCl3}$?',
    a: 'Both pathways generate the *same carbocation* intermediate. $\\ce{AlCl3}$: abstracts $\\ce{Cl-}$ from $\\ce{RCl}$ → $\\ce{R+}$. $\\ce{H2SO4}$: protonates the alkene → $\\ce{R+}$. The same carbocation attacks benzene → identical alkylbenzene product. Industrially, ethylbenzene (styrene precursor) is made by reacting benzene with ethylene over an acid catalyst — no toxic alkyl halide needed.',
    img: null },


  // ══ T6 — Elimination & Dehydration Reagents (ORGR-051 to ORGR-060) ══════
  { t: T6, d: 'hard',
    q: 'A 2° alkyl halide is treated with (i) $\\ce{NaOEt}$/EtOH, heat and (ii) t-BuOK/t-BuOH, heat. Both give E2 elimination. How do the *major alkene products* differ, and what controls the regioselectivity?',
    a: '(i) Small base $\\ce{NaOEt}$: approaches the *more substituted* β-carbon (statistically and energetically preferred) → **Zaitsev product** (more substituted, more stable alkene). (ii) Bulky base t-BuOK: too hindered to approach the crowded β-carbon; takes H from the *less substituted, more accessible* β-C → **Hofmann product** (less substituted alkene). Steric bulk of base dictates regiochemistry.',
    img: 'Small base (Zaitsev) vs bulky base (Hofmann) products' },

  { t: T6, d: 'medium',
    q: 'Alcoholic KOH and aqueous KOH give different products from 2-bromobutane. Explain the outcome of each.',
    a: 'Aqueous KOH: $\\ce{OH-}$ in a polar protic medium acts primarily as a *nucleophile* → SN2 → 2-butanol (substitution). Alcoholic KOH (in EtOH): less polar solvent, $\\ce{OH-}$ acts as a *base*, favouring E2 → mixture of but-1-ene and but-2-ene (Zaitsev major: but-2-ene). Mnemonic: aq. KOH = substitution; alc. KOH = elimination.',
    img: null },

  { t: T6, d: 'medium',
    q: 'Concentrated $\\ce{H2SO4}$ with ethanol at 140 °C gives diethyl ether, but at 170 °C gives ethene. Explain the temperature dependence.',
    a: '140 °C (lower energy): one EtOH protonated → oxonium ion → *intermolecular* SN2 by a second EtOH → diethyl ether + $\\ce{H2O}$. 170 °C (higher energy): intramolecular E1 pathway — protonated ethanol loses a β-H → $\\ce{CH2=CH2}$. The elimination has a higher $E_a$ and is *entropically favoured* at high temperature (forms gas). Rule: lower T → ether; higher T → alkene.',
    img: null },

  { t: T6, d: 'hard',
    q: 'Pyrolysis of an ester (e.g. ethyl propanoate) at ~400–500 °C gives an alkene. What is the mechanism name, and what is the *stereochemical requirement* for the β-H?',
    a: '**Ei (ester pyrolysis, cis-elimination)**. A *concerted, syn (cis)* elimination: the carbonyl O of the ester abstracts the β-H via a *6-membered cyclic transition state*; H and OAc must be *syn-periplanar* (same-side). Gives the *Hofmann (less substituted)* alkene (least hindered β-H). No ionic intermediate; purely thermal, no acid/base catalyst.',
    img: 'Six-membered cyclic TS of ester pyrolysis Ei mechanism' },

  { t: T6, d: 'medium',
    q: 'Dehydration of 3-methylbutan-2-ol with concentrated $\\ce{H2SO4}$ gives mainly 2-methylbut-2-ene (not 3-methylbut-1-ene). Identify any carbocation rearrangement involved.',
    a: '3-methylbutan-2-ol → protonation → 2° carbocation at C2. A *1,2-methyl shift* from C3 → more stable 3° carbocation at C3. Then Zaitsev dehydration (loss of H from C2, which has most H\'s adjacent) → **2-methylbut-2-ene** (trisubstituted). The Zaitsev product from the *rearranged* carbocation, not the original. This is a classic JEE/NEET rearrangement + Zaitsev question.',
    img: 'Secondary → tertiary carbocation via 1,2-methyl shift; Zaitsev product' },

  { t: T6, d: 'hard',
    q: 'Dehydration via $\\ce{POCl2/pyridine}$ proceeds without carbocation rearrangement, even for substrates that rearrange with $\\ce{H2SO4}$. Why?',
    a: '$\\ce{POCl2}$ (phosphoryl chloride) converts the alcohol to a *phosphate ester* ($\\ce{R-OPOCl2}$, an excellent leaving group). Pyridine deprotonates the β-H in a concerted E2-like step — *no carbocation intermediate forms* → no rearrangement. Contrast with acid-catalysed dehydration ($\\ce{H2SO4}$): goes via a free carbocation → rearrangement possible.',
    img: null },

  { t: T6, d: 'medium',
    q: 'Hofmann exhaustive methylation: an amine is treated with excess $\\ce{CH3I}$ then $\\ce{Ag2O/H2O}$, and heated. What is the structural feature of the *major alkene* product, and what rule governs it?',
    a: 'The *least substituted* alkene (Hofmann product). In a quaternary ammonium salt $\\ce{R3N+CH2-CHR\' | OH-}$, the bulky $\\ce{NR3}$ group is a large leaving group; $\\ce{OH-}$ abstracts the *more accessible* (less hindered) β-H from the least substituted carbon. Hofmann rule: with a bulky or charged leaving group, elimination occurs away from substituents → less substituted alkene.',
    img: null },

  { t: T6, d: 'hard',
    q: 'Vinyl halides ($\\ce{CH2=CHCl}$) resist SN2 at room temperature. What happens at ~600 °C in a cracking tube, and what structural feature causes the room-temperature inertness?',
    a: '600 °C (cracking): elimination → acetylene $\\ce{HC#CH}$ + HCl (thermal E2/radical). Room temperature: the sp² C–Cl bond has *partial double-bond character* (lone pair on Cl delocalises into the $\\ce{C=C}$) → bond shortened and strengthened; the carbon is less electrophilic. This makes SN2 impossible (approaching nucleophile faces a filled $\\pi^*$-like orbital) and SN1 impossible (vinyl cation is extremely unstable, sp hybridised).',
    img: null },

  { t: T6, d: 'medium',
    q: 'Tertiary amines (Et₃N) or pyridine are added as bases in reactions like acylation and sulfonation. Are they reagents, catalysts, or bases? What would happen without them?',
    a: 'They are *stoichiometric bases* (consumed, not catalytic). In acylation of phenol with $\\ce{RCOCl}$, HCl is generated as a byproduct — it would protonate the phenol nucleophile, *reducing* its reactivity and causing incomplete reaction. $\\ce{Et3N}$/pyridine scavenges HCl in situ → drives reaction to completion → cleaner monosubstitution. Without them: product contaminated with acid; phenol becomes less nucleophilic.',
    img: null },

  { t: T6, d: 'medium',
    q: 'Which reagent causes dehydration of an alcohol *without* a carbocation intermediate, thus giving no rearrangement and no Zaitsev bias: (a) conc. $\\ce{H2SO4}$, (b) $\\ce{Al2O3}$, (c) $\\ce{POCl3/pyridine}$, (d) $\\ce{P2O5}$?',
    a: '(c) $\\ce{POCl3/pyridine}$: concerted E2 via phosphate ester intermediate, no carbocation → no rearrangement, gives the Hofmann (less substituted) alkene or specific regio-controlled product. $\\ce{Al2O3}$ (heterogeneous, vapour phase) also avoids classical free carbocations. $\\ce{H2SO4}$ and $\\ce{P2O5}$ both generate carbenium ion pathways → rearrangements possible.',
    img: null },


  // ══ T7 — Tests, Detection & Miscellaneous (ORGR-061 to ORGR-070) ═════════
  { t: T7, d: 'medium',
    q: 'Lucas test ($\\ce{ZnCl2}$/conc. $\\ce{HCl}$) classifies 1°, 2°, and 3° alcohols by turbidity onset. Rank 1°, 2°, 3° from fastest to slowest and give the mechanistic basis.',
    a: '3° (immediate turbidity at RT) > 2° (turbid within 5–10 min) > 1° (no turbidity at RT; requires heat). Mechanism: $\\ce{ZnCl2}$ (Lewis acid) coordinates to $\\ce{–OH}$ → makes it a better leaving group; the alcohol ionises via SN1. 3° carbocation forms instantly (most stable); 2° forms in minutes; 1° carbocation does not form at RT (too unstable). The turbidity is from the insoluble alkyl chloride product.',
    img: null },

  { t: T7, d: 'medium',
    q: 'Iodoform test gives pale yellow $\\ce{CHI3}$ (iodoform) precipitate with compounds containing a $\\ce{CH3CO-}$ or $\\ce{CH3CH(OH)-}$ unit. Give *three* compounds that test positive and *two* that test negative. Justify.',
    a: 'Positive: ethanol ($\\ce{CH3CH2OH}$ — oxidised in situ to acetaldehyde → $\\ce{CH3CO-}$), acetone ($\\ce{CH3COCH3}$), acetaldehyde ($\\ce{CH3CHO}$), acetophenone ($\\ce{PhCOCH3}$). Negative: methanol ($\\ce{HCHO}$ formed — formaldehyde has no $\\ce{CH3CO-}$ unit), benzaldehyde ($\\ce{PhCHO}$ — no $\\ce{CH3-}$ on carbonyl), propanal ($\\ce{CH3CH2CHO}$ — $\\ce{CH3CH2-}$ not $\\ce{CH3CO-}$).',
    img: null },

  { t: T7, d: 'hard',
    q: 'Carbylamine reaction ($\\ce{CHCl3}$ + KOH) is specific for *primary amines* and gives an intensely foul-smelling isocyanide. Why do secondary and tertiary amines not react?',
    a: '$\\ce{CHCl3 + KOH -> :CCl2}$ (dichlorocarbene). The carbene inserts into $\\ce{N-H}$ of $\\ce{RNH2}$ → $\\ce{R-N(H)-CCl2}$ → (2 KOH) → $\\ce{R-N#C}$ (isocyanide). This *requires elimination of 2 HCl*, which needs an N–H bond. 2° amines ($\\ce{R2NH}$) have only *one* N–H → cannot lose 2 HCl to form the isocyanide. 3° amines: *no* N–H at all. Hence only primary amines respond.',
    img: null },

  { t: T7, d: 'hard',
    q: 'Victor Meyer test distinguishes 1°, 2°, and 3° nitroalkanes. State the three colour outcomes after treatment with $\\ce{HNO2}$ (NaNO₂/HCl) followed by NaOH.',
    a: '1° nitroalkane ($\\ce{RCH2NO2}$) + $\\ce{HNO2}$ → nitrolic acid ($\\ce{RC(=NOH)NO2}$) → NaOH → *red* salt. 2° ($\\ce{R2CHNO2}$) → pseudo-nitrole ($\\ce{R2C(NO)NO2}$, blue in solution, colourless solid) → NaOH → *blue*. 3° ($\\ce{R3CNO2}$) → no reaction with $\\ce{HNO2}$ (no α-H) → *colourless*. Mnemonic: 1° = red; 2° = blue; 3° = colourless.',
    img: null },

  { t: T7, d: 'medium',
    q: 'Ninhydrin gives an intense *purple* colour (Ruhemann\'s purple) with α-amino acids. Proline gives a *yellow* colour instead. Explain the difference.',
    a: 'Ninhydrin reacts with the *primary α-amino group* ($\\ce{-NH2}$) via oxidative deamination + condensation → Ruhemann\'s purple. Proline is an *imino acid* — its $\\ce{N}$ is part of a five-membered ring (*secondary* amine, no free $\\ce{NH2}$). The reaction pathway for secondary amines gives a *yellow-brown* product instead of purple. This is a diagnostic distinction for proline in paper chromatography of proteins.',
    img: null },

  { t: T7, d: 'medium',
    q: 'Formic acid $\\ce{HCOOH}$ reduces Fehling\'s solution (positive test), while acetic acid $\\ce{CH3COOH}$ does not. Explain structurally.',
    a: 'Formic acid: $\\ce{H-COOH}$ — the carbon is *directly bonded to H* and to $\\ce{C=O}$ simultaneously; it can be oxidised to $\\ce{CO2 + H2O}$ by $\\ce{Cu^{2+}}$, reducing it to $\\ce{Cu2O}$. Formic acid is essentially an *aldehyde* ($\\ce{HCHO}$ equivalent). Acetic acid: $\\ce{CH3COOH}$ has no H on the carbonyl carbon → cannot be oxidised further → Fehling\'s negative.',
    img: null },

  { t: T7, d: 'medium',
    q: 'Biuret test ($\\ce{NaOH}$ + dilute $\\ce{CuSO4}$) detects proteins but not free amino acids or dipeptides. What structural requirement must be met?',
    a: '$\\ce{Cu^{2+}}$ coordinates to at least *two peptide bonds* (–CO–NH–) in a chelate complex → violet/purple colour. Free amino acids have *zero* peptide bonds. Dipeptides have *one* peptide bond — insufficient for chelation. Tripeptides and above (two or more peptide bonds): positive biuret test. This tests for *protein* (or polypeptide), not amino acid content.',
    img: null },

  { t: T7, d: 'hard',
    q: 'Schiff\'s reagent (decolorised basic fuchsin) gives a pink/magenta colour with aldehydes. Which aldehyde gives a *permanent* pink even on adding excess $\\ce{H2SO4}$, and why is this diagnostic?',
    a: '**Formaldehyde** ($\\ce{HCHO}$) gives a permanent pink colour with Schiff\'s reagent even after addition of excess $\\ce{H2SO4}$ (which normally decolorises the Schiff–aldehyde complex for other aldehydes). Other aldehydes: the adduct is decolorised by excess $\\ce{SO2}$ (from $\\ce{H2SO4}$). This permanence distinguishes $\\ce{HCHO}$ from higher aldehydes — a useful qualitative test in JEE context.',
    img: null },

  { t: T7, d: 'hard',
    q: 'Bromine water ($\\ce{Br2/H2O}$) is decolorised by (i) an alkene, (ii) phenol, (iii) an aliphatic aldehyde. Give the reaction *type* in each case.',
    a: '(i) Alkene: *electrophilic addition* → vicinal dibromide ($\\ce{C=C + Br2 -> CBrCBr}$). (ii) Phenol: *electrophilic substitution* (EAS) → 2,4,6-tribromophenol (white precipitate) + 3 HBr; the ring is highly activated. (iii) Aliphatic aldehyde: *oxidation* ($\\ce{RCHO + Br2 + H2O -> RCOOH + 2HBr}$) — $\\ce{Br2}$ acts as oxidant, not electrophile. All three decolorise bromine water but by *completely different mechanisms*.',
    img: null },

];

// ─── Insert ──────────────────────────────────────────────────────────────────
async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  // Collision check
  const ids = CARDS.map((_, i) => `ORGR-${String(i + 1).padStart(3, '0')}`);
  const clash = await coll.findOne({ flashcard_id: { $in: ids } });
  if (clash) throw new Error(`ID clash: ${clash.flashcard_id}`);

  const now = new Date();
  const docs = CARDS.map((c, i) => ({
    _id: uuidv4(),
    flashcard_id: `ORGR-${String(i + 1).padStart(3, '0')}`,
    chapter: CHAPTER,
    topic: { name: c.t.name, order: c.t.order },
    question: c.q,
    answer: c.a,
    metadata: {
      difficulty: c.d,
      tags: [c.t.name, CHAPTER.name],
      source: 'Canvas Chemistry',
      class_num: 12,
      created_at: now,
      updated_at: now,
    },
    deleted_at: null,
  }));

  // Summary
  const byTopic = {};
  docs.forEach(d => { byTopic[d.topic.name] = (byTopic[d.topic.name] || 0) + 1; });
  console.log(`\nPrepared ${docs.length} cards for chapter: ${CHAPTER.id}`);
  for (const [t, n] of Object.entries(byTopic)) console.log(`  · ${t}: ${n}`);

  // Image list
  const imgCards = CARDS.map((c, i) => ({ id: ids[i], note: c.img })).filter(x => x.note);
  if (imgCards.length) {
    console.log(`\n📷 Cards needing images (${imgCards.length}):`);
    imgCards.forEach(x => console.log(`  [${x.id}] ${x.note}`));
  }

  if (APPLY) {
    const r = await coll.insertMany(docs, { ordered: false });
    console.log(`\n✅ Inserted ${r.insertedCount} cards.`);
  } else {
    console.log('\n(dry run — pass --apply to insert)');
  }

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
