/**
 * Insert Polymers flashcards — 60 cards across 5 topics
 * Chapter: Polymers (Organic Chemistry)
 * Scope: BITSAT / JEE / NEET — memory-based facts
 *
 * Usage:
 *   node scripts/insert_polymers_flashcards.js           # dry run
 *   node scripts/insert_polymers_flashcards.js --apply
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const APPLY = process.argv.includes('--apply');

const CHAPTER = {
  id: 'fc_polymers',
  name: 'Polymers',
  category: 'Organic Chemistry',
};

const T1 = { name: 'Classification of Polymers',          order: 1 };
const T2 = { name: 'Types of Addition Polymers',          order: 2 };
const T3 = { name: 'Types of Condensation Polymers',      order: 3 };
const T4 = { name: 'Molecular Mass & Polymerisation Mechanisms', order: 4 };
const T5 = { name: 'Rubber & Special Polymers',           order: 5 };

const CARDS = [

  // ══ T1 — Classification of Polymers (POLY-001 – POLY-012) ════════════════

  { t: T1, d: 'easy',
    q: 'Name the three types of polymers classified by **source**. Give one example of each.',
    a: '**(a) Natural** — occur in plants/animals: cellulose, starch, natural rubber.\n**(b) Semi-synthetic** — derived from natural polymers: cellulose nitrate, cellulose acetate (rayon).\n**(c) Synthetic** — artificially made: polythene, Buna-S.' },

  { t: T1, d: 'easy',
    q: 'Name the three types of polymers classified by **structure**. State the key structural feature and give one example of each.',
    a: '**(a) Linear** — long, straight chains; e.g. HDP, PVC, nylon.\n**(b) Branched chain** — linear with side branches; e.g. LDP (low density polythene).\n**(c) Cross-linked/Network** — bi/tri-functional monomers joined by covalent bonds; e.g. Bakelite, melamine.' },

  { t: T1, d: 'easy',
    q: 'What are **homopolymers** vs **copolymers**? Give two examples of each.',
    a: '**Homopolymer** — formed from a single type of monomer; e.g. polythene (ethene), neoprene (chloroprene).\n**Copolymer** — formed from two different monomers; e.g. Buna-S (butadiene + styrene), Buna-N (butadiene + acrylonitrile).' },

  { t: T1, d: 'medium',
    q: 'How do **addition polymers** differ from **condensation polymers** in their formation? Give one example of each.',
    a: '**Addition polymers**: monomers with C=C or C≡C bonds add together — **no small molecule is eliminated**; e.g. polythene, PVC.\n**Condensation polymers**: bi/tri-functional monomers react with **elimination of small molecules** (H₂O, HCl, ROH); e.g. nylon, Bakelite, Terylene.' },

  { t: T1, d: 'medium',
    q: 'Name all four categories of polymers based on **molecular forces**. State the key force and give one example for each.',
    a: '**(a) Elastomers** — weakest van der Waals forces; stretchable; e.g. neoprene, Buna-S, Buna-N.\n**(b) Fibres** — strong H-bonds; high tensile strength; e.g. nylon, polyester.\n**(c) Thermoplastics** — intermediate forces; soften on heating; e.g. polythene, PVC.\n**(d) Thermosetting** — covalent cross-links; cannot be remelted; e.g. Bakelite, urea-formaldehyde.' },

  { t: T1, d: 'medium',
    q: 'What is the key difference between **thermoplastic** and **thermosetting** polymers?',
    a: '**Thermoplastics**: intermediate intermolecular forces; can be **repeatedly softened by heat** and hardened on cooling (reversible); e.g. polythene, PVC.\n**Thermosetting**: on heating, undergo extensive cross-linking forming a 3D network — process is **irreversible**; cannot be reused; e.g. Bakelite, urea-formaldehyde resin.' },

  { t: T1, d: 'easy',
    q: 'Name two **biodegradable** and two **non-biodegradable** synthetic polymers. What environmental problem do non-biodegradable polymers cause?',
    a: '**Biodegradable**: PHBV, Nylon-2-nylon-6.\n**Non-biodegradable**: polythene, PVC.\nNon-biodegradable polymers accumulate in soil and water, causing **environmental pollution** — they cannot be broken down by microbes.' },

  { t: T1, d: 'medium',
    q: 'Which category of polymers has the **strongest** intermolecular forces, and why? Which has the weakest?',
    a: '**Strongest → Fibres** (e.g. nylon, polyester): held by strong **hydrogen bonds** between –CO–NH– or –CO–O– groups → high tensile strength.\n**Weakest → Elastomers** (e.g. Buna-S, neoprene): held by only weak van der Waals forces → highly stretchable.' },

  { t: T1, d: 'medium',
    q: 'What type of monomer functionality creates **cross-linked/network** polymers? Why are these polymers always thermosetting?',
    a: '**Bi-functional or tri-functional** monomers. Tri-functional monomers (e.g. phenol in Bakelite, melamine) create 3D cross-links via covalent bonds in all directions.\nThermosetting because the covalent cross-links formed on first heating cannot be broken by reheating → irreversible.' },

  { t: T1, d: 'easy',
    q: 'Is **LDP (Low Density Polythene)** linear, branched, or cross-linked? What conditions are used to make it?',
    a: '**Branched chain** polymer — branches prevent close packing → lower density, less tough.\nConditions: **1000–2000 atm** pressure, **350–570 K**, using a **peroxide initiator** (free radical mechanism).' },

  { t: T1, d: 'medium',
    q: 'What does **PDI = 1** mean for a polymer? Which polymers have PDI = 1 and which have PDI > 1?',
    a: 'PDI = M̄w/M̄n = 1 → **monodisperse** — all polymer chains have the same length (M̄w = M̄n).\n**Natural polymers** (proteins, cellulose, starch) have PDI = 1.\n**Synthetic polymers** have PDI > 1 (polydisperse) — chains vary in length, so M̄w > M̄n.' },

  { t: T1, d: 'hard',
    q: 'Teflon, polystyrene (Styron), and neoprene are all addition polymers. Are they homo- or copolymers? Classify them by molecular forces.',
    a: 'All three are **homopolymers** (single monomer each).\nBy molecular forces:\n**Teflon** → Thermoplastic (high intermolecular forces due to C–F bonds; actually used as thermoplastic)\n**Polystyrene** → Thermoplastic\n**Neoprene** → Elastomer (weakest forces; stretchable rubber)' },

  // ══ T2 — Types of Addition Polymers (POLY-013 – POLY-026) ════════════════

  { t: T2, d: 'easy',
    q: 'What is the monomer, structural repeat unit, and two uses of **Polythene**?',
    a: 'Monomer: **ethene** (CH₂=CH₂).\nRepeat unit: –(CH₂–CH₂)ₙ–.\nUses: insulator, anticorrosive coatings, packing material, household and laboratory wares.' },

  { t: T2, d: 'easy',
    q: 'What is the monomer and two uses of **Polystyrene (Styron)**?',
    a: 'Monomer: **styrene** (vinyl benzene, CH₂=CH–C₆H₅).\nUses: insulator, wrapping materials, manufacture of toys and household articles.' },

  { t: T2, d: 'easy',
    q: 'What is the monomer and two uses of **PVC (Polyvinyl chloride)**?',
    a: 'Monomer: **vinyl chloride** (CH₂=CHCl).\nUses: raincoats, handbags, vinyl flooring, leather clothes.' },

  { t: T2, d: 'easy',
    q: 'What is the full name, monomer, and two uses of **PTFE (Teflon)**?',
    a: 'Full name: **Polytetrafluoroethylene**.\nMonomer: tetrafluoroethene (CF₂=CF₂).\nUses: non-stick cookware, lubricant, insulator.' },

  { t: T2, d: 'easy',
    q: 'What is the full name, monomer, and use of **PMMA (Plexiglass)**?',
    a: 'Full name: **Polymethyl methacrylate**.\nMonomer: methyl methacrylate (CH₂=C(CH₃)COOCH₃).\nUses: substitute for glass, decorative materials.' },

  { t: T2, d: 'easy',
    q: 'What is the full name, monomer, and use of **Orlon (Acrilan)**?',
    a: 'Full name: **Polyacrylonitrile**.\nMonomer: vinyl cyanide / acrylonitrile (CH₂=CHCN).\nUses: synthetic fibres, synthetic wool.' },

  { t: T2, d: 'easy',
    q: 'What is the monomer of **Neoprene** and what are its uses? Is it a homo- or copolymer?',
    a: 'Monomer: **chloroprene** (2-chloro-1,3-butadiene, CH₂=C(Cl)–CH=CH₂).\n**Homopolymer** (one monomer).\nUses: conveyor belts, printing rollers, insulator. It is an **elastomer**.' },

  { t: T2, d: 'easy',
    q: 'What are the two monomers of **Buna-S (SBR)** and what is it used for?',
    a: 'Monomers: **(a) buta-1,3-diene** + **(b) styrene** (C₆H₅CH=CH₂).\nCopolymer.\nUses: automobile tyres, footwear, bubble gums.' },

  { t: T2, d: 'easy',
    q: 'What are the two monomers of **Buna-N (NBR)** and what is it used for?',
    a: 'Monomers: **(a) buta-1,3-diene** + **(b) acrylonitrile** (CH₂=CHCN).\nCopolymer.\nUses: oil seals, hoses and tank linings.' },

  { t: T2, d: 'medium',
    q: 'What are the key differences between **HDP** (High Density Polythene) and **LDP** (Low Density Polythene) in terms of structure, conditions, catalyst, and properties?',
    a: '**LDP**: 1000–2000 atm, 350–570 K, peroxide initiator → **branched** structure → lower density, less tough, less hard.\n**HDP**: 6–7 atm, 333–343 K, Ziegler-Natta catalyst [Al(C₂H₅)₃ + TiCl₄] in hydrocarbon solvent → **linear** structure → higher density, tougher, harder.' },

  { t: T2, d: 'medium',
    q: 'What exactly is the **Ziegler-Natta catalyst** and in which polymerisation process is it used?',
    a: '**TiCl₄ + Al(C₂H₅)₃** (titanium tetrachloride + triethylaluminium).\nUsed in making **HDP (High Density Polythene)** at low pressure (6–7 atm) in hydrocarbon solvent at 333–343 K.' },

  { t: T2, d: 'medium',
    q: 'How is **vinyl chloride** (monomer of PVC) manufactured from ethylene in industry?',
    a: 'By adding **HCl to ethylene** (C₂H₄) in presence of **Hg²⁺ salts** (mercuric salt catalyst):\nCH₂=CH₂ + HCl → CH₂=CHCl (vinyl chloride).\n(Alternative: oxychlorination of ethylene with Cl₂ in industrial scale.)' },

  { t: T2, d: 'medium',
    q: 'Which addition polymer makes **non-stick cookware**, which makes **synthetic wool**, and which makes **bulletproof windows**?',
    a: '**Non-stick cookware** → PTFE (Teflon).\n**Synthetic wool** → Polyacrylonitrile (Orlon/Acrilan).\n**Bulletproof windows** → Lexan (polycarbonate) — though Lexan is actually a condensation polymer (polyester).\n\nNote: Teflon and Orlon are both addition polymers; Lexan is condensation.' },

  { t: T2, d: 'hard',
    q: 'Identify the addition polymer: (a) monomer CF₂=CF₂ — (b) monomer CH₂=CHCN — (c) monomer CH₂=CHCl — (d) monomer CH₂=C(CH₃)COOCH₃.',
    a: '(a) **PTFE (Teflon)** — polytetrafluoroethylene.\n(b) **Polyacrylonitrile (Orlon)** — synthetic wool.\n(c) **PVC** — polyvinyl chloride.\n(d) **PMMA (Plexiglass)** — polymethyl methacrylate.' },

  // ══ T3 — Types of Condensation Polymers (POLY-027 – POLY-042) ════════════

  { t: T3, d: 'easy',
    q: 'What are the two monomers and two uses of **Terylene (Dacron)**?',
    a: 'Monomers:\n**(a) Ethylene glycol** (ethane-1,2-diol, HO–CH₂–CH₂–OH)\n**(b) Terephthalic acid** (benzene-1,4-dicarboxylic acid).\nUses: wash-and-wear fabrics, tyre cords, safety belts, tents, sails.' },

  { t: T3, d: 'easy',
    q: 'What are the two monomers and use of **Glyptal (alkyl resin)**?',
    a: 'Monomers:\n**(a) Ethylene glycol** + **(b) phthalic acid**.\nUse: binding material in preparation of mixed plastics and paints.' },

  { t: T3, d: 'easy',
    q: 'What is the single monomer of **Nylon-6 (Perlon)** and how is it polymerised? Give two uses.',
    a: 'Monomer: **caprolactam** (a 7-membered cyclic amide).\nPolymerisation: **ring-opening polymerisation** (not a condensation in the classical sense — no molecule eliminated).\nUses: fibres, plastics, tyre cords, ropes.' },

  { t: T3, d: 'easy',
    q: 'What are the two monomers of **Nylon-6,6** and its uses?',
    a: 'Monomers:\n**(a) Adipic acid** [HO–CO–(CH₂)₄–CO–OH]\n**(b) Hexamethylenediamine** [H₂N–(CH₂)₆–NH₂].\nUses: synthetic fibres, parachutes, ropes, carpets, bristles for brushes, substitute for metal in bearings/gears.' },

  { t: T3, d: 'easy',
    q: 'What are the two monomers of **Bakelite** and what type of polymer is it? Give two uses.',
    a: 'Monomers: **(a) Formaldehyde** (HCHO) + **(b) phenol** (C₆H₅OH).\n**Cross-linked (thermosetting)** 3D network polymer.\nUses: gears, protective coatings, electrical fittings, switches.' },

  { t: T3, d: 'easy',
    q: 'What are the two monomers and use of **Urea-formaldehyde resin**?',
    a: 'Monomers: **(a) Formaldehyde** (HCHO) + **(b) urea** (NH₂CONH₂).\nUses: unbreakable cups, laminated sheets.' },

  { t: T3, d: 'easy',
    q: 'What is **Melmac**? What are its two monomers and uses?',
    a: 'Melmac = **Melamine-formaldehyde resin**.\nMonomers: **(a) Melamine** + **(b) formaldehyde** (HCHO).\nUses: plastic crockery, unbreakable cups and plates.' },

  { t: T3, d: 'medium',
    q: 'What are the two monomers and use of **Kelvar**? What type of polymer is it?',
    a: 'Monomers: **(a) Terephthalic acid** + **(b) 1,4-diaminobenzene** (p-phenylenediamine).\n**Aromatic polyamide** (amide linkage –CO–NH–).\nUse: making **bulletproof vests**.' },

  { t: T3, d: 'medium',
    q: 'What are the two monomers and uses of **Lexan (polycarbonate)**?',
    a: 'Monomers: **(a) Diethyl carbonate** + **(b) bisphenol-A**.\n**Polyester/polycarbonate** (ester linkage).\nUses: bulletproof windows, safety helmets.' },

  { t: T3, d: 'medium',
    q: 'What linkage is present in **polyamides** vs **polyesters**? Give two examples of each.',
    a: '**Polyamides**: **amide linkage** (–CO–NH–); e.g. Nylon-6, Nylon-6,6, Kelvar.\n**Polyesters**: **ester linkage** (–CO–O–); e.g. Terylene/Dacron, Glyptal.\nBoth are condensation polymers formed by elimination of H₂O.' },

  { t: T3, d: 'medium',
    q: 'What is **PHBV** (write its full form)? What are its two monomers and uses? Is it biodegradable?',
    a: 'Full form: **Poly-β-hydroxybutyrate-co-β-hydroxyvalerate**.\nMonomers:\n**(a) β-Hydroxybutanoic acid** (CH₃CHOHCH₂COOH)\n**(b) β-Hydroxypentanoic acid** (CH₃CH₂CHOHCH₂COOH).\nUses: packaging, orthopaedic devices, controlled drug release.\n**Yes — biodegradable** (bacterial degradation).' },

  { t: T3, d: 'medium',
    q: 'What is **Nylon-2-nylon-6**? What are its two monomers and uses? Is it biodegradable?',
    a: 'Monomers:\n**(a) Glycine** (H₂NCH₂COOH)\n**(b) Aminocaproic acid** [H₂N(CH₂)₅COOH].\nUses: nylon ropes, fishing nets, parachutes.\n**Yes — biodegradable** (enzymatic hydrolysis of amide bonds).' },

  { t: T3, d: 'medium',
    q: 'What is the difference between **Nylon-6** and **Nylon-6,6** in terms of monomers, polymerisation type, and what "6,6" means?',
    a: '**Nylon-6**: single monomer (caprolactam) → ring-opening polymerisation.\n**Nylon-6,6**: two monomers (adipic acid + hexamethylenediamine) → condensation (water eliminated).\n"6,6" means **6 carbons in each monomer unit**. Both produce –CO–NH– (amide) linkages.' },

  { t: T3, d: 'hard',
    q: 'Is Nylon-6,6 an elastomer, fibre, thermoplastic, or thermosetting polymer? Why is confusing it with elastomers a common BITSAT trap?',
    a: '**Fibre** — strong H-bonds between –CO–NH– groups give high tensile strength.\n**BITSAT trap**: nylon contains the word "elastic" in its hosiery uses (crinkled nylon for elastic hosiery), but it is NOT an elastomer. Elastomers have the weakest forces; fibres have the strongest. Never mark nylon as elastomer.' },

  { t: T3, d: 'medium',
    q: 'Why can **Bakelite** not be reused after moulding? What happens when it is reheated?',
    a: 'Bakelite is **thermosetting**. On first heating, phenol + formaldehyde form an extensive **3D cross-linked (covalent) network** via CH₂ bridges.\nReheating cannot break these covalent cross-links → **irreversible hardening** → cannot be reshaped or reused.' },

  { t: T3, d: 'hard',
    q: 'Match: Novolac and Bakelite → which category? What is the difference between them?',
    a: 'Both belong to **phenol-formaldehyde polymer** category.\n**Novolac**: linear polymer (excess phenol, acid catalyst) — requires a curing agent (hexamethylenetetramine) to cross-link.\n**Bakelite**: cross-linked polymer (excess formaldehyde, base catalyst) — directly forms 3D network on heating.' },

  // ══ T4 — Molecular Mass & Polymerisation Mechanisms (POLY-043 – POLY-052) ═

  { t: T4, d: 'easy',
    q: 'Write the formula for **number average molecular mass (M̄ₙ)** and state the experimental method to measure it.',
    a: '**M̄ₙ = ΣNᵢMᵢ / ΣNᵢ**\nwhere Nᵢ = number of molecules with molecular mass Mᵢ.\nMeasured by: **osmotic pressure** method (colligative property).' },

  { t: T4, d: 'easy',
    q: 'Write the formula for **weight average molecular mass (M̄w)** and state the experimental method to measure it.',
    a: '**M̄w = ΣNᵢMᵢ² / ΣNᵢMᵢ**\nMeasured by: **light scattering** and **ultracentrifugation** methods.' },

  { t: T4, d: 'medium',
    q: 'What is **PDI** (Polydispersity Index)? Write its formula. What does PDI = 1 and PDI > 1 each indicate?',
    a: '**PDI = M̄w / M̄n**.\nPDI = 1 → **monodisperse** → all chains have same length (M̄w = M̄n) → natural polymers.\nPDI > 1 → **polydisperse** → chains vary in length (M̄w > M̄n) → synthetic polymers.' },

  { t: T4, d: 'medium',
    q: 'Name the **three steps of free radical addition polymerisation** and the typical initiator used.',
    a: '**(i) Initiation**: alkyl peroxide (RCOO–OOCR) decomposes by homolysis → free radicals (R•); R• adds to monomer → activated monomer.\n**(ii) Propagation**: chain grows by successive monomer additions.\n**(iii) Termination**: two chain radicals combine → dead polymer.\nInitiator: **alkyl peroxide / benzoyl peroxide**.' },

  { t: T4, d: 'medium',
    q: 'In **cationic polymerisation**, what catalyst is used and what is the propagating species? Give one example.',
    a: 'Catalyst: **Lewis/Brønsted acid** (H₂SO₄ or BF₃ + H₂O).\nPropagating species: **carbocation (C⁺)**.\nExample: polymerisation of isobutylene (2-methylpropene) initiated by H₂SO₄ → poly(isobutylene).\nTermination: loss of H⁺.' },

  { t: T4, d: 'medium',
    q: 'In **anionic polymerisation**, what catalyst is used and what is the propagating species? Give one example.',
    a: 'Catalyst: **KNH₂** or other alkali metal amides (strong nucleophile/base).\nPropagating species: **carbanion (C⁻)**.\nExample: polymerisation of acrylonitrile (CH₂=CHCN) with KNH₂.\nTermination: addition of H⁺.' },

  { t: T4, d: 'medium',
    q: 'A polymer has M̄ₙ = 30,000 and M̄w = 40,000. Calculate PDI and determine whether it is a natural or synthetic polymer.',
    a: '**PDI = M̄w / M̄n = 40,000 / 30,000 = 4/3 ≈ 1.33**.\nPDI > 1 → **polydisperse** → **synthetic polymer**.\n(Natural polymers have PDI = 1; this sample has chains of varying lengths.)' },

  { t: T4, d: 'hard',
    q: 'A sample has 30% molecules with M = 20,000; 40% with M = 30,000; 30% with M = 60,000. Calculate **M̄ₙ** and **M̄w**.',
    a: '**M̄ₙ** = ΣNᵢMᵢ/ΣNᵢ = (0.3×20,000 + 0.4×30,000 + 0.3×60,000)/1 = **36,000**.\n**M̄w** = ΣNᵢMᵢ²/ΣNᵢMᵢ = (0.3×20,000² + 0.4×30,000² + 0.3×60,000²)/36,000\n= (1.2×10⁸ + 3.6×10⁸ + 10.8×10⁸)/36,000 = **43,333**.\nSo M̄ₙ = 36,000; M̄w = 43,333 → PDI = 43,333/36,000 ≈ 1.2.' },

  { t: T4, d: 'medium',
    q: 'What colligative property is used to find **M̄ₙ** and which two physical methods measure **M̄w**?',
    a: '**M̄ₙ** → **osmotic pressure** (colligative — depends on number of particles).\n**M̄w** → **light scattering** + **ultracentrifugation** (these weight larger chains more heavily).' },

  { t: T4, d: 'medium',
    q: 'What exactly is the **Ziegler-Natta catalyst** and what unique advantage does it offer over free radical polymerisation?',
    a: 'Catalyst: **TiCl₄ + Al(C₂H₅)₃** (titanium tetrachloride + triethylaluminium).\nAdvantage: operates at **low pressure (6–7 atm)** and gives a **linear, stereoregular** polymer (HDP) with predictable molecular mass distribution — unlike high-pressure free radical process which gives branched chains (LDP).' },

  // ══ T5 — Rubber & Special Polymers (POLY-053 – POLY-060) ═════════════════

  { t: T5, d: 'easy',
    q: 'What is **natural rubber**? What is its monomer, configuration at double bonds, and classification?',
    a: 'Natural rubber = **cis-1,4-polyisoprene**.\nMonomer: **isoprene** (2-methylbuta-1,3-diene, CH₂=C(CH₃)–CH=CH₂).\nConfiguration: **cis** at every double bond → gives elastic properties.\nClassification: straight chain addition polymer; an **elastomer**.' },

  { t: T5, d: 'medium',
    q: 'What is **vulcanisation of rubber**? What reagents and conditions are used, and what does it achieve?',
    a: 'Process: natural rubber is heated with **sulphur (S₈)** + **ZnO** (catalyst) at **373–415 K**.\nSulphur atoms form **cross-links (sulphur bridges)** at reactive double bond sites between polymer chains.\nResult: rubber becomes **stiffer, stronger, harder, more elastic**, less sticky, and more resistant to temperature changes.' },

  { t: T5, d: 'medium',
    q: 'What type of intermolecular forces are present in **natural rubber** vs **vulcanised rubber**? How does this explain the property difference?',
    a: '**Natural rubber**: weak van der Waals forces between chains → soft, sticky, loses shape easily.\n**Vulcanised rubber**: **three-dimensional covalent cross-links** (sulphur bridges) → hard, strong, retains shape, highly elastic.\nThe covalent S–S bridges restrict chain slippage while allowing elastic deformation.' },

  { t: T5, d: 'medium',
    q: 'What is the difference between **cis-1,4-polyisoprene** and **trans-1,4-polyisoprene**? What is the common name of each?',
    a: '**cis-1,4-polyisoprene** = **Natural rubber** — elastic, soft, gummy; cis-configuration prevents chain packing.\n**trans-1,4-polyisoprene** = **Gutta-percha** — hard, non-elastic, brittle; trans-configuration allows better chain packing.\nKey: Natural rubber has cis configuration at every double bond (NCERT fact, BITSAT favourite).' },

  { t: T5, d: 'medium',
    q: 'Name the two **biodegradable synthetic polymers** from NCERT. What are their full forms and what makes them environmentally superior to conventional plastics?',
    a: '**(a) PHBV** — Poly-β-hydroxybutyrate-co-β-hydroxyvalerate: undergoes bacterial degradation.\n**(b) Nylon-2-nylon-6** — biodegradable polyamide: undergoes enzymatic hydrolysis of amide bonds.\nSuperior because: unlike polythene/PVC, these break down into non-toxic products without persisting in soil/water.' },

  { t: T5, d: 'medium',
    q: 'What are **biologically compatible (biocompatible) polymers**? Give two examples with their medical applications.',
    a: 'Polymers functionalised with biological surface-reactive moieties for medical use.\n**(a) Hydrogel** [poly(methyl methacrylate) + free –OH groups]: used in **contact lenses** — hydrophilic → lubricates the eye.\n**(b) Moderately hydrophilic polymers** (capped with ring-opening polymerisation groups): used in **dental impressions** — wets oral tissue but doesn\'t form hydrous pockets.' },

  { t: T5, d: 'easy',
    q: 'Which polymer is used in **contact lenses** and why is that specific structural feature essential?',
    a: '**Hydrogel** — poly(methyl methacrylate) with free **alcohol (–OH) groups** attached.\nThe –OH groups make it **hydrophilic** → absorbs water → permits easy lubrication of the eye → comfortable to wear.\nWithout –OH groups, PMMA is too hydrophobic for contact lens use.' },

  { t: T5, d: 'hard',
    q: 'Identify each polymer from its description: (i) Ziegler-Natta catalyst, low pressure — (ii) Buta-1,3-diene + styrene copolymer — (iii) Biodegradable, monomers are β-hydroxy acids — (iv) cis-1,4-polyisoprene — (v) Bulletproof vests.',
    a: '(i) **HDP** (High Density Polythene).\n(ii) **Buna-S** (SBR — Styrene-Butadiene Rubber).\n(iii) **PHBV** (Poly-β-hydroxybutyrate-co-β-hydroxyvalerate).\n(iv) **Natural rubber**.\n(v) **Kelvar** (aromatic polyamide from terephthalic acid + 1,4-diaminobenzene).' },

];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const coll = mongoose.connection.db.collection('flashcards');

  const ids = CARDS.map((_, i) => `POLY-${String(i + 1).padStart(3, '0')}`);

  // Clash check
  const clash = await coll.findOne({ flashcard_id: { $in: ids } });
  if (clash) throw new Error(`ID clash detected: ${clash.flashcard_id} already exists`);

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
      tags: [c.t.name, CHAPTER.name, 'BITSAT'],
      source: 'Canvas Chemistry',
      class_num: 12,
      created_at: now,
      updated_at: now,
    },
    deleted_at: null,
  }));

  const byTopic = {};
  docs.forEach(d => { byTopic[d.topic.name] = (byTopic[d.topic.name] || 0) + 1; });

  console.log(`\nPrepared ${docs.length} cards for chapter: ${CHAPTER.id} (${CHAPTER.category})`);
  for (const [t, n] of Object.entries(byTopic)) console.log(`  · ${t}: ${n}`);

  if (APPLY) {
    const r = await coll.insertMany(docs, { ordered: false });
    console.log(`\n✅ Inserted ${r.insertedCount} cards.`);
  } else {
    console.log('\n(dry run — pass --apply to insert)');
  }

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
