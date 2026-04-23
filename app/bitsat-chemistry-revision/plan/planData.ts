import { Phase, Day, Resource, GROUP_ORDER, KIND_GROUP } from '../planTypes';

export const TOTAL_DAYS = 30;

export const yt = (id: string, start?: number): string =>
    `https://www.youtube.com/embed/${id}${start ? `?start=${start}` : ''}`;
export const pdf = (driveId: string): string =>
    `https://drive.google.com/file/d/${driveId}/preview`;

export const PHASES: Phase[] = [
    {
        id: 'phase1',
        label: 'Phase 1 · The "Deleted" Goldmine',
        days: 'Days 1–7',
        goal: 'Secure the ~30 marks that everyone else is losing.',
        accent: 'text-red-400',
        gradient: 'from-red-500/20 via-orange-500/10 to-transparent',
        icon: 'Layers',
        items: [
            {
                day: 1,
                title: 'Solid State — Crystal Lattices',
                focus: 'Bravais lattices, packing efficiency, density formula. BITSAT loves "glass properties" and FCC vs BCC density questions.',
                tip: 'Memorise z = 1, 2, 4 for SC, BCC, FCC by heart.',
                checklist: [
                    'Memorise z = 1, 2, 4 for SC, BCC, FCC.',
                    'Packing efficiency formulas for the three cubic types.',
                    'FCC vs BCC density derivation.',
                ],
                resources: [
                    { label: 'Crash Course — Lecture 1', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('0K9cPDaex-Q') },
                    { label: 'Crash Course — Lecture 2', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('MbkBw_25flA') },
                    { label: 'Solid State Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('11XN4k6SsM5Ah-3XIUPB6HcKes1xx49oO') },
                    { label: 'Solid State Flashcards', href: '/chemistry-flashcards/solid-state', kind: 'flashcards' },
                ],
            },
            {
                day: 2,
                title: 'Solid State — Defects & Magnetic',
                focus: 'Schottky vs Frenkel, F-centres, ferro/ferri/anti-ferromagnetism, semiconductor doping.',
                checklist: [
                    'Schottky vs Frenkel — when each applies.',
                    'F-centre definition and colour explanation.',
                    'Ferro / ferri / anti-ferro magnetism distinctions.',
                ],
                resources: [
                    { label: 'Defects One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('vR50K7Qnrm8') },
                    { label: 'Crash Course — Lecture 3', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('qCtrDH3vdTk') },
                    { label: 'Crash Course — Lecture 4', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('hIGYm9aXwrY') },
                    { label: 'Solid State Flashcards', href: '/chemistry-flashcards/solid-state', kind: 'flashcards' },
                ],
            },
            {
                day: 3,
                title: 'Polymers + Chemistry in Everyday Life',
                focus: 'Addition vs condensation, monomers of Nylon-6, Nylon-6,6, Bakelite, PDI calculation — then drug classification: antihistamines, antacids, sweeteners (Aspartame vs Saccharin), antiseptics vs disinfectants.',
                tip: 'BITSAT asked PDI numericals in 2024. Both chapters are short and high-yield — clean them in one session.',
                checklist: [
                    'Addition vs condensation polymerisation.',
                    'Monomers of Nylon-6, Nylon-6,6, Bakelite.',
                    'Walk through a PDI numerical.',
                ],
                resources: [
                    { label: 'Polymers One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('uOHeVhjFg2M') },
                    { label: 'Polymers Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1ik9tKOvOObojUyD-t4e8RpvNY7j7lZT2') },
                    { label: 'Everyday Life One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('CiHMGlxPPoM') },
                    { label: 'Detailed Lecture', href: 'https://youtu.be/iQsHsZihMX0', kind: 'crash-course', embedUrl: yt('iQsHsZihMX0') },
                    { label: 'Everyday Life Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1mCmQeRceffKaLWELnSmlT2bpg2qQzaKd') },
                ],
            },
            {
                day: 4,
                title: 'Environmental Chemistry + Periodicity',
                focus: 'Ozone depletion (UV-B), greenhouse gases ranking, BOD/COD, photochemical smog vs classical smog — then periodic trends: atomic radius, IE, EA, electronegativity.',
                checklist: [
                    'Greenhouse gases ranked by GWP.',
                    'BOD vs COD distinction.',
                    'Atomic radius / IE / EA / EN trends across period + group.',
                ],
                resources: [
                    { label: 'Environmental One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('GKUEh6FIGUY') },
                    { label: 'Detailed Lecture', href: 'https://youtu.be/uMpBuEUEHY8', kind: 'crash-course', embedUrl: yt('uMpBuEUEHY8') },
                    { label: 'Environmental Chemistry Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1QqRBpk9oZY0mrcC36gQ6N2ChYZWTPof1') },
                    { label: 'Periodicity One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('p-NdkOfm0tQ', 1) },
                    { label: 'Periodic Properties Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1XiM6xCyB7k8Ot6_6uJXGibtoHXClSRkO') },
                    { label: 'Interactive Periodic Table', href: '/interactive-periodic-table', kind: 'periodic' },
                    { label: 'Periodic Trends', href: '/periodic-trends', kind: 'trends' },
                    { label: 'Inorganic Trends Flashcards', href: '/chemistry-flashcards/most-important-inorganic-trends', kind: 'flashcards' },
                ],
            },
            {
                day: 5,
                title: 'Chemical Bonding',
                focus: 'VBT vs MOT for O₂ and F₂, VSEPR geometry, hybridisation shortcuts, formal charge, resonance structures.',
                tip: 'Bond order from MOT: O₂ = 2, N₂ = 3, F₂ = 1 — BITSAT asks this directly.',
                checklist: [
                    'MOT for O₂ and F₂ — memorise bond order.',
                    'VSEPR geometries through expanded octet.',
                    'Formal charge & resonance practice set.',
                ],
                resources: [
                    { label: 'Chemical Bonding One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('YYRoWfl3O8s') },
                    { label: 'Chemical Bonding Lecture', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('yMpD6PEFjmw', 3092) },
                    { label: 'Chemical Bonding Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1S_tc52Ia108IEWTiRojPDLiZu0EJIjfi') },
                    { label: 'Bonding Quick Recap', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1WBTKroyODuB9i6W2R6loBAfMUF9YJxZb') },
                    { label: 'Chemical Bonding Flashcards', href: '/chemistry-flashcards/most-important-inorganic-trends', kind: 'flashcards' },
                ],
            },
            {
                day: 6,
                title: 's-Block — Group 1 & 2 Anomalies',
                focus: 'Diagonal relationship, solubility trends, Li anomaly, Be anomaly, lattice/hydration enthalpy logic.',
                checklist: [
                    'Diagonal relationship — Li/Mg, Be/Al anomalies.',
                    'Lattice vs hydration enthalpy — solubility logic.',
                    'Flame test colours for alkali metals.',
                ],
                resources: [
                    { label: 's-Block One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('zmnRASd0GhA') },
                    { label: 's-Block Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1KtSpn3o1jg379BWeP8VmKjohyqoPe3GP') },
                    { label: 'Interactive Periodic Table', href: '/interactive-periodic-table', kind: 'periodic' },
                ],
            },
            {
                day: 7,
                title: 'Metallurgy',
                focus: 'Ore names per metal, froth-flotation depressants, Ellingham diagram intuition, electrolytic refining cathode/anode.',
                checklist: [
                    'Common ores per metal (Fe, Cu, Al, Zn, Hg).',
                    'Froth flotation depressants.',
                    'Ellingham diagram — when does the line cross?',
                ],
                resources: [
                    { label: 'Metallurgy One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('2XWd2XsZMyo') },
                    { label: 'Ellingham Diagram', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('nFAob7yxwNM') },
                    { label: 'Metallurgy Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('18QSAqxCor5xibarUu1askEeVfThudu3e') },
                    { label: 'Metallurgy Flashcards', href: '/chemistry-flashcards/metallurgy', kind: 'flashcards' },
                ],
            },
        ],
    },
    {
        id: 'phase2',
        label: 'Phase 2 · The Calculation Heavyweight',
        days: 'Days 8–17',
        goal: 'Build no-calculator stamina for Physical Chemistry.',
        accent: 'text-emerald-400',
        gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
        icon: 'Calculator',
        items: [
            {
                day: 8,
                title: 'Atomic Structure — Quantum Numbers',
                focus: 'Bohr model edge-cases, de Broglie, Heisenberg, photoelectric numerical patterns.',
                checklist: [
                    'Bohr radius + energy formulae — units ready.',
                    'de Broglie and Heisenberg numericals.',
                    'Photoelectric effect: work function problems.',
                ],
                resources: [
                    { label: 'Atomic Structure One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('_fOi9q31vHQ', 7313) },
                    { label: 'Atomic in 18 Min', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('l6Q-Z18DdSg') },
                    { label: 'Atomic Structure Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1P09Ze_DwfSyla-klmuP9JF3Qby1GakP9') },
                    { label: 'Atomic Structure Flashcards', href: '/chemistry-flashcards/atomic-structure', kind: 'flashcards' },
                ],
            },
            {
                day: 9,
                title: 'Chemical Kinetics — Order & Rate',
                focus: 'Pseudo-first-order, integrated rate laws, half-life with awkward numbers (e.g. t½ = 10.1 min).',
                tip: 'Round once, calculate, round again.',
                checklist: [
                    'Integrated rate law for 1st-order and 2nd-order.',
                    'Half-life with awkward t values — approximation drill.',
                    'Pseudo-first-order conditions.',
                ],
                resources: [
                    { label: 'Kinetics One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('ns2zwlXgwCw') },
                    { label: 'Kinetics Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('10S4kxF-cRE0dUKEzu2VNQERf4R68pn6Z') },
                    { label: 'Kinetics Flashcards', href: '/chemistry-flashcards/chemical-kinetics', kind: 'flashcards' },
                ],
            },
            {
                day: 10,
                title: 'Kinetics — Arrhenius & Mechanisms',
                focus: 'Activation energy two-temperature problems, catalyst effect, molecularity vs order.',
                checklist: [
                    'Arrhenius two-temperature problem.',
                    'Catalyst effect on Ea.',
                    'Molecularity vs order — know the difference.',
                ],
                resources: [
                    { label: 'Kinetics One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('ns2zwlXgwCw') },
                    { label: 'Kinetics Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('10S4kxF-cRE0dUKEzu2VNQERf4R68pn6Z') },
                    { label: 'Kinetics Flashcards', href: '/chemistry-flashcards/chemical-kinetics', kind: 'flashcards' },
                ],
            },
            {
                day: 11,
                title: 'Thermodynamics — Laws & Processes',
                focus: 'Reversible vs irreversible work, Carnot cycle efficiency, Hess law shortcuts.',
                checklist: [
                    'Work done: reversible vs irreversible isothermal.',
                    'Carnot efficiency formula.',
                    'Hess law chained enthalpies.',
                ],
                resources: [
                    { label: 'Thermodynamics One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('GLBB7iwpJMw') },
                    { label: 'Top 50 Concepts', href: '/top-50-concepts', kind: 'top50' },
                ],
            },
            {
                day: 12,
                title: 'Thermodynamics — Spontaneity',
                focus: '∆G, ∆S of universe, Gibbs–Helmholtz, coupling reactions.',
                checklist: [
                    '∆G = ∆H − T∆S — sign logic for spontaneity.',
                    '∆S of universe = ∆S(sys) + ∆S(surr).',
                    'Coupled-reactions question pattern.',
                ],
                resources: [
                    { label: 'Thermodynamics One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('GLBB7iwpJMw') },
                    { label: 'Top 50 Concepts', href: '/top-50-concepts', kind: 'top50' },
                ],
            },
            {
                day: 13,
                title: 'Solutions — Colligative Properties',
                focus: 'van\'t Hoff factor, abnormal molar mass, Raoult deviations, osmotic pressure numericals.',
                checklist: [
                    'van\'t Hoff factor — when and why.',
                    'Raoult positive vs negative deviations.',
                    'Osmotic pressure numerical.',
                ],
                resources: [
                    { label: 'Crash Course — Lecture 1', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('iaL2uo2yrA8') },
                    { label: 'Crash Course — Lecture 2', href: '/one-shot-lectures', kind: 'crash-course', embedUrl: yt('W0DOYAVl-vs') },
                    { label: 'Solutions Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1qyIOR1Y5aMQP12a_n6iYwJIsxZjJUWp7') },
                    { label: 'Solutions Flashcards', href: '/chemistry-flashcards/solutions', kind: 'flashcards' },
                ],
            },
            {
                day: 14,
                title: 'Equilibrium — Ionic & Chemical',
                focus: 'Kc/Kp, Le Chatelier shifts, buffer pH (Henderson), Ksp common-ion effect.',
                checklist: [
                    'Kc vs Kp — when they differ.',
                    'Henderson buffer pH formula.',
                    'Ksp with common-ion effect.',
                ],
                resources: [
                    { label: 'Solutions Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1qyIOR1Y5aMQP12a_n6iYwJIsxZjJUWp7') },
                    { label: 'Ksp Calculator', href: '/solubility-product-ksp-calculator', kind: 'physical' },
                ],
            },
            {
                day: 15,
                title: 'Redox + Electrochemistry — Cells',
                focus: 'Oxidation number rules, balancing in acidic/basic medium (ion-electron method), disproportionation — then EMF, Nernst at non-standard log values, Kohlrausch law, electrolysis quantitative problems.',
                tip: 'Assign oxidation numbers first — every Redox and Electrochemistry question in BITSAT starts here. Memorise log 2 = 0.30, log 3 = 0.48.',
                checklist: [
                    'Oxidation-number assignment — no shortcuts.',
                    'Nernst with awkward log values.',
                    'Electrolysis: Faraday quantitative pattern.',
                ],
                resources: [
                    { label: 'Electrochemistry One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('rewf5tsVEAU') },
                    { label: 'Electrochemistry Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1hHYRF_B5mZLnZKy_GEy0Cb4RYBmDjnfj') },
                    { label: 'Top 50 Concepts', href: '/top-50-concepts', kind: 'top50' },
                    { label: 'Electrochemistry Flashcards', href: '/chemistry-flashcards/electrochemistry', kind: 'flashcards' },
                ],
            },
            {
                day: 16,
                title: 'Electrochemistry — Conductance',
                focus: 'Molar/equivalent conductivity, transport number, fuel cells, corrosion electrochemistry.',
                checklist: [
                    'Molar vs equivalent conductivity at infinite dilution.',
                    'Transport number concept.',
                    'Fuel cell & corrosion basics.',
                ],
                resources: [
                    { label: 'Electrochemistry One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('rewf5tsVEAU') },
                    { label: 'Electrochemistry Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1hHYRF_B5mZLnZKy_GEy0Cb4RYBmDjnfj') },
                    { label: 'Electrochemistry Flashcards', href: '/chemistry-flashcards/electrochemistry', kind: 'flashcards' },
                ],
            },
            {
                day: 17,
                title: 'Surface Chemistry',
                focus: 'Adsorption isotherms (Freundlich, Langmuir), colloids classification, Hardy-Schulze, emulsions.',
                checklist: [
                    'Freundlich vs Langmuir isotherm.',
                    'Hardy-Schulze rule.',
                    'Emulsion types and stabilisers.',
                ],
                resources: [
                    { label: 'Complete Chapter', href: 'https://www.youtube.com/watch?v=RPm8j0lMUQQ&list=PL12uTDKbp7xV-1dMuUYRfm-MQgBi3zPlC', kind: 'crash-course', embedUrl: 'https://www.youtube.com/embed/RPm8j0lMUQQ?list=PL12uTDKbp7xV-1dMuUYRfm-MQgBi3zPlC' },
                    { label: 'Practice 45 MCQ', href: 'https://youtu.be/S1eZfIb5dWw', kind: 'oneshot', embedUrl: yt('S1eZfIb5dWw') },
                    { label: 'Surface Chemistry Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1A-BcI6wcUqadh3ki3xrQdS5XS5jXIkgL') },
                    { label: 'Surface Chemistry Flashcards', href: '/chemistry-flashcards/surface-chemistry', kind: 'flashcards' },
                ],
            },
        ],
    },
    {
        id: 'phase3',
        label: 'Phase 3 · The Mechanistic Deep-Dive',
        days: 'Days 18–25',
        goal: 'Multi-step Organic + niche Inorganic trivia.',
        accent: 'text-purple-400',
        gradient: 'from-purple-500/20 via-fuchsia-500/10 to-transparent',
        icon: 'Microscope',
        items: [
            {
                day: 18,
                title: 'GOC — Resonance & Hyperconjugation',
                focus: 'Stability orderings, +M / −M groups, electrophile/nucleophile strength.',
                checklist: [
                    'Stability orderings — carbocation, carbanion, radical.',
                    '+M / −M effect — which groups.',
                    'Electrophile vs nucleophile ranking.',
                ],
                resources: [
                    { label: 'GOC One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('yg_xIkyGtxg') },
                    { label: 'GOC Handwritten Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('11vnQB7wHZeQAdKp4d27NzLAicgsnM1QO') },
                    { label: 'GOC & POC Flashcards', href: '/chemistry-flashcards/goc-and-poc', kind: 'flashcards' },
                ],
            },
            {
                day: 19,
                title: 'Stereochemistry — Fischer & Newman',
                focus: 'R/S assignment, E/Z, optical activity, meso identification — appeared 3–4 times in Session 1.',
                checklist: [
                    'R/S assignment protocol — priority rules.',
                    'E/Z labelling on alkenes.',
                    'Identify meso vs enantiomer pairs.',
                ],
                resources: [
                    { label: 'Stereo Top 20 MCQ', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('Ilcx5-TDIsA') },
                    { label: 'Stereochemistry Flashcards', href: '/chemistry-flashcards/stereochemistry', kind: 'flashcards' },
                ],
            },
            {
                day: 20,
                title: 'Hydrocarbons + Halides',
                focus: 'Markovnikov / anti-Markovnikov, SN1 vs SN2, E1 vs E2, free-radical chain.',
                checklist: [
                    'Markovnikov vs anti-Markovnikov — when each applies.',
                    'SN1 vs SN2 — substrate, solvent, nucleophile.',
                    'E1 vs E2 — conditions and products.',
                ],
                resources: [
                    { label: 'Haloalkanes Flashcards', href: '/chemistry-flashcards/haloalkanes', kind: 'flashcards' },
                    { label: 'Name Reactions', href: '/organic-name-reactions', kind: 'name-rxns' },
                    { label: 'Organic Wizard', href: '/organic-wizard', kind: 'wizard' },
                ],
            },
            {
                day: 21,
                title: 'Alcohols, Phenols, Ethers',
                focus: 'Lucas test, Williamson synthesis, Reimer-Tiemann, Kolbe — high-yield mechanism questions.',
                checklist: [
                    'Lucas test — 1° / 2° / 3° differentiation.',
                    'Williamson synthesis mechanism.',
                    'Reimer-Tiemann & Kolbe — reagents and products.',
                ],
                resources: [
                    { label: 'Alcohols Flashcards', href: '/chemistry-flashcards/alcohols-phenols-ethers', kind: 'flashcards' },
                    { label: 'Name Reactions', href: '/organic-name-reactions', kind: 'name-rxns' },
                    { label: '2-Min Chemistry', href: '/2-minute-chemistry', kind: 'twomin' },
                ],
            },
            {
                day: 22,
                title: 'Aldehydes, Ketones, Acids',
                focus: 'Aldol vs Cannizzaro, HVZ, Clemmensen vs Wolff-Kishner, decarboxylation.',
                checklist: [
                    'Aldol vs Cannizzaro — α-H presence.',
                    'HVZ reagent and product.',
                    'Clemmensen vs Wolff-Kishner — conditions.',
                ],
                resources: [
                    { label: 'Aldehydes Flashcards', href: '/chemistry-flashcards/aldehydes-ketones-acids', kind: 'flashcards' },
                    { label: 'Name Reactions', href: '/organic-name-reactions', kind: 'name-rxns' },
                    { label: 'Organic Wizard', href: '/organic-wizard', kind: 'wizard' },
                ],
            },
            {
                day: 23,
                title: 'Amines + Biomolecules',
                focus: 'Hofmann vs Saytzeff, diazonium salts, peptide linkages, anomeric carbon, DNA vs RNA bases.',
                tip: 'Know Fe oxidation state in deoxymyoglobin (+2) — asked in Session 1.',
                checklist: [
                    'Hofmann vs Saytzeff — which one favours which.',
                    'Diazonium salt — major reactions.',
                    'Anomeric carbon + peptide linkage identification.',
                ],
                resources: [
                    { label: 'Amines One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('bLhQJYmZDos') },
                    { label: 'Biomolecules One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('PnwNgp7HUeg') },
                    { label: 'Biomolecules Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1mAWd4AAKevz8CeNQUwIZ3_dIXa0UwpxI') },
                    { label: 'Amines Flashcards', href: '/chemistry-flashcards/amines', kind: 'flashcards' },
                    { label: 'Biomolecules Flashcards', href: '/chemistry-flashcards/biomolecules', kind: 'flashcards' },
                ],
            },
            {
                day: 24,
                title: 'Coordination Compounds',
                focus: 'IUPAC naming, CFT splitting, magnetic moment, isomerism, EAN rule.',
                checklist: [
                    'IUPAC naming — ligand priority + charge.',
                    'CFT splitting: strong-field vs weak-field.',
                    'Magnetic moment calculation from unpaired electrons.',
                ],
                resources: [
                    { label: 'Coordination One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('X_sLzR_ZFfI', 194) },
                    { label: 'Coordination Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('14BiqjbfPBn415hfyYoHew-ba0JzVShqm') },
                    { label: 'Coordination Flashcards', href: '/chemistry-flashcards/coordination-compounds', kind: 'flashcards' },
                ],
            },
            {
                day: 25,
                title: 'p-Block + d/f-Block trivia',
                focus: 'High-yield trends, lanthanide contraction consequences, KMnO₄/K₂Cr₂O₇ reactions, interhalogens.',
                checklist: [
                    'Lanthanide contraction — 3 consequences.',
                    'KMnO₄ and K₂Cr₂O₇ in acidic / basic / neutral.',
                    'Interhalogen types and bond count.',
                ],
                resources: [
                    { label: 'p-Block G13 & G14 One-Shot', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('agvzhBBhsLY') },
                    { label: 'All Structures of p-Block', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('9A-5gd9Q8os') },
                    { label: 'Top 30 Trends Video', href: '/one-shot-lectures', kind: 'oneshot', embedUrl: yt('7myt2pUILzM') },
                    { label: 'p-Block Revision Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('12-aOxkpqWop0YiuzllAJoDwwdkITs5z2') },
                    { label: 'p-Block G13/14 Flashcards', href: '/chemistry-flashcards/p-block-group-13-14', kind: 'flashcards' },
                    { label: 'p-Block G15–18 Flashcards', href: '/chemistry-flashcards/p-block-elements-g15-18', kind: 'flashcards' },
                    { label: 'Periodic Trends', href: '/periodic-trends', kind: 'trends' },
                ],
            },
        ],
    },
    {
        id: 'phase4',
        label: 'Phase 4 · The Chaos Simulation',
        days: 'Days 26–30',
        goal: 'Speed drills, practical chemistry sprint, full revision.',
        accent: 'text-amber-400',
        gradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
        icon: 'Flame',
        items: [
            {
                day: 26,
                title: 'Mock 1 + Speed Drill',
                focus: 'Solve 30 Chemistry questions in 25 minutes. Practise WITHOUT the "Mark for Review" mindset — track doubts on paper.',
                checklist: [
                    '30 Chemistry Qs in 25 min — timed.',
                    'Track doubts on paper, not mentally.',
                    'Review all flashcards once before sleep.',
                ],
                resources: [
                    { label: 'BITSAT Speed Drill', href: '#', kind: 'comingsoon' },
                    { label: 'All Flashcards', href: '/chemistry-flashcards', kind: 'flashcards' },
                ],
            },
            {
                day: 27,
                title: 'Deleted-Syllabus + Practical Chemistry Sprint',
                focus: 'Re-flip Polymers, Solid State, Everyday Chemistry, Environmental, s-Block flashcards (1 hour). Then: functional group tests, Lassaigne\'s test, salt analysis — Group I–VI cations and common anions.',
                tip: 'Salt analysis in BITSAT is always systematic. Learn the group reagents cold.',
                checklist: [
                    'Flip deleted-syllabus flashcards — 1 hour.',
                    'Group I–VI cation reagents cold.',
                    'Functional-group tests — memorise.',
                ],
                resources: [
                    { label: 'Chemistry Flashcards', href: '/chemistry-flashcards', kind: 'flashcards' },
                    { label: 'Handwritten Notes', href: '/handwritten-notes', kind: 'notes' },
                    { label: 'Practical Chemistry Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1RE4rn9q9GG6aUErhYNa5hn5Ap64oWIQl') },
                    { label: 'POC PYQs', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('1Xn9MuZaujfZ7WvLjACA75s5uKDPE1SgR') },
                    { label: 'Salt Analysis Notes', href: '/handwritten-notes', kind: 'notes', embedUrl: pdf('13C3ZHftBbn6zuskkHa8WJrKLWtM5k74b') },
                    { label: 'Salt Analysis Simulator', href: '/salt-analysis', kind: 'salt' },
                    { label: 'Salt Analysis Flashcards', href: '/chemistry-flashcards/salt-analysis', kind: 'flashcards' },
                ],
            },
            {
                day: 28,
                title: 'Mock 2 + Inorganic Trivia Sprint',
                focus: 'Full Chemistry section. Then 1 hour on Periodic Trends + Inorganic Hub for "anomaly" questions.',
                checklist: [
                    'Full-length Chemistry mock.',
                    'Drill Periodic Trends for "anomaly" Qs.',
                    'Log every wrong answer to a sheet.',
                ],
                resources: [
                    { label: 'BITSAT Mock Test', href: '#', kind: 'comingsoon' },
                    { label: 'Periodic Trends', href: '/periodic-trends', kind: 'trends' },
                    { label: 'Interactive Periodic Table', href: '/interactive-periodic-table', kind: 'periodic' },
                ],
            },
            {
                day: 29,
                title: 'Organic Mechanism Sprint',
                focus: 'Re-run all Name Reactions + Organic Wizard. Focus on multi-step conversions.',
                checklist: [
                    'Re-run every Name Reaction — under 10 min.',
                    'Multi-step conversion drill — 5 pairs.',
                    'Flag any mechanism you still need to memorise.',
                ],
                resources: [
                    { label: 'BITSAT Speed Drill', href: '#', kind: 'comingsoon' },
                    { label: 'Name Reactions', href: '/organic-name-reactions', kind: 'name-rxns' },
                    { label: 'Organic Wizard', href: '/organic-wizard', kind: 'wizard' },
                ],
            },
            {
                day: 30,
                title: 'Final Mock + Strategy Lock',
                focus: 'One full mock under exam conditions. No phone. No calculator. Lock your skip rule + bonus rule.',
                tip: 'Sleep 8 hours tonight. Trust the prep.',
                checklist: [
                    'Full mock — exam conditions, no phone, no calculator.',
                    'Lock your skip rule and bonus rule.',
                    'Sleep 8 hours. Trust the prep.',
                ],
                resources: [
                    { label: 'BITSAT Full Mock', href: '#', kind: 'comingsoon' },
                    { label: 'Top 50 Concepts', href: '/top-50-concepts', kind: 'top50' },
                    { label: '2-Minute Chemistry', href: '/2-minute-chemistry', kind: 'twomin' },
                ],
            },
        ],
    },
];

export const ALL_DAYS: Day[] = PHASES.flatMap((p: Phase) => p.items);

export function phaseForDay(dayNum: number): Phase | undefined {
    return PHASES.find((p: Phase) => p.items.some((d: Day) => d.day === dayNum));
}

export function dayByNumber(dayNum: number): Day | undefined {
    return ALL_DAYS.find((d: Day) => d.day === dayNum);
}

// --- Module-level progress helpers -------------------------------------

export function moduleId(dayNum: number, resourceIndex: number): string {
    return `${dayNum}-${resourceIndex}`;
}

// Only resources a user can actually mark complete. "Coming Soon" resources
// are inert in the UI and are excluded from the day's denominator.
export function isCompletableKind(kind: string): boolean {
    return kind !== 'comingsoon';
}

export function completableModuleIdsForDay(dayNum: number): string[] {
    const day = dayByNumber(dayNum);
    if (!day) return [];
    return day.resources
        .map((r, i) => (isCompletableKind(r.kind) ? moduleId(dayNum, i) : null))
        .filter((v): v is string => v !== null);
}

export function completableCountForDay(dayNum: number): number {
    return completableModuleIdsForDay(dayNum).length;
}

// The order resources appear to the user in the right-hand panel: grouped
// by Videos → Notes → Flashcards → Tools → Coming Soon, preserving original
// order within each group. Auto-advance on completion must follow this
// order, not the raw resources[] index.
export function visualResourceOrder(resources: Resource[]): number[] {
    const order: number[] = [];
    for (const group of GROUP_ORDER) {
        resources.forEach((r, i) => {
            if (KIND_GROUP[r.kind] === group) order.push(i);
        });
    }
    return order;
}
