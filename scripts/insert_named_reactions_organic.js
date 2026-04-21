/**
 * Insert named_reactions_organic flashcards (50 cards, 5 topics × 10)
 * JEE / NEET / BITSAT scope only — no Diels-Alder, no Wittig, no sigmatropic.
 *
 * Usage:
 *   node scripts/insert_named_reactions_organic.js           # dry run
 *   node scripts/insert_named_reactions_organic.js --apply
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');

const CHAPTER = {
  id: 'named_reactions_organic',
  name: 'Named Reactions',
  category: 'Organic Chemistry',
};

const T1 = { name: 'Carbonyl Condensation Reactions',   order: 1 };
const T2 = { name: 'Reduction Named Reactions',         order: 2 };
const T3 = { name: 'Halide & Carbon-Skeleton Reactions',order: 3 };
const T4 = { name: 'Amine & Diazonium Reactions',       order: 4 };
const T5 = { name: 'Phenol & Aromatic Named Reactions', order: 5 };

const CARDS = [

  // ══ T1 — Carbonyl Condensation (ORGNR-001 – ORGNR-010) ═══════════════════
  { t: T1, d: 'hard',
    q: 'In an aldol condensation between benzaldehyde $\\ce{PhCHO}$ and acetaldehyde $\\ce{CH3CHO}$ under base, which compound acts as the *nucleophile* and which as the *electrophile*? What is the final product after dehydration?',
    a: 'Benzaldehyde has *no α-H* → cannot form an enolate → acts as the **electrophile** (C=O acceptor). Acetaldehyde has α-H → forms the enolate → **nucleophile**. Product after dehydration: $\\ce{PhCH=CHCHO}$ (cinnamaldehyde, an α,β-unsaturated aldehyde). This is a *crossed aldol* that always goes to completion because PhCHO cannot self-condense.',
    img: 'Crossed aldol: acetaldehyde enolate + PhCHO → cinnamaldehyde' },

  { t: T1, d: 'hard',
    q: 'Cannizzaro reaction: which structural feature is *required* for a substrate to undergo Cannizzaro, and why does acetaldehyde $\\ce{CH3CHO}$ not undergo it?',
    a: 'Required: an aldehyde with *no α-H*. Without α-H, there is no enolate available for Aldol; instead, base-catalysed disproportionation (one molecule oxidised, one reduced): $\\ce{2RCHO ->}$ conc. NaOH $\\ce{-> RCOO- + RCH2OH}$. Acetaldehyde has an α-H ($\\ce{CH3}$ group) → prefers Aldol condensation, not Cannizzaro. Examples: $\\ce{HCHO, PhCHO, (CH3)3CCHO}$ → Cannizzaro.',
    img: null },

  { t: T1, d: 'hard',
    q: 'Crossed Cannizzaro: formaldehyde $\\ce{HCHO}$ is mixed with benzaldehyde $\\ce{PhCHO}$ + conc. NaOH. Which compound gets *oxidised* and which gets *reduced*, and why is the outcome predictable?',
    a: '$\\ce{HCHO}$ (more easily oxidised, has two H on carbonyl C) → $\\ce{HCOO-}$ (formate, oxidised). $\\ce{PhCHO}$ → $\\ce{PhCH2OH}$ (benzyl alcohol, reduced). $\\ce{HCHO}$ acts as the *hydride donor* (reducing agent) because it is more reactive; $\\ce{PhCHO}$ acts as the *hydride acceptor*. This is a classic asymmetric Cannizzaro that quantitatively reduces benzaldehyde to benzyl alcohol.',
    img: null },

  { t: T1, d: 'medium',
    q: 'What distinguishes a simple *aldol reaction* from an *aldol condensation*, and what condition promotes the second step?',
    a: '**Aldol reaction** (step 1): nucleophilic addition of enolate to a carbonyl → β-*hydroxy* carbonyl compound (the "aldol"). **Aldol condensation** (step 1 + step 2): the β-hydroxy compound undergoes *dehydration* → α,β-*unsaturated* carbonyl (e.g. crotonaldehyde). Second step (dehydration) is promoted by *heating* or *acidic conditions* — the unsaturated product is conjugated and thermodynamically more stable.',
    img: null },

  { t: T1, d: 'hard',
    q: 'Hell–Volhard–Zelinsky (HVZ) reaction: what reagents are used, what is the product, and why does the reaction require *catalytic* $\\ce{PBr3}$ rather than only $\\ce{Br2}$?',
    a: 'Reagents: $\\ce{RCOOH + Br2 + PBr3}$ (cat.) → α-bromo acid $\\ce{RCHBrCOOH}$. Mechanism: $\\ce{PBr3}$ converts the carboxylic acid to an *acid bromide* ($\\ce{RCOBr}$), which enolises more easily than the acid → α-bromination → hydrolysis of the acid bromide → α-bromo acid. Carboxylic acids do not enolise easily; the acid bromide intermediate is essential. Product is used for α-amino acid synthesis via Gabriel or SN2.',
    img: null },

  { t: T1, d: 'hard',
    q: 'Self-condensation of acetone under base gives diacetone alcohol. Write the product and explain why the equilibrium strongly favours starting material, yet the product can still be isolated.',
    a: '$\\ce{2(CH3)2CO ->}$ base $\\ce{-> (CH3)2C(OH)CH2COCH3}$ (diacetone alcohol, 4-methylpent-4-en-2-ol). Ketones are less reactive than aldehydes; the equilibrium lies far to the *left* (thermodynamically unfavourable). Isolation: use a Soxhlet extractor with Ba(OH)₂ catalyst — product drains out of the reaction zone, shifting equilibrium. This demonstrates Le Chatelier\'s use in synthesis.',
    img: null },

  { t: T1, d: 'medium',
    q: 'Benzoin condensation: two molecules of $\\ce{PhCHO}$ react in presence of $\\ce{CN-}$ (or thiamine pyrophosphate) to give benzoin. Why is $\\ce{CN-}$ indispensable — and why does the reaction not proceed with $\\ce{OH-}$?',
    a: '$\\ce{CN-}$ adds to $\\ce{PhCHO}$ → cyanohydrin anion. This *umpolung* (polarity reversal): the carbonyl carbon, normally electrophilic, becomes nucleophilic after CN attachment (the α-carbon now carries lone-pair density). It attacks a second $\\ce{PhCHO}$ → benzoin after CN loss. $\\ce{OH-}$ cannot achieve umpolung — it would just give Cannizzaro. Benzoin condensation only works for aromatic aldehydes (no α-H).',
    img: null },

  { t: T1, d: 'medium',
    q: 'Reformatsky reaction uses Zn and an α-bromo ester. What is the product from $\\ce{Zn + BrCH2COOC2H5}$ added to benzaldehyde, and how does this differ from a Grignard approach to the same synthesis?',
    a: 'Product: $\\ce{PhCH(OH)CH2COOC2H5}$ (ethyl β-hydroxyphenylpropanoate, a β-hydroxy ester). Zn inserts into C–Br → zinc enolate → nucleophilic addition to $\\ce{PhCHO}$ → workup. vs. Grignard: a Grignard reagent would reduce the ester to an alcohol (2 equiv.) or react with other functional groups. Reformatsky zinc-enolate is *milder* — it tolerates ester, ketone, and other reactive groups in the same molecule, whereas Grignard does not.',
    img: null },

  { t: T1, d: 'medium',
    q: 'Perkin reaction produces cinnamic acid from benzaldehyde + acetic anhydride + NaOAc. What is the role of sodium acetate, and why is benzaldehyde (not acetaldehyde) used as the electrophile?',
    a: 'NaOAc: acts as the *base*, deprotonating the α-H of acetic anhydride → nucleophilic enolate. Benzaldehyde: *no α-H* → acts purely as the electrophile; the condensation then goes with the enolate of acetic anhydride → β-phenylacrylic acid (cinnamic acid) after hydrolysis. Acetaldehyde has α-H and would undergo self-condensation (Aldol) instead, competing with the crossed condensation.',
    img: null },

  { t: T1, d: 'hard',
    q: 'Intramolecular aldol condensation of heptane-2,6-dione gives a 5-membered ring product. Draw/describe the product and explain the ring-size preference.',
    a: 'Heptane-2,6-dione under base: C1-enolate attacks C6-ketone (5-atom chain between enolizable C and electrophilic C) → *5-membered ring* β-hydroxy ketone → dehydration → 2-acetylcyclopent-1-ene (or 2-acetylcyclopentenol intermediate). 5- and 6-membered rings are strongly preferred in intramolecular aldol (entropy + ring strain balance). These ring-forming aldols are standard JEE Advanced synthesis problems.',
    img: 'Intramolecular aldol: diketone → 5-membered ring product' },


  // ══ T2 — Reduction Named Reactions (ORGNR-011 – ORGNR-020) ══════════════
  { t: T2, d: 'medium',
    q: 'Clemmensen reduction: conditions, scope, and *one class of substrate* for which it is *unsuitable*.',
    a: 'Conditions: Zn–Hg amalgam + conc. HCl, heat. Scope: reduces C=O (ketone or aldehyde) to $\\ce{CH2}$ — most useful for *aryl ketones* (ArCOR). Unsuitable for *acid-sensitive substrates* (e.g. ketal protecting groups, acid-labile heterocycles, β-lactams) — the strongly acidic HCl destroys them. Choose Wolff–Kishner instead for such substrates.',
    img: null },

  { t: T2, d: 'medium',
    q: 'Wolff–Kishner reduction: conditions and *one class of substrate* for which it is *unsuitable*. Compare with Clemmensen.',
    a: 'Conditions: $\\ce{NH2NH2 . H2O}$ + KOH + ethylene glycol (high-boiling solvent), ~200 °C (Huang Minlon modification). Scope: reduces C=O to $\\ce{CH2}$, same as Clemmensen. Unsuitable for *base-sensitive substrates* (e.g. esters, amides, α,β-unsaturated carbonyl that may undergo Michael addition under basic conditions). Clemmensen: acidic; Wolff–Kishner: basic — the two are complementary.',
    img: null },

  { t: T2, d: 'hard',
    q: 'Rosenmund reduction vs Stephen reduction: both give an aldehyde from a different starting material. Tabulate: starting material, reagent, product, key limitation.',
    a: '| | Rosenmund | Stephen |\n|---|---|---|\n| Starting material | Acid chloride RCOCl | Nitrile RCN |\n| Reagent | H₂/Pd–BaSO₄ | SnCl₂/HCl/ether |\n| Product | Aldehyde RCHO | Aldehyde RCHO |\n| Limitation | May over-reduce to RCH₂OH if Pd not properly poisoned | Only for nitriles; slow for aryl nitriles |',
    img: null },

  { t: T2, d: 'hard',
    q: 'Birch reduction (Na or Li + liq. $\\ce{NH3}$ + ROH) reduces benzene rings. Which positions of *anisole* (methoxybenzene) get reduced, and is the product the 1,4- or 2,5-diene? Explain the electronics.',
    a: 'Anisole: $\\ce{-OMe}$ is an *electron-donating* group. Reduction occurs at the positions *not bearing* the substituent (the unsubstituted carbons are more electrophilic toward the solvated electron). Product: **1-methoxycyclohexa-2,5-diene** (double bonds adjacent to OMe, i.e. the OMe-bearing carbon is *not* reduced). Contrast with EWG rings: electron-poor positions reduced, double bonds migrate away from substituent.',
    img: 'Birch of anisole: double bonds next to OMe; Birch of benzoic acid: double bonds away from COOH' },

  { t: T2, d: 'medium',
    q: 'Meerwein–Ponndorf–Verley (MPV) reduction uses $\\ce{Al(OiPr)3}$ to reduce a ketone to an alcohol. What is the actual hydride source and what makes this a *selective* reduction?',
    a: 'Hydride source: the isopropoxide ligand on Al ($\\ce{-OC(CH3)2H}$) transfers H to the ketone carbonyl via a *6-membered cyclic transition state*; the isopropoxide is oxidised to acetone. Only reduces C=O; leaves C=C and other functional groups intact — unlike $\\ce{LiAlH4}$ which reduces most unsaturation. The cyclic TS requires the substrate C=O to coordinate to Al, so it is *chemoselective* for carbonyl reduction.',
    img: null },

  { t: T2, d: 'medium',
    q: 'Bouveault–Blanc reduction (Na + ethanol): which functional group is reduced and what is the product? Why is this method historically important but now obsolete?',
    a: 'Reduces *esters* ($\\ce{RCOOR\'}$) to *primary alcohols* ($\\ce{RCH2OH + R\'OH}$) — same as $\\ce{LiAlH4}$. Historically: first method for reducing esters without pressure hydrogenation (pre-LiAlH₄ era, 1903). Now obsolete: $\\ce{LiAlH4}$ (1947) is far more convenient, faster, and works at RT. Bouveault–Blanc requires excess Na and refluxing alcohol — dangerous and slow.',
    img: null },

  { t: T2, d: 'hard',
    q: 'Catalytic hydrogenation (H₂/Pd–C) reduces both $\\ce{C=C}$ and $\\ce{C=O}$. Which reduces first and why? How do you selectively reduce only $\\ce{C=C}$ in an α,β-unsaturated carbonyl?',
    a: '$\\ce{C=C}$ reduces faster (lower activation energy on Pd surface; alkenes adsorb more readily). $\\ce{C=O}$ (especially ketones) reduces under H₂/Pd only under forcing conditions (higher pressure, Pt catalyst). To reduce *only* $\\ce{C=C}$ in conjugated system: H₂/Pd–C at 1 atm (stops at alkane, but C=O survives if not activated). Note: Raney Ni at high pressure reduces both; Lindlar reduces C≡C to cis-alkene only.',
    img: null },

  { t: T2, d: 'medium',
    q: 'Reduction of a nitrile $\\ce{RCN}$ with $\\ce{LiAlH4}$ gives a primary amine $\\ce{RCH2NH2}$ (net gain: 2H). With $\\ce{SnCl2/HCl}$ (Stephen) it stops at the aldehyde $\\ce{RCHO}$. Write the sequence of functional-group changes $\\ce{RCN ->}$ intermediate $\\ce{->}$ aldehyde for Stephen reduction.',
    a: '$\\ce{RCN}$ + H (from $\\ce{SnCl2/HCl}$) → $\\ce{R-CH=NH}$ (aldimine / Schiff base, one H added) → protonated to $\\ce{R-CH=NH2+ Cl-}$ (aldimine hydrochloride, stable precipitate in dry ether) → $\\ce{H2O}$ workup → $\\ce{R-CH=NH}$ → $\\ce{R-CHO + NH3}$. Net: $\\ce{-C#N + 2H -> -CHO}$ via hydrolysis of the imine.',
    img: null },

  { t: T2, d: 'medium',
    q: '$\\ce{NaBH4}$ reduces an iminium ion $\\ce{R2N+=CHR}$ readily but cannot reduce a simple amide $\\ce{RCONH2}$. Why the difference?',
    a: 'Iminium ion: the carbon bears a *full positive charge* → highly electrophilic → $\\ce{H-}$ from $\\ce{NaBH4}$ attacks easily. Amide: nitrogen lone pair is *delocalised* into the $\\ce{C=O}$ ($\\ce{-C(=O)-NH2 <-> -C(-O-)=NH2+}$) → C is much less electrophilic; also the carbonyl carbon in amide resonance is a poorer electrophile than a ketone. $\\ce{NaBH4}$ is too mild for amide reduction; only $\\ce{LiAlH4}$ does it.',
    img: null },

  { t: T2, d: 'hard',
    q: 'Reductive amination uses $\\ce{NaCNBH3}$ (sodium cyanoborohydride) rather than $\\ce{NaBH4}$ at pH 6–7. Why is $\\ce{NaCNBH3}$ preferred, and what is the sequence of events?',
    a: '$\\ce{RCHO + R\'NH2 ->}$ (pH 6) $\\ce{-> R-CH=NR\' (imine)} ->$ $\\ce{NaCNBH3 -> R-CH2NHR\'}$ (secondary amine). $\\ce{NaCNBH3}$ is a *milder* hydride than $\\ce{NaBH4}$: at pH 6–7 it reduces iminium ions/imines selectively but *not* aldehydes or ketones directly (whereas $\\ce{NaBH4}$ would reduce the starting aldehyde before the imine forms). Selectivity: iminium $\\gg$ carbonyl at mild pH.',
    img: null },


  // ══ T3 — Halide & Carbon-Skeleton Reactions (ORGNR-021 – ORGNR-030) ═════
  { t: T3, d: 'medium',
    q: 'Wurtz reaction ($\\ce{2RX + 2Na -> R-R + 2NaX}$): why is it useless for making *unsymmetrical* alkanes (e.g. $\\ce{CH3-C2H5}$)?',
    a: 'With two different alkyl halides $\\ce{RX + R\'X + 2Na}$: three products form — $\\ce{R-R}$, $\\ce{R-R\'}$, and $\\ce{R\'-R\'}$ (statistical mixture). Separating $\\ce{RR\'}$ from $\\ce{RR}$ and $\\ce{R\'R\'}$ is impractical. Hence Wurtz is only useful for *symmetrical* coupling ($\\ce{2RX -> R-R}$). For unsymmetrical coupling, Grignard + alkyl halide (Gilman reagent) or organocuprate coupling is preferred.',
    img: null },

  { t: T3, d: 'medium',
    q: 'Wurtz–Fittig reaction uses $\\ce{ArX + RX + 2Na -> Ar-R}$ (alkylated benzene). In what situation would this be preferred over Friedel–Crafts alkylation?',
    a: 'Friedel–Crafts fails for: (i) deactivated rings ($\\ce{ArNO2, ArCOOH}$), (ii) substrates prone to carbocation rearrangement. Wurtz–Fittig involves a carbanion-like organosodium intermediate (no rearrangement) → gives the *unrearranged* alkylbenzene. It works on rings that resist EAS. Limitation: requires anhydrous conditions; multiple products possible if two aryl halides used.',
    img: null },

  { t: T3, d: 'hard',
    q: 'Kolbe\'s electrolysis (Kolbe electrolysis) vs Kolbe\'s synthesis (Kolbe–Schmitt): these are two *completely different* reactions sharing one name. Distinguish them.',
    a: '**Kolbe electrolysis**: $\\ce{2RCOO- ->}$ (electrolysis, anode) $\\ce{-> R-R + 2CO2 + 2e-}$. Carboxylate anions are oxidised at the anode; decarboxylation gives a radical that couples → symmetrical alkane. **Kolbe–Schmitt synthesis**: $\\ce{PhONa + CO2 ->}$ (125 °C, 5 atm) → sodium salicylate → $\\ce{H3O+}$ → salicylic acid. Completely different: one is electrochemical, one is thermal carboxylation of phenoxide.',
    img: null },

  { t: T3, d: 'hard',
    q: 'Hunsdiecker reaction (Borodine–Hunsdiecker): silver carboxylate $\\ce{RCOOAg + Br2}$ → $\\ce{RBr + CO2 + AgBr}$. How does the carbon count change, and what type of radical mechanism operates?',
    a: 'The product $\\ce{RBr}$ has *one fewer carbon* than the starting acid $\\ce{RCOOH}$ (decarboxylation). Mechanism: radical chain — $\\ce{RCOOAg + Br2 -> RCOOBR + AgBr}$; $\\ce{RCOO-Br -> RCOO• + Br•}$; $\\ce{RCOO• -> R• + CO2}$; $\\ce{R• + Br2 -> RBr + Br•}$. Used to convert $\\ce{RCOOH -> RBr}$ (one C shorter). Important for degradative chain shortening in synthesis.',
    img: null },

  { t: T3, d: 'medium',
    q: 'Williamson synthesis: $\\ce{R\'ONa + RX -> R\'OR}$. Why must the alkyl halide $\\ce{RX}$ be *primary*, and what happens if you try to make $\\ce{t-BuOEt}$ by Williamson with t-BuBr + NaOEt?',
    a: 'Williamson is SN2 → requires *primary* (or methyl) $\\ce{RX}$ (backside attack possible). Secondary and tertiary $\\ce{RX}$ undergo E2 elimination with alkoxide (strong base) instead of substitution. $\\ce{t-BuBr + NaOEt}$: bulky base + tertiary substrate → E2 → **isobutylene** + EtOH, *not* t-butyl ethyl ether. To make the *t*-Bu ether, you must reverse: use $\\ce{t-BuONa}$ + primary $\\ce{RX}$ (e.g. EtBr).',
    img: null },

  { t: T3, d: 'medium',
    q: 'Fitting reaction: $\\ce{2ArX + 2Na -> Ar-Ar}$ (biaryl). How does this differ from a crossed Ullmann reaction, and what practical limitation does Fitting share with Wurtz?',
    a: 'Fitting (alkali metal, RT): forms aryl sodium intermediates, harsh conditions, requires anhydrous setup. Ullmann coupling: $\\ce{2ArX ->}$ Cu (Δ) $\\ce{-> Ar-Ar}$ (uses Cu, high temperature, forms C–C via arylcopper radical pathway) — more controlled and used industrially. Both Fitting and Wurtz give *symmetrical* products from a single aryl/alkyl halide; mixing two different halides gives statistical mixtures. Ullmann is now largely replaced by Pd-catalysed cross-coupling (JEE Advanced scope).',
    img: null },

  { t: T3, d: 'hard',
    q: 'Frankland synthesis: $\\ce{2RX + Zn -> R2Zn}$ (dialkylzinc). How is this related to the Reformatsky reaction?',
    a: 'Both involve Zn inserting into a C–halide bond. Frankland: dialkylzinc from alkyl halide + Zn. Reformatsky: *α-bromo ester* + Zn → zinc enolate of ester → nucleophilic addition to aldehyde/ketone. The Reformatsky zinc enolate is essentially a "half-Frankland" species: it has both an organozinc bond and an ester group. The zinc is less reactive than Mg (Grignard) — this lower reactivity is the feature that makes it tolerate other functional groups.',
    img: null },

  { t: T3, d: 'medium',
    q: 'Corey–House synthesis ($\\ce{R2CuLi + R\'X -> R-R\'}$): why is a lithium dialkylcuprate (Gilman reagent) more useful than a Grignard for coupling with secondary alkyl halides?',
    a: 'Grignard + secondary alkyl halide: mostly *E2 elimination* (Grignard is basic enough to deprotonate). Gilman reagent ($\\ce{R2CuLi}$): the Cu(I) makes the organometallic *softer* and less basic → predominantly SN2 → clean C–C coupling even with secondary alkyl halides and vinyl halides. Gilman also reacts with vinyl and aryl halides that are inert to Grignard addition. (JEE Advanced fringe but appears occasionally.)',
    img: null },

  { t: T3, d: 'hard',
    q: '$\\ce{2CH3I + 2Na ->}$ Wurtz $\\ce{-> C2H6}$. Now if you attempt $\\ce{CH3I + C2H5I + 2Na}$, identify *all three* products formed and explain why this proves Wurtz\'s uselessness for mixed synthesis.',
    a: '$\\ce{CH3I + C2H5I + 2Na -> CH3-CH3}$ (ethane) + $\\ce{C2H5-C2H5}$ (butane) + $\\ce{CH3-C2H5}$ (propane) in approximately 1:1:2 ratio (statistical — propane is doubly represented). Separating propane from ethane + butane by distillation at lab scale is impractical. Hence Wurtz with mixed halides cannot selectively synthesise an unsymmetrical alkane — confirms that only $\\ce{2RX -> R-R}$ (symmetrical) is synthetically useful.',
    img: null },

  { t: T3, d: 'medium',
    q: 'Etard reaction: what reagent converts $\\ce{ArCH3}$ directly to $\\ce{ArCHO}$, and how does it differ from what hot $\\ce{KMnO4}$ gives?',
    a: 'Etard: $\\ce{ArCH3 + CrO2Cl2 ->}$ (1,2-dichloroethane) chromium complex → hydrolysis → $\\ce{ArCHO}$ (aromatic aldehyde). Stops at CHO stage. Hot $\\ce{KMnO4}$ on $\\ce{ArCH3}$: over-oxidises → $\\ce{ArCOOH}$ (carboxylic acid). So Etard = controlled oxidation to aldehyde; hot $\\ce{KMnO4}$ = complete oxidation to acid. Etard is selective; $\\ce{KMnO4}$ is not.',
    img: null },


  // ══ T4 — Amine & Diazonium Reactions (ORGNR-031 – ORGNR-040) ════════════
  { t: T4, d: 'hard',
    q: 'Gabriel phthalimide synthesis: write the three steps (phthalimide → potassium phthalimide → N-alkylphthalimide → primary amine) and explain why only *primary amines* can be synthesised by this route.',
    a: 'Step 1: phthalimide + KOH → K-phthalimide (N–H deprotonated; the phthalimide anion is N-nucleophile). Step 2: K-phthalimide + RX (SN2) → N-alkylphthalimide. Step 3: N-alkylphthalimide + $\\ce{N2H4}$ (or KOH/H₂O, hot) → $\\ce{RNH2}$ + phthalic hydrazide (or K₂ phthalate). *Primary only*: N has one H in phthalimide → one substitution possible → one alkyl group on N → primary amine after hydrolysis. Cannot introduce two alkyl groups.',
    img: null },

  { t: T4, d: 'hard',
    q: 'Hoffmann bromamide (Hofmann rearrangement): an amide $\\ce{RCONH2 + Br2 + NaOH -> RNH2 + CO2 + NaBr}$. The product has *one fewer carbon* than the starting amide. Identify the key reactive intermediate.',
    a: 'Key intermediate: *isocyanate* $\\ce{R-N=C=O}$. Steps: (1) $\\ce{Br2 + NaOH}$ converts amide to N-bromoamide; (2) base extracts N–H → *nitrene-like* 1,2-shift → isocyanate ($\\ce{R}$ migrates from C to electron-deficient N); (3) isocyanate + $\\ce{OH-}$ + $\\ce{H2O}$ → carbamic acid → $\\ce{CO2 + RNH2}$. The C=O carbon is lost as $\\ce{CO2}$, leaving a primary amine with one carbon fewer.',
    img: 'Hofmann rearrangement: nitrene intermediate → isocyanate → amine' },

  { t: T4, d: 'medium',
    q: 'Sandmeyer vs Gattermann reaction: both convert $\\ce{ArN2+}$ to $\\ce{ArX}$. State the reagents, and which is more reliable.',
    a: '**Sandmeyer**: $\\ce{ArN2+ + CuCl -> ArCl}$; $\\ce{+ CuBr -> ArBr}$; $\\ce{+ CuCN -> ArCN}$. Uses freshly prepared $\\ce{CuCl/CuBr}$ (Cu⁺ salts). **Gattermann**: uses *Cu powder* (less pure), otherwise same. Sandmeyer is more reliable (purer Cu⁺ gives better yields). Both proceed via aryl radical/aryl cation mechanism with Cu redox. Sandmeyer also works for $\\ce{+ CuCN -> ArCN}$ (Gattermann does not easily give nitriles).',
    img: null },

  { t: T4, d: 'hard',
    q: 'Balz–Schiemann reaction: $\\ce{ArN2+ BF4- ->}$ dry heat $\\ce{-> ArF + BF3 + N2}$. Why is this the *best* route to $\\ce{ArF}$ (fluorobenzene derivatives), and why can\'t you use the Sandmeyer approach with $\\ce{CuF}$?',
    a: '$\\ce{CuF}$ is *insoluble* in water and difficult to handle; also, fluoride is a *poor* ligand for Cu(I) in the Sandmeyer mechanism (Cu prefers softer ligands Cl, Br, CN). The Schiemann method bypasses this: $\\ce{ArN2+ BF4-}$ is an isolable, stable salt that decomposes *thermally* (dry heating) → $\\ce{ArF}$ via an ionic/radical pathway that doesn\'t require Cu. $\\ce{BF3}$ is a stable byproduct. Schiemann is the standard route to fluorinated aromatics in the JEE scope.',
    img: null },

  { t: T4, d: 'medium',
    q: 'Diazotisation: aniline + $\\ce{NaNO2}$ + HCl at 0–5 °C gives aniline diazonium chloride. Why must the temperature be kept below 5 °C?',
    a: 'Diazonium salts are unstable above ~5 °C: $\\ce{ArN2+ + H2O -> ArOH + N2 + H+}$ (hydrolysis to phenol). At 0–5 °C, the diazonium salt is kinetically stable and can be used immediately in coupling or Sandmeyer reactions. Above RT, rapid decomposition yields phenol (an undesired side reaction). The test identifies the temperature limit as a stability, not a reactivity, constraint.',
    img: null },

  { t: T4, d: 'medium',
    q: 'Reduction of diazonium salt with $\\ce{H3PO2}$ (hypophosphorous acid) gives $\\ce{ArH}$ (deamination). Give a synthetic scenario where this is uniquely useful.',
    a: '$\\ce{ArN2+ + H3PO2 -> ArH + N2 + H3PO3}$. Use: the $\\ce{-NH2}$ group directs EAS to ortho/para positions. After using $\\ce{-NH2}$ as a director to install substituents, it can be *removed* by diazotisation → $\\ce{H3PO2}$ reduction → ArH. Example: synthesis of 1,3,5-tribromobenzene (impossible by direct bromination, but done via 2,4,6-tribromoaniline → diazonium → $\\ce{H3PO2}$).',
    img: null },

  { t: T4, d: 'hard',
    q: 'Coupling of diazonium salt with phenol gives an azo dye at alkaline pH, but coupling with aniline occurs at *acidic* pH. Explain the pH difference.',
    a: 'Phenol coupling (alkaline pH, ~8–10): $\\ce{OH-}$ deprotonates phenol → *phenoxide* $\\ce{ArO-}$, which is more electron-rich (better EAS substrate) than neutral phenol. Aniline coupling (acidic pH, ~5–7): at acidic pH, diazonium salt remains stable and aniline is in its *free amine* form (not fully protonated → still electron-donating). At strongly basic pH, the diazonium converts to diazotate (PhN=N–O⁻, unreactive). So phenol needs alkaline conditions; aniline needs mildly acidic.',
    img: null },

  { t: T4, d: 'medium',
    q: 'Carbylamine reaction (isocyanide test) is specific for primary amines. If an unknown compound gives a foul-smelling product with $\\ce{CHCl3/KOH}$, what does this prove — and what does it *not* prove?',
    a: 'Proves: the compound has a *primary amine* group ($\\ce{-NH2}$ directly on C). Does *not* prove: the size, structure, or identity of R (could be any primary amine — aliphatic or aromatic). Cannot distinguish RNH₂ (primary aliphatic) from ArNH₂ (primary aromatic). Also: secondary amines do not give isocyanide; tertiary amines do not react. So a positive test = primary amine present; negative test = not primary amine (or no amine).',
    img: null },

  { t: T4, d: 'hard',
    q: 'Mustard gas ($\\ce{(ClCH2CH2)2S}$) is a bifunctional alkylating agent. Why is it so toxic — and what does this say about SN2 reactivity of β-haloethyl sulfides?',
    a: 'The sulfur lone pair participates in *neighbouring-group participation* (anchimeric assistance): internally displaces one of the $\\ce{-CH2Cl}$ → reactive *sulfonium episulfonium ion* (3-membered ring). This *episulfonium ion* is an extremely reactive alkylating agent → alkylates DNA guanine residues (SN2) → cross-links DNA strands → cell death/mutagenesis. The internal sulfonium formation massively accelerates SN2 compared to a normal secondary alkyl chloride — neighbour-group participation is the key concept.',
    img: null },


  // ══ T5 — Phenol & Aromatic Named Reactions (ORGNR-041 – ORGNR-050) ══════
  { t: T5, d: 'medium',
    q: 'Reimer–Tiemann reaction gives *ortho*-hydroxy aldehyde from phenol. What minor product also forms, and under what condition would the *para* product become major?',
    a: 'Major product: 2-hydroxybenzaldehyde (salicylaldehyde, ortho). Minor product: 4-hydroxybenzaldehyde (para). Para product becomes major when the ortho positions are *sterically blocked* (e.g. 2,6-disubstituted phenols). The dichlorocarbene $\\ce{:CCl2}$ electrophile is not very bulky, so ortho is normally preferred (proximity effect of $\\ce{-O-}$ in basic conditions). Also: a *chloroform excess* and modified base conditions can shift the ratio.',
    img: null },

  { t: T5, d: 'hard',
    q: 'Kolbe–Schmitt synthesis: sodium phenoxide + $\\ce{CO2}$ at 125 °C/5 atm → sodium salicylate. Why is high pressure and temperature necessary, and why does the $\\ce{-CO2H}$ end up ortho (not para)?',
    a: 'High P + T: $\\ce{CO2}$ is a weak electrophile and phenoxide a moderate nucleophile; elevated conditions drive the equilibrium toward carboxylation. Ortho selectivity: $\\ce{Na+}$ ion coordinates to the phenoxide O and to the approaching $\\ce{CO2}$ → *ortho* attack via a 6-membered cyclic TS (cation-directed). At higher T with K counterion (Cs is even larger), the less-crowded para product is favoured (K-phenoxide → para-hydroxybenzoic acid, Fries rule).',
    img: 'Na-directed ortho TS vs K-directed para selectivity in Kolbe-Schmitt' },

  { t: T5, d: 'medium',
    q: 'Fries rearrangement: phenyl acetate + $\\ce{AlCl3}$ → *ortho*- and *para*-hydroxy acetophenone. How does temperature control the ortho/para ratio?',
    a: 'Low T (0–25 °C): thermodynamic control less important, AlCl₃ complex of product stabilises — **para** product predominates (less hindered). High T (100–200 °C): intramolecular rearrangement via an ion-pair in the solvent cage — **ortho** product predominates (proximity effect: the acyl group migrates within the cage to the ortho position). Mnemonic: low T → para; high T → ortho (opposite of what\'s expected!).',
    img: null },

  { t: T5, d: 'hard',
    q: 'Gattermann–Koch reaction: ArH + CO + HCl → ArCHO (with $\\ce{AlCl3 + CuCl}$). Why does this reaction *fail* with phenol and aniline?',
    a: 'The Lewis acid $\\ce{AlCl3}$ forms a very stable complex with the heteroatom lone pairs in phenol ($\\ce{-OH}$) and aniline ($\\ce{-NH2}$): $\\ce{PhOH + AlCl3 -> PhO-AlCl3}$ (coordination) or proton transfer. This ties up $\\ce{AlCl3}$, making it unavailable as catalyst. Also, the strongly activated ring undergoes other EAS reactions preferentially. Gattermann–Koch is best for *electron-neutral to mildly activated rings* (e.g. benzene, alkylbenzenes).',
    img: null },

  { t: T5, d: 'medium',
    q: 'Side-chain chlorination of toluene with $\\ce{Cl2/hν}$ vs ring chlorination with $\\ce{Cl2/FeCl3}$: if you wanted *pure* benzyl chloride from toluene, which conditions would you use, and what impurity would you need to control?',
    a: '$\\ce{Cl2/hν}$: *radical* benzylic chlorination → mainly $\\ce{PhCH2Cl}$ (benzyl chloride) but also $\\ce{PhCHCl2}$ (benzal chloride) and $\\ce{PhCCl3}$ (benzotrichloride) if Cl₂ excess. Control: use exactly 1 equiv. $\\ce{Cl2}$ and stop at low conversion to minimise disubstitution. $\\ce{Cl2/FeCl3}$ gives ring-chlorinated products (chlorotoluenes) — completely wrong. Key: radical conditions (hν) → side chain; ionic Lewis acid → ring.',
    img: null },

  { t: T5, d: 'hard',
    q: 'Azo coupling: $\\ce{ArN2+}$ couples *para* to the activating group on phenol. If the para position is occupied, what happens?',
    a: 'If para is blocked (e.g. para-cresol, $\\ce{4-CH3-C6H4-OH}$): coupling occurs at the *ortho* position (the next most activated site). If *both* ortho and para positions are blocked: coupling does not occur (the ring is too deactivated or sterically inaccessible). This is consistent with EAS ortho/para selectivity — the diazonium ion is a *weak* electrophile, so only the most activated (ortho/para to $\\ce{-OH}$ or $\\ce{-NHR}$) positions react.',
    img: null },

  { t: T5, d: 'medium',
    q: 'Aspirin (acetylsalicylic acid) is made by acetylating salicylic acid with acetic anhydride. What is the purpose of using acetic anhydride (rather than acetic acid), and why is the reaction done in the presence of a trace of $\\ce{H3PO4}$?',
    a: 'Acetic anhydride is a more reactive *acylating agent* than acetic acid (more electrophilic due to the anhydride leaving group). Acetic acid alone reacts too slowly with a phenol under mild conditions. $\\ce{H3PO4}$: provides mild acid catalysis, protonating the carbonyl oxygen of the anhydride → more electrophilic carbonyl → faster O-acylation of phenol. Also prevents N-acetylation if amine impurities are present.',
    img: null },

  { t: T5, d: 'hard',
    q: 'The para-red dye (from coupling of diazonium with β-naphthol) is intensely coloured. What structural feature makes azo dyes coloured?',
    a: 'The $\\ce{-N=N-}$ (azo) group bridges two aromatic rings, creating an *extended conjugated π-system* spanning the entire molecule. The HOMO–LUMO gap drops into the visible range (λ ~430–500 nm → orange/red absorption). Auxochromes ($\\ce{-OH, -NR2, -SO3H}$) on the rings intensify colour by pushing/pulling electron density and further lowering the gap. Without the azo bridge, individual phenol or aniline derivatives absorb only in the UV.',
    img: null },

  { t: T5, d: 'medium',
    q: 'DDT is synthesised by condensation of chlorobenzene with chloral ($\\ce{CCl3CHO}$) in the presence of conc. $\\ce{H2SO4}$. What type of reaction is this and why is DDT banned despite its effectiveness?',
    a: 'This is a *Friedel–Crafts-type electrophilic alkylation* (acid-catalysed condensation — $\\ce{H2SO4}$ protonates the aldehyde carbonyl, generating a carbocation electrophile that attacks the activated chlorobenzene ring). DDT banned: extreme *persistence* in the environment (non-biodegradable, lipophilic, bio-accumulates in fatty tissues up the food chain → thinning of bird eggshells, endocrine disruption). Effectiveness does not override ecological toxicity.',
    img: null },

];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  const ids = CARDS.map((_, i) => `ORGNR-${String(i + 1).padStart(3, '0')}`);
  const clash = await coll.findOne({ flashcard_id: { $in: ids } });
  if (clash) throw new Error(`ID clash: ${clash.flashcard_id}`);

  const now = new Date();
  const docs = CARDS.map((c, i) => ({
    _id: uuidv4(),
    flashcard_id: ids[i],
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

  const byTopic = {};
  docs.forEach(d => { byTopic[d.topic.name] = (byTopic[d.topic.name] || 0) + 1; });
  console.log(`\nPrepared ${docs.length} cards for chapter: ${CHAPTER.id}`);
  for (const [t, n] of Object.entries(byTopic)) console.log(`  · ${t}: ${n}`);

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
