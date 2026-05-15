// Chapter metadata for /handwritten-notes/[chapter] SEO pages.
// `chapterName` MUST match the values produced by classifyChapter()
// in app/lib/handwrittenNotesData.ts — that's how we filter notes per page.

export type ChapterSubject = 'Organic' | 'Inorganic' | 'Physical' | 'Practical';

export interface BestTool {
    href: string;
    label: string;
    tagline: string;
}

export interface ChapterMeta {
    slug: string;
    chapterName: string;
    classLevel: 11 | 12;
    /**
     * Position in the NCERT old-syllabus chapter list.
     * Integers 1–14 → Class 11 chapters in NCERT order (Some Basic Concepts = 1, Environmental Chemistry = 14).
     * Integers 15–30 → Class 12 chapters in NCERT order (Solid State = 15, Chemistry in Everyday Life = 30).
     * Decimal values (e.g. 13.5) place "extras" — sub-topics or practicals that
     * aren't a separate NCERT chapter — directly after their parent chapter.
     */
    ncertChapterNumber: number;
    subject: ChapterSubject;
    seoTitle: string;
    h1: string;
    metaDescription: string;
    leadParagraph: string;
    overview: string[];
    crucibleChapterId: string | null;
    bestTool: BestTool;
    relatedSlugs: string[];
    faqs: Array<{ q: string; a: string }>;
    /**
     * Slug used by /download-ncert-books/class-{classLevel}/{ncertBooksSlug}.
     * Verified against the NCERT books Google Sheet on 2026-05-06; only set
     * when the deep page actually exists (chapters removed from the new
     * NCERT syllabus — Solid State, States of Matter, Surface Chemistry,
     * Metallurgy, Environmental Chemistry — leave this undefined and the
     * cross-link section is omitted on those pages).
     */
    ncertBooksSlug?: string;
    /**
     * Slug used by /ncert-solutions/class-{classLevel}/{ncertSolutionsSlug}.
     * Same verification approach — only present when the page exists.
     */
    ncertSolutionsSlug?: string;
}

const FLASHCARDS: BestTool = {
    href: '/chemistry-flashcards',
    label: 'Chemistry Flashcards',
    tagline: 'Spaced-repetition flashcards covering every key term, formula, and reaction across all chapters.',
};

const ORGANIC_WIZARD: BestTool = {
    href: '/organic-wizard',
    label: 'Organic Wizard',
    tagline: 'Predict products, classify mechanisms, and stress-test your understanding of organic reactions.',
};

const PERIODIC_TRENDS: BestTool = {
    href: '/periodic-trends',
    label: 'Periodic Trends Visualizer',
    tagline: 'See atomic radius, ionisation enthalpy, electron affinity, and electronegativity gradients across the table.',
};

const PERIODIC_TABLE: BestTool = {
    href: '/interactive-periodic-table',
    label: 'Interactive Periodic Table',
    tagline: 'Tap any element to see configuration, oxidation states, key compounds, and exam shortcuts.',
};

const SALT_SIM: BestTool = {
    href: '/salt-analysis',
    label: 'Salt Analysis Simulator',
    tagline: 'Run a virtual cation/anion test scheme step-by-step — exactly as you would in the lab.',
};

const KSP_CALC: BestTool = {
    href: '/solubility-product-ksp-calculator',
    label: 'Ksp Calculator',
    tagline: 'Solve solubility-product, common-ion, and selective-precipitation numericals in seconds.',
};

const CHAPTERS: ChapterMeta[] = [
    // ─── Class 11 Physical ──────────────────────────────────────────────
    {
        slug: 'mole-concept',
        chapterName: 'Mole Concept',
        classLevel: 11,
        ncertChapterNumber: 1,
        subject: 'Physical',
        seoTitle: 'Mole Concept Handwritten Notes PDF — Class 11 Chemistry | JEE & NEET',
        h1: 'Mole Concept — Handwritten Notes',
        metaDescription: 'Free Mole Concept handwritten notes by Paaras Sir for Class 11 Chemistry, JEE Main, JEE Advanced, and NEET. Stoichiometry, concentration units, equivalent concept, and limiting-reagent problems with worked examples.',
        leadParagraph: 'Mole Concept is the foundation of every Physical Chemistry numerical you will solve in Class 11, JEE, and NEET. These handwritten notes by Paaras Sir cover stoichiometry, concentration units, the equivalent concept, and limiting-reagent problems with the exact tricks that show up in PYQs.',
        overview: [
            'Laws of chemical combination, significant figures, and accuracy vs precision',
            'Concentration units — molarity, molality, mole fraction, ppm, normality',
            'Empirical and molecular formula determination from combustion analysis',
            'Equivalent concept, n-factor, and limiting-reagent stoichiometry',
        ],
        crucibleChapterId: 'ch11_mole',
        bestTool: FLASHCARDS,
        relatedSlugs: ['atomic-structure', 'periodic-properties', 'thermodynamics'],
        faqs: [
            { q: 'Are these Mole Concept notes enough for JEE Main?', a: 'Yes for theory, formulas, and standard problem patterns. Pair them with the Crucible question bank to drill speed and PYQ-style numericals — that combination is what closes the gap to JEE Main.' },
            { q: 'Do the notes cover the equivalent concept and n-factor?', a: 'Yes. The equivalent concept is fully derived for acids, bases, redox systems, and salts, with n-factor rules for each category and worked stoichiometry examples.' },
            { q: 'Is the law of equivalents covered for redox titrations?', a: 'Yes — the notes show how to apply N1V1 = N2V2 across acid–base, redox (KMnO4, K2Cr2O7), and iodometric titrations with worked examples.' },
        ],
        ncertBooksSlug: 'ncert-some-basic-concepts-of-chemistry-mole',
        ncertSolutionsSlug: 'some-basic-concepts-of-chemistry',
    },
    {
        slug: 'atomic-structure',
        chapterName: 'Atomic Structure',
        classLevel: 11,
        ncertChapterNumber: 2,
        subject: 'Physical',
        seoTitle: 'Atomic Structure Handwritten Notes PDF — Class 11 | JEE & NEET',
        h1: 'Atomic Structure — Handwritten Notes',
        metaDescription: 'Free Atomic Structure handwritten notes by Paaras Sir for Class 11 Chemistry, JEE Main, JEE Advanced, and NEET. Bohr model, photoelectric effect, quantum numbers, and de-Broglie–Heisenberg with derivations.',
        leadParagraph: 'Atomic Structure rewards conceptual depth — Bohr\'s model, the photoelectric effect, and quantum numbers all appear yearly in JEE and NEET. These handwritten notes by Paaras Sir derive every formula from first principles and highlight the trick PYQs that students miss.',
        overview: [
            'Sub-atomic particle discovery, Thomson and Rutherford models, atomic mass concepts',
            'Bohr\'s atomic model — radius, velocity, energy formulas; line spectra of hydrogen',
            'Photoelectric effect, Planck\'s quantum theory, and the de-Broglie wavelength',
            'Quantum numbers, electronic configuration rules, and orbital probability graphs',
        ],
        crucibleChapterId: 'ch11_atom',
        bestTool: PERIODIC_TABLE,
        relatedSlugs: ['mole-concept', 'periodic-properties', 'chemical-bonding'],
        faqs: [
            { q: 'Are these Atomic Structure notes enough for JEE Advanced?', a: 'For theory and standard problem patterns — yes. JEE Advanced often layers Bohr-model and photoelectric concepts together, so practice mixed problems on the Crucible after revising these notes.' },
            { q: 'Do the notes derive Bohr\'s formulas from first principles?', a: 'Yes. Radius, velocity, and energy of the nth orbit are derived from the centripetal-electrostatic balance, with shortcuts for hydrogen-like ions.' },
            { q: 'Are wavefunction and probability graphs covered?', a: 'Yes — radial and angular probability graphs for s, p, and d orbitals are sketched, with nodes and the position-of-maximum-probability tricks that appear in JEE.' },
        ],
        ncertBooksSlug: 'ncert-structure-of-atom',
        ncertSolutionsSlug: 'structure-of-atom',
    },
    {
        slug: 'periodic-properties',
        chapterName: 'Periodic Properties',
        classLevel: 11,
        ncertChapterNumber: 3,
        subject: 'Physical',
        seoTitle: 'Periodic Properties Handwritten Notes PDF — Class 11 | JEE & NEET',
        h1: 'Periodic Properties — Handwritten Notes',
        metaDescription: 'Free Periodic Properties handwritten notes by Paaras Sir for Class 11 Chemistry, JEE Main, JEE Advanced, and NEET. Atomic radius, ionisation enthalpy, electron affinity, electronegativity trends with anomalies.',
        leadParagraph: 'Periodic Properties is dense with trends and exceptions — atomic radius, ionisation enthalpy, electron affinity, electronegativity, and metallic character all carry anomalies that show up in JEE and NEET PYQs. These handwritten notes by Paaras Sir cover every trend with the anomalies highlighted.',
        overview: [
            'Modern periodic law, IUPAC nomenclature for elements with Z > 100',
            'Atomic and ionic radii — periodic trends and lanthanide contraction',
            'Ionisation enthalpy and electron affinity with anomalies (N, O, F)',
            'Electronegativity scales (Pauling, Mulliken), oxide character, diagonal relationship',
        ],
        crucibleChapterId: 'ch11_periodic',
        bestTool: PERIODIC_TRENDS,
        relatedSlugs: ['atomic-structure', 'chemical-bonding', 'p-block'],
        faqs: [
            { q: 'Are all anomalies in ionisation enthalpy covered?', a: 'Yes — N vs O, Be vs B, and the second-period vs third-period exceptions are explained with the underlying electronic-configuration logic.' },
            { q: 'Do the notes cover diagonal relationship?', a: 'Yes. Li↔Mg, Be↔Al, B↔Si diagonal relationships are tabulated with the property comparisons most likely to appear in MCQs.' },
            { q: 'Is the lanthanide contraction discussed?', a: 'Yes — the cause and its consequences for the d-block (Zr/Hf similarity, decreasing basicity) are covered briefly here and expanded in the d & f Block chapter.' },
        ],
        ncertBooksSlug: 'ncert-periodic-properties',
        ncertSolutionsSlug: 'classification-of-elements-and-periodicity-in-properties',
    },
    {
        slug: 'chemical-bonding',
        chapterName: 'Chemical Bonding',
        classLevel: 11,
        ncertChapterNumber: 4,
        subject: 'Physical',
        seoTitle: 'Chemical Bonding Handwritten Notes PDF — Class 11 | JEE & NEET',
        h1: 'Chemical Bonding — Handwritten Notes',
        metaDescription: 'Free Chemical Bonding handwritten notes by Paaras Sir for Class 11 Chemistry, JEE Main, JEE Advanced, and NEET. VBT, hybridisation, VSEPR, MOT, dipole moment, and Fajan\'s rules with diagrams.',
        leadParagraph: 'Chemical Bonding is the highest-yield Class 11 chapter for JEE and NEET — VBT, hybridisation, VSEPR, MOT, and dipole moments all appear every year. These handwritten notes by Paaras Sir cover each theory with the molecule-by-molecule predictions students are tested on.',
        overview: [
            'Ionic bonding, lattice energy (Born–Haber cycle), and Fajan\'s rules',
            'VSEPR theory and hybridisation — geometry of every common molecule and ion',
            'Dipole moment, polarity, and resonance with bond-length/strength comparisons',
            'Molecular orbital theory (MOT) for diatomics — bond order, magnetic behaviour',
        ],
        crucibleChapterId: 'ch11_bonding',
        bestTool: {
            href: '/inorganic-chemistry-hub/vsepr',
            label: 'VSEPR Geometry Reference',
            tagline: 'Look up the predicted geometry, bond angle, and hybridisation for any molecule in seconds.',
        },
        relatedSlugs: ['periodic-properties', 'atomic-structure', 'coordination-compounds'],
        faqs: [
            { q: 'Are MOT diagrams included for O2, N2, and NO?', a: 'Yes — MO diagrams for homonuclear (B2 through Ne2) and heteronuclear (NO, CO) diatomics are drawn with bond-order calculation and magnetic behaviour highlighted.' },
            { q: 'Do the notes cover VSEPR for expanded octets?', a: 'Yes. VSEPR is applied to molecules like SF4, IF7, and XeOF4 — including lone-pair placement and bond-angle deviations.' },
            { q: 'Is back bonding explained?', a: 'Yes. Back bonding in BF3, B(OH)3, and silicon halides is covered with the consequences for bond length and Lewis acidity.' },
        ],
        ncertBooksSlug: 'ncert-chemical-bonding',
        ncertSolutionsSlug: 'chemical-bonding-and-molecular-structure',
    },
    {
        slug: 'thermodynamics',
        chapterName: 'Thermodynamics',
        classLevel: 11,
        ncertChapterNumber: 6,
        subject: 'Physical',
        seoTitle: 'Thermodynamics Handwritten Notes PDF — Class 11 | JEE & NEET',
        h1: 'Thermodynamics — One-Shot Handwritten Notes',
        metaDescription: 'Free Thermodynamics handwritten notes by Paaras Sir for Class 11 Chemistry, JEE Main, JEE Advanced, and NEET. First law, enthalpy, entropy, Gibbs free energy, and Hess\'s law with worked examples.',
        leadParagraph: 'Thermodynamics is the most formula-heavy chapter in Class 11 Physical Chemistry, and the one where small sign errors cost the most marks. These handwritten one-shot notes by Paaras Sir cover the first law, enthalpy, entropy, and Gibbs free energy with sign conventions clearly laid out.',
        overview: [
            'System–surroundings, state functions, work and heat sign conventions',
            'First law of thermodynamics — applications to isothermal, adiabatic, and isobaric processes',
            'Enthalpy of reaction, Hess\'s law, bond enthalpy, and lattice/solution enthalpy cycles',
            'Entropy, second law, Gibbs free energy, and spontaneity (with temperature dependence)',
        ],
        crucibleChapterId: 'ch11_thermo',
        bestTool: FLASHCARDS,
        relatedSlugs: ['chemical-bonding', 'ionic-equilibrium', 'chemical-kinetics'],
        faqs: [
            { q: 'Are sign conventions clearly explained for work and heat?', a: 'Yes. The IUPAC sign convention (w = -P_ext·ΔV, q positive for absorbed heat) is used throughout, with explicit worked examples for compression vs expansion.' },
            { q: 'Are Hess\'s law and Born–Haber cycles covered?', a: 'Yes. Hess\'s law is applied to enthalpy of formation, combustion, and bond-enthalpy problems. Born–Haber cycles are detailed for ionic-solid lattice-energy calculations.' },
            { q: 'Is the second law and entropy explained intuitively?', a: 'Yes — entropy is introduced via Boltzmann\'s S = k·lnW and connected to the second law through ΔS_universe ≥ 0, before applying Gibbs free energy for spontaneity.' },
        ],
        ncertBooksSlug: 'ncert-thermodynamics',
        ncertSolutionsSlug: 'thermodynamics',
    },
    {
        slug: 'states-of-matter',
        chapterName: 'States of Matter',
        classLevel: 11,
        ncertChapterNumber: 5,
        subject: 'Physical',
        seoTitle: 'States of Matter Handwritten Notes PDF — Class 11 | JEE & NEET',
        h1: 'States of Matter — Handwritten Notes',
        metaDescription: 'Free States of Matter handwritten notes by Paaras Sir for Class 11 Chemistry, JEE Main, JEE Advanced, and NEET. Gas laws, kinetic theory, real gases, van der Waals equation, and liquefaction.',
        leadParagraph: 'States of Matter sets up every gas-phase numerical you will face in Class 11 and beyond — ideal-gas behaviour, kinetic theory, and the van der Waals correction for real gases. These handwritten notes by Paaras Sir cover each gas law with the derivations JEE and NEET expect.',
        overview: [
            'Boyle\'s, Charles\'s, Gay-Lussac\'s, Avogadro\'s laws and the combined ideal-gas equation',
            'Kinetic molecular theory of gases — RMS, average, and most-probable speeds',
            'Real gases, compressibility factor (Z), and the van der Waals equation',
            'Liquefaction of gases, critical constants, and intermolecular forces in liquids',
        ],
        crucibleChapterId: null,
        bestTool: FLASHCARDS,
        relatedSlugs: ['thermodynamics', 'mole-concept', 'solutions'],
        faqs: [
            { q: 'Are RMS, average, and most-probable speeds derived?', a: 'Yes. All three speeds are derived from the Maxwell–Boltzmann distribution with the relative-magnitude order ($v_p < v_{avg} < v_{rms}$) and the temperature-dependence shortcuts.' },
            { q: 'Is the van der Waals equation covered?', a: 'Yes — both correction terms (a for attractive forces, b for finite molecular volume) are derived, and the units of a and b are tabulated.' },
            { q: 'Are critical constants discussed?', a: 'Yes. Critical temperature, pressure, and volume are derived in terms of van der Waals constants, with the compressibility-factor curves for real gases.' },
        ],
    },
    {
        slug: 'ionic-equilibrium',
        chapterName: 'Ionic Equilibrium',
        classLevel: 11,
        ncertChapterNumber: 7,
        subject: 'Physical',
        seoTitle: 'Ionic Equilibrium Handwritten Notes PDF — Class 11 | JEE & NEET',
        h1: 'Ionic Equilibrium — Handwritten Notes',
        metaDescription: 'Free Ionic Equilibrium handwritten notes by Paaras Sir for Class 11 Chemistry, JEE Main, JEE Advanced, and NEET. pH, buffers, salt hydrolysis, and Ksp problems with shortcuts.',
        leadParagraph: 'Ionic Equilibrium is where most students lose marks in Class 11 — pH calculations, buffer action, salt hydrolysis, and Ksp problems all need careful approximations. These handwritten notes by Paaras Sir lay out each problem type with the standard shortcuts JEE and NEET expect.',
        overview: [
            'Acid–base theories (Arrhenius, Brønsted–Lowry, Lewis), conjugate pairs, Ka and Kb',
            'pH, pOH, ionic product of water, and pH of strong/weak acids and bases',
            'Buffer solutions — Henderson–Hasselbalch equation, buffer capacity',
            'Salt hydrolysis (cationic, anionic, amphoteric) and solubility product (Ksp) problems',
        ],
        crucibleChapterId: 'ch11_ionic_eq',
        bestTool: KSP_CALC,
        relatedSlugs: ['thermodynamics', 'mole-concept', 'electrochemistry'],
        faqs: [
            { q: 'Are buffer-solution problems covered?', a: 'Yes. Acidic and basic buffers are derived from Henderson–Hasselbalch with worked pH calculations on addition of acid/base — the exact pattern JEE Main asks every year.' },
            { q: 'Do the notes cover Ksp and selective precipitation?', a: 'Yes. Ksp expressions, common-ion effect, and selective precipitation of metal sulfides/hydroxides are covered with worked examples — pair with the Ksp Calculator for practice.' },
            { q: 'Is salt hydrolysis treated for all four salt types?', a: 'Yes — strong acid/strong base (no hydrolysis), strong acid/weak base, weak acid/strong base, and weak acid/weak base salts are each derived for pH and degree of hydrolysis.' },
        ],
        ncertBooksSlug: 'ncert-equilibrium',
        ncertSolutionsSlug: 'equilibrium',
    },

    // ─── Class 11 Organic ──────────────────────────────────────────────
    {
        slug: 'goc-and-mechanisms',
        chapterName: 'GOC & Mechanisms',
        classLevel: 11,
        ncertChapterNumber: 12,
        subject: 'Organic',
        seoTitle: 'GOC & Reaction Mechanisms Handwritten Notes PDF — Class 11 Organic | JEE & NEET',
        h1: 'GOC & Reaction Mechanisms — Handwritten Notes',
        metaDescription: 'Free General Organic Chemistry (GOC) handwritten notes by Paaras Sir. Inductive, mesomeric, hyperconjugation effects, electrophiles, nucleophiles, isomerism, and reaction-intermediate stability.',
        leadParagraph: 'General Organic Chemistry (GOC) is the gateway to every organic chapter in Class 12 — and one of the most reliable sections in JEE and NEET. These handwritten notes by Paaras Sir cover electronic effects, reaction intermediates, isomerism, and stability orders that you will use for the rest of organic.',
        overview: [
            'Inductive (+I, −I), mesomeric (+M, −M), and hyperconjugation effects',
            'Reaction intermediates — carbocations, carbanions, free radicals, carbenes (stability orders)',
            'Acidity/basicity of organic compounds, electrophiles vs nucleophiles',
            'Isomerism — structural, geometrical (E/Z), optical (R/S), and conformational',
        ],
        crucibleChapterId: 'ch11_goc',
        bestTool: ORGANIC_WIZARD,
        relatedSlugs: ['hydrocarbons-and-halides', 'aromatic-compounds', 'amines'],
        faqs: [
            { q: 'Do the notes cover R/S and E/Z assignment?', a: 'Yes — the CIP priority rules are explained with worked examples for both R/S configurations and E/Z geometrical isomers, including ranking of common substituents.' },
            { q: 'Are hyperconjugation and resonance compared?', a: 'Yes. The two effects are contrasted with examples showing when each one dominates carbocation, alkene, and free-radical stability.' },
            { q: 'Is acidity of organic compounds covered?', a: 'Yes. The pKa ladder for alcohols, phenols, carboxylic acids, β-diketones, and amides is built up, with the electronic-effect reasoning behind each comparison.' },
        ],
        ncertBooksSlug: 'ncert-organic-chemistry-some-basic-con',
        ncertSolutionsSlug: 'organic-chemistry-some-basic-principles-and-techniques',
    },
    {
        slug: 'hydrocarbons-and-halides',
        chapterName: 'Hydrocarbons & Halides',
        classLevel: 11,
        ncertChapterNumber: 13,
        subject: 'Organic',
        seoTitle: 'Hydrocarbons & Haloalkanes Handwritten Notes PDF — JEE & NEET',
        h1: 'Hydrocarbons & Halides — Handwritten Notes',
        metaDescription: 'Free Hydrocarbons and Haloalkanes handwritten notes by Paaras Sir. Alkanes, alkenes, alkynes, free-radical mechanisms, SN1/SN2/E1/E2 with worked product predictions.',
        leadParagraph: 'Alkanes, alkenes, alkynes, and haloalkanes form the backbone of every organic synthesis JEE and NEET ask. These handwritten notes by Paaras Sir cover preparation, addition, substitution, and elimination reactions — with the SN1/SN2/E1/E2 selectivity rules clearly compared.',
        overview: [
            'Free-radical halogenation of alkanes — selectivity and reactivity orders',
            'Addition reactions of alkenes and alkynes (Markovnikov, anti-Markovnikov, ozonolysis)',
            'SN1 vs SN2 — substrate, nucleophile, leaving group, and solvent effects',
            'E1 vs E2 — Saytzeff vs Hofmann products and stereochemistry',
        ],
        crucibleChapterId: 'ch11_hydrocarbon',
        bestTool: ORGANIC_WIZARD,
        relatedSlugs: ['goc-and-mechanisms', 'aromatic-compounds', 'amines'],
        faqs: [
            { q: 'Are SN1 vs SN2 selectivity rules covered?', a: 'Yes. All four factors (substrate, nucleophile strength, leaving group, solvent) are tabulated with worked product predictions for primary, secondary, and tertiary substrates.' },
            { q: 'Do the notes include ozonolysis with worked examples?', a: 'Yes — reductive and oxidative ozonolysis are both covered with structure-determination problems showing how to back-calculate the alkene from carbonyl products.' },
            { q: 'Is anti-periplanar geometry of E2 explained?', a: 'Yes. The anti-periplanar requirement is derived with Newman projections, and the consequence for E2 selectivity in cyclohexyl halides is worked through.' },
        ],
        ncertBooksSlug: 'ncert-hydrocarbons',
        ncertSolutionsSlug: 'hydrocarbons',
    },
    {
        slug: 'aromatic-compounds',
        chapterName: 'Aromatic Compounds',
        classLevel: 11,
        ncertChapterNumber: 13.5,
        subject: 'Organic',
        seoTitle: 'Aromatic Compounds Handwritten Notes PDF — Benzene, EAS | JEE & NEET',
        h1: 'Aromatic Compounds — Handwritten Notes',
        metaDescription: 'Free Aromatic Compounds handwritten notes by Paaras Sir. Benzene, electrophilic aromatic substitution (EAS), directing effects, and reactivity of substituted aromatics.',
        leadParagraph: 'Aromatic Chemistry is one of the highest-scoring organic sections in JEE and NEET — once you know the directing effects, the entire chapter becomes formula-driven. These handwritten notes by Paaras Sir cover benzene, EAS mechanisms, and substituent effects with full product-prediction tables.',
        overview: [
            'Hückel\'s rule, aromaticity, anti-aromaticity, and non-aromatic systems',
            'Electrophilic aromatic substitution (EAS) — mechanism for halogenation, nitration, sulfonation, Friedel–Crafts',
            'Directing effects — ortho/para vs meta directors and activating vs deactivating groups',
            'Reactivity of substituted benzenes and multi-step synthesis problems',
        ],
        crucibleChapterId: 'ch11_hydrocarbon',
        bestTool: ORGANIC_WIZARD,
        relatedSlugs: ['hydrocarbons-and-halides', 'amines', 'goc-and-mechanisms'],
        faqs: [
            { q: 'Are directing effects clearly tabulated?', a: 'Yes. Activating ortho/para directors, deactivating ortho/para directors (halogens), and deactivating meta directors are tabulated with the electronic-effect logic.' },
            { q: 'Is Friedel–Crafts limitation on deactivated rings covered?', a: 'Yes — the inability of FC alkylation/acylation on strongly deactivated rings (nitrobenzene, aniline complexation) is explained with workarounds.' },
            { q: 'Do the notes cover Hückel\'s rule for charged systems?', a: 'Yes. Hückel\'s rule is applied to cyclopentadienyl anion, cycloheptatrienyl cation, and other charged aromatic species commonly tested in JEE.' },
        ],
    },

    // ─── Class 11 Inorganic ──────────────────────────────────────────────
    {
        slug: 'p-block',
        chapterName: 'p-Block',
        classLevel: 12,
        ncertChapterNumber: 21,
        subject: 'Inorganic',
        seoTitle: 'p-Block Handwritten Notes PDF — Class 11 & 12 Inorganic | JEE & NEET',
        h1: 'p-Block — Handwritten Notes',
        metaDescription: 'Free p-Block handwritten notes by Paaras Sir for Class 11 and Class 12 Chemistry. Group 13–18 properties, compounds of boron, carbon, nitrogen, sulfur, halogens, and noble gases.',
        leadParagraph: 'p-Block chapters are the highest-scoring inorganic section in JEE and NEET if you know the property trends and named compounds. These handwritten notes by Paaras Sir cover Groups 13–18 with the trend-based PYQs and compound-specific reactions students are tested on.',
        overview: [
            'Group 13 — boron family, diborane, borax, boric acid, aluminium chemistry',
            'Group 14 — carbon allotropes, silicates, silicones, zeolites',
            'Group 15 — nitrogen and phosphorus chemistry, oxoacids, fertilisers',
            'Groups 16–18 — sulfur compounds, halogens, interhalogens, noble-gas reactions',
        ],
        crucibleChapterId: 'ch12_pblock',
        bestTool: PERIODIC_TRENDS,
        relatedSlugs: ['periodic-properties', 'd-and-f-block', 'chemical-bonding'],
        faqs: [
            { q: 'Are oxoacids of phosphorus and sulfur covered?', a: 'Yes. Structures and basicities of H3PO2, H3PO3, H3PO4 and H2SO3, H2S2O7, oleum are drawn out — including the P–H/S–H bond counts that determine basicity.' },
            { q: 'Do the notes include diborane structure?', a: 'Yes — the banana-bond structure of B2H6 with 3-centre 2-electron bonds is drawn, along with its preparation and reactions (hydroboration, hydrolysis).' },
            { q: 'Are interhalogen compounds discussed?', a: 'Yes. AB, AB3, AB5, AB7-type interhalogens are covered with hybridisation, geometry (using VSEPR), and the reactivity trends across the series.' },
        ],
        ncertBooksSlug: 'ncert-p-block',
    },

    // ─── Class 12 Physical ──────────────────────────────────────────────
    {
        slug: 'solid-state',
        chapterName: 'Solid State',
        classLevel: 12,
        ncertChapterNumber: 15,
        subject: 'Physical',
        seoTitle: 'Solid State Handwritten Notes PDF — Class 12 Chemistry | JEE & NEET',
        h1: 'Solid State — Handwritten Notes',
        metaDescription: 'Free Solid State handwritten notes by Paaras Sir for Class 12 Chemistry, JEE Main, and NEET. Crystal lattices, packing efficiency, defects, and conductors with worked numericals.',
        leadParagraph: 'Solid State is one of the most numerical-friendly Class 12 chapters — packing efficiency, density, and unit-cell calculations are all formula-driven. These handwritten notes by Paaras Sir cover crystal systems, point defects, and conductivity types with the calculation tricks JEE expects.',
        overview: [
            'Seven crystal systems and 14 Bravais lattices — primitive, FCC, BCC, HCP',
            'Packing efficiency, void fractions, and density of unit cells',
            'Point defects (Schottky, Frenkel) and their effects on density and conductivity',
            'Band theory — conductors, insulators, semiconductors, doping',
        ],
        crucibleChapterId: null,
        bestTool: FLASHCARDS,
        relatedSlugs: ['chemical-bonding', 'd-and-f-block', 'metallurgy'],
        faqs: [
            { q: 'Are unit-cell density problems covered?', a: 'Yes. The formula ρ = (Z·M)/(a³·N_A) is derived and applied to FCC, BCC, and primitive cells with worked numericals — the exact pattern JEE Main asks every year.' },
            { q: 'Do the notes explain Schottky and Frenkel defects?', a: 'Yes — both defects are sketched with examples (NaCl shows Schottky, AgBr shows Frenkel) and their effect on density and conductivity is tabulated.' },
            { q: 'Is doping in semiconductors covered?', a: 'Yes. n-type (Group 15 dopant) and p-type (Group 13 dopant) semiconductors are explained with band-theory diagrams.' },
        ],
    },
    {
        slug: 'solutions',
        chapterName: 'Solutions',
        classLevel: 12,
        ncertChapterNumber: 16,
        subject: 'Physical',
        seoTitle: 'Solutions Handwritten Notes PDF — Class 12 Chemistry | JEE & NEET',
        h1: 'Solutions — Handwritten Notes',
        metaDescription: 'Free Solutions handwritten notes by Paaras Sir for Class 12 Chemistry, JEE, and NEET. Raoult\'s law, colligative properties, van\'t Hoff factor, and osmotic-pressure problems with worked examples.',
        leadParagraph: 'Solutions is a high-yield Class 12 chapter — colligative properties, Raoult\'s law deviations, and van\'t Hoff factor problems all show up in JEE and NEET. These handwritten notes by Paaras Sir cover every formula and the limiting cases (associating/dissociating solutes) you need.',
        overview: [
            'Concentration units — molarity, molality, mole fraction, ppm',
            'Raoult\'s law for ideal and non-ideal solutions; positive and negative deviations',
            'Colligative properties — relative lowering of vapour pressure, ΔTb, ΔTf, osmotic pressure',
            'van\'t Hoff factor for associating/dissociating solutes; abnormal molar masses',
        ],
        crucibleChapterId: 'ch12_solutions',
        bestTool: FLASHCARDS,
        relatedSlugs: ['electrochemistry', 'chemical-kinetics', 'states-of-matter'],
        faqs: [
            { q: 'Are colligative-property problems covered for both ideal and real solutions?', a: 'Yes. Each colligative property is derived for ideal solutions, then corrected with the van\'t Hoff factor (i) for associating/dissociating solutes — with worked examples for NaCl, K2SO4, and acetic-acid dimers.' },
            { q: 'Is Henry\'s law applied to gas solubility?', a: 'Yes. Henry\'s law is derived in both pressure and mole-fraction forms, with applications to deep-sea diving, blood gases, and fizzy drinks (the standard NEET context).' },
            { q: 'Do the notes cover positive and negative deviations from Raoult\'s law?', a: 'Yes — both deviations are explained via intermolecular forces, with vapour-pressure curves drawn for each case and the corresponding sign of ΔH_mix and ΔV_mix.' },
        ],
        ncertBooksSlug: 'ncert-solutions',
        ncertSolutionsSlug: 'solutions',
    },
    {
        slug: 'electrochemistry',
        chapterName: 'Electrochemistry',
        classLevel: 12,
        ncertChapterNumber: 17,
        subject: 'Physical',
        seoTitle: 'Electrochemistry Handwritten Notes PDF — Class 12 | JEE & NEET',
        h1: 'Electrochemistry — Handwritten Notes',
        metaDescription: 'Free Electrochemistry handwritten notes by Paaras Sir for Class 12 Chemistry, JEE Main, JEE Advanced, and NEET. Nernst equation, Kohlrausch\'s law, electrolysis, and EMF problems.',
        leadParagraph: 'Electrochemistry connects redox chemistry to electricity — a high-yield Class 12 chapter for JEE Main, JEE Advanced, and NEET. These handwritten notes by Paaras Sir cover EMF, the Nernst equation, electrolysis, conductance, and Kohlrausch\'s law with the worked numerical patterns that show up in PYQs.',
        overview: [
            'Galvanic and electrolytic cells, electrode potentials, SRP convention',
            'Nernst equation — single-electrode and full-cell forms; concentration cells',
            'Conductance, equivalent and molar conductivity, Kohlrausch\'s law',
            'Faraday\'s laws of electrolysis with charge–mass numericals; batteries, fuel cells, corrosion',
        ],
        crucibleChapterId: 'ch12_electrochem',
        bestTool: FLASHCARDS,
        relatedSlugs: ['solutions', 'chemical-kinetics', 'thermodynamics'],
        faqs: [
            { q: 'Are these Electrochemistry notes good for JEE Main and NEET?', a: 'Yes. Every Nernst-equation variant, conductance setup, and electrolysis numerical that appears in PYQs is covered with worked examples — the exact patterns JEE Main and NEET repeat each year.' },
            { q: 'Do the notes cover the full NCERT Class 12 Electrochemistry chapter?', a: 'Yes. All NCERT topics — galvanic cells, EMF, Nernst, conductance, Kohlrausch, electrolysis, batteries, fuel cells, corrosion — are included with diagrams.' },
            { q: 'Is the Nernst-equation derivation included?', a: 'Yes. Both forms — for a single half-cell and for a complete galvanic cell — are derived from first principles with the temperature-corrected $0.0591/n$ shortcut.' },
        ],
        ncertBooksSlug: 'ncert-electrochemistry',
        ncertSolutionsSlug: 'electrochemistry',
    },
    {
        slug: 'chemical-kinetics',
        chapterName: 'Chemical Kinetics',
        classLevel: 12,
        ncertChapterNumber: 18,
        subject: 'Physical',
        seoTitle: 'Chemical Kinetics Handwritten Notes PDF — Class 12 | JEE & NEET',
        h1: 'Chemical Kinetics — Handwritten Notes',
        metaDescription: 'Free Chemical Kinetics handwritten notes by Paaras Sir for Class 12 Chemistry, JEE, and NEET. Rate law, integrated rate equations, half-life, Arrhenius equation, and reaction mechanisms.',
        leadParagraph: 'Chemical Kinetics is a guaranteed-marks chapter in JEE and NEET if you know the integrated rate laws and Arrhenius shortcuts. These handwritten notes by Paaras Sir cover rate equations, half-life, activation energy, and reaction mechanisms with the numerical patterns examiners reuse.',
        overview: [
            'Rate of reaction, rate law, order, molecularity, and rate-determining step',
            'Integrated rate equations for zero, first, and second-order reactions',
            'Half-life expressions and the relation between half-life and order',
            'Arrhenius equation, activation energy, and temperature-coefficient calculations',
        ],
        crucibleChapterId: 'ch12_kinetics',
        bestTool: FLASHCARDS,
        relatedSlugs: ['solutions', 'electrochemistry', 'thermodynamics'],
        faqs: [
            { q: 'Are integrated rate laws derived for all common orders?', a: 'Yes — zero, first, and second-order integrated rate laws are derived from the differential rate equation, with worked half-life formulas and example numericals for each.' },
            { q: 'Is the Arrhenius equation graphed?', a: 'Yes. The lnk vs 1/T plot is drawn with slope −Ea/R, and the two-temperature form for finding Ea is applied to typical PYQ problems.' },
            { q: 'Do the notes cover pseudo-first-order reactions?', a: 'Yes. Acid-catalysed ester hydrolysis and inversion of cane sugar are both treated as pseudo-first-order reactions with the standard NCERT examples.' },
        ],
        ncertBooksSlug: 'ncert-chemical-kinetics',
        ncertSolutionsSlug: 'chemical-kinetics',
    },
    {
        slug: 'surface-chemistry',
        chapterName: 'Surface Chemistry',
        classLevel: 12,
        ncertChapterNumber: 19,
        subject: 'Physical',
        seoTitle: 'Surface Chemistry Handwritten Notes PDF — Class 12 | JEE & NEET',
        h1: 'Surface Chemistry — Short Revision Notes',
        metaDescription: 'Free Surface Chemistry handwritten notes by Paaras Sir for Class 12 Chemistry, JEE, and NEET. Adsorption, catalysis, colloids, emulsions, and Tyndall/Brownian effects.',
        leadParagraph: 'Surface Chemistry is short, theoretical, and one of the easiest Class 12 chapters to score full marks in — provided you remember the right examples. These handwritten short revision notes by Paaras Sir cover adsorption, catalysis, and colloids with the example sets that appear in NEET.',
        overview: [
            'Physisorption vs chemisorption — comparison table and Freundlich isotherm',
            'Catalysis — homogeneous, heterogeneous, enzyme, and shape-selective (zeolite)',
            'Colloids — types, preparation methods (Bredig\'s arc, peptisation), and properties',
            'Emulsions, micelles, Tyndall effect, Brownian motion, and electrophoresis',
        ],
        crucibleChapterId: null,
        bestTool: FLASHCARDS,
        relatedSlugs: ['chemical-kinetics', 'metallurgy', 'environmental-chemistry'],
        faqs: [
            { q: 'Are physisorption and chemisorption tabulated?', a: 'Yes. The full comparison — forces involved, enthalpy, reversibility, specificity, temperature dependence — is laid out in a single comparison table.' },
            { q: 'Do the notes cover the Freundlich adsorption isotherm?', a: 'Yes — the isotherm $x/m = k·P^{1/n}$ is derived with the log–log graph for finding k and 1/n from experimental data.' },
            { q: 'Is the Hardy–Schulze rule explained?', a: 'Yes. The rule is stated and applied to predict coagulating-power orders of common electrolytes for negatively and positively charged sols.' },
        ],
    },

    // ─── Class 12 Inorganic ──────────────────────────────────────────────
    {
        slug: 'd-and-f-block',
        chapterName: 'd & f Block',
        classLevel: 12,
        ncertChapterNumber: 22,
        subject: 'Inorganic',
        seoTitle: 'd and f Block Elements Handwritten Notes PDF — Class 12 | JEE & NEET',
        h1: 'd & f Block Elements — Handwritten Notes',
        metaDescription: 'Free d-Block and f-Block handwritten notes by Paaras Sir for Class 12 Chemistry, JEE, and NEET. Transition metal trends, KMnO4 and K2Cr2O7 preparation, lanthanide contraction.',
        leadParagraph: 'The d and f Block chapter is dense with property trends, named-compound reactions, and one set of must-remember preparations (KMnO4, K2Cr2O7). These handwritten notes by Paaras Sir cover every transition-metal trend and the chemistry of permanganate and dichromate in detail.',
        overview: [
            'Electronic configurations of transition metals — exceptions and oxidation states',
            'Property trends — atomic radii, ionisation enthalpy, magnetic moment, colour',
            'Preparation, structure, and reactions of KMnO4 and K2Cr2O7',
            'Lanthanide contraction, lanthanoids vs actinoids comparison',
        ],
        crucibleChapterId: 'ch12_dblock',
        bestTool: FLASHCARDS,
        relatedSlugs: ['coordination-compounds', 'p-block', 'metallurgy'],
        faqs: [
            { q: 'Are KMnO4 and K2Cr2O7 preparations covered?', a: 'Yes — full preparation routes from pyrolusite (MnO2) and chromite (FeCr2O4) ores are drawn, with the reaction conditions and oxidising-agent equations in acidic, basic, and neutral media.' },
            { q: 'Is the magnetic-moment formula included?', a: 'Yes. The spin-only formula $\\mu = \\sqrt{n(n+2)}$ BM is applied to predict magnetic moments of common transition-metal ions across oxidation states.' },
            { q: 'Do the notes cover lanthanide contraction consequences?', a: 'Yes. Zr/Hf similarity, decreasing basicity of Ln(OH)3 across the series, and the influence on the d-block (5d radii) are all covered.' },
        ],
        ncertBooksSlug: 'ncert-d-f-block',
        ncertSolutionsSlug: 'the-d-and-f-block-elements',
    },
    {
        slug: 'coordination-compounds',
        chapterName: 'Coordination Compounds',
        classLevel: 12,
        ncertChapterNumber: 23,
        subject: 'Inorganic',
        seoTitle: 'Coordination Compounds Handwritten Notes PDF — Class 12 | JEE & NEET',
        h1: 'Coordination Compounds — Handwritten Notes',
        metaDescription: 'Free Coordination Compounds handwritten notes by Paaras Sir for Class 12 Chemistry, JEE, and NEET. Werner\'s theory, IUPAC nomenclature, VBT, CFT, isomerism, and magnetic/colour predictions.',
        leadParagraph: 'Coordination Compounds is the highest-scoring Class 12 inorganic chapter for JEE and NEET — almost every concept is rule-based once you set up the d-electron count. These handwritten notes by Paaras Sir cover Werner\'s theory, VBT, CFT, isomerism, and stability with worked examples.',
        overview: [
            'Werner\'s theory, ligand types (mono/poly/ambidentate), denticity, EAN rule',
            'IUPAC nomenclature for coordination complexes',
            'Bonding theories — VBT (hybridisation, magnetic behaviour) and CFT (Δo, Δt, splitting)',
            'Isomerism — structural (linkage, ionisation, hydrate, coordination) and stereoisomerism',
        ],
        crucibleChapterId: 'ch12_coord',
        bestTool: FLASHCARDS,
        relatedSlugs: ['d-and-f-block', 'chemical-bonding', 'p-block'],
        faqs: [
            { q: 'Are CFT splitting diagrams drawn for octahedral and tetrahedral?', a: 'Yes. Both splittings are drawn with Δo, Δt magnitudes, the Δt = (4/9)Δo relation, and worked predictions of high-spin vs low-spin for d4–d7 ions.' },
            { q: 'Do the notes cover spectrochemical series?', a: 'Yes — the strong-field to weak-field ligand series is given with the standard ligands students must memorise (CO > CN- > en > NH3 > H2O > OH- > F- > Cl- > Br- > I-).' },
            { q: 'Is the colour of coordination complexes explained?', a: 'Yes. Colour is connected to the d–d transition energy via Δo, with worked predictions for [Ti(H2O)6]3+ and other classic cases.' },
        ],
        ncertBooksSlug: 'ncert-coordination-compounds',
        ncertSolutionsSlug: 'coordination-compounds',
    },
    {
        slug: 'metallurgy',
        chapterName: 'Metallurgy',
        classLevel: 12,
        ncertChapterNumber: 20,
        subject: 'Inorganic',
        seoTitle: 'Metallurgy Handwritten Notes PDF — Class 12 | JEE & NEET',
        h1: 'Metallurgy — Handwritten Notes',
        metaDescription: 'Free Metallurgy handwritten notes by Paaras Sir for Class 12 Chemistry, JEE, and NEET. Concentration of ores, reduction methods, refining, Ellingham diagrams, and named extractions.',
        leadParagraph: 'Metallurgy rewards memorisation of named extractions and Ellingham diagrams — the rest is principle-based. These handwritten notes by Paaras Sir cover ore concentration, reduction, refining, and the extraction of Fe, Cu, Al, and Zn step by step.',
        overview: [
            'Ore concentration — gravity separation, froth flotation, magnetic separation, leaching',
            'Reduction methods — carbon reduction, self-reduction, electrolytic reduction',
            'Ellingham diagram — interpretation and use for choosing reducing agents',
            'Refining methods — distillation, liquation, electrolytic, zone, vapour-phase (van Arkel, Mond)',
        ],
        crucibleChapterId: null,
        bestTool: FLASHCARDS,
        relatedSlugs: ['d-and-f-block', 'p-block', 'electrochemistry'],
        faqs: [
            { q: 'Is the Ellingham diagram explained?', a: 'Yes — the ΔG° vs T plot is interpreted line-by-line, including the role of CO and the kink in the carbon line above 1000 K, with worked reasoning for picking C vs H2 vs Al as reductant.' },
            { q: 'Do the notes cover the Hall–Héroult process?', a: 'Yes. The full electrolytic cell setup for Al extraction (cryolite + Al2O3 melt, carbon anodes, steel cathode) is drawn with the cell reactions.' },
            { q: 'Is the van Arkel method included?', a: 'Yes — both the van Arkel (ZrI4 / TiI4 thermal decomposition) and Mond\'s process (Ni(CO)4) refining methods are covered with reaction equations.' },
        ],
    },
    {
        slug: 'practical-chemistry',
        chapterName: 'Practical Chemistry',
        classLevel: 11,
        ncertChapterNumber: 12.5,
        subject: 'Practical',
        seoTitle: 'Practical Chemistry Handwritten Notes PDF — Class 11 & 12 | JEE & NEET',
        h1: 'Practical Chemistry — Handwritten Notes',
        metaDescription: 'Free Practical Chemistry handwritten notes by Paaras Sir for Class 11 and 12 — purification methods, qualitative analysis, detection of elements, tests for functional groups, and lab manual practicals.',
        leadParagraph: 'Practical Chemistry covers everything from purification techniques to functional-group identification — high-yield in NEET and a steady source of marks in JEE. These handwritten notes by Paaras Sir cover the practical procedures examiners actually test, with reagent-by-reagent flow.',
        overview: [
            'Purification methods — crystallisation, distillation, sublimation, chromatography',
            'Detection of elements — Lassaigne\'s test for N, S, halogens',
            'Tests for unsaturation, hydroxyl group, carbonyl, carboxyl, and amine groups',
            'Quantitative analysis — Carius method, Kjeldahl, Dumas method',
        ],
        crucibleChapterId: 'ch11_prac_org',
        bestTool: SALT_SIM,
        relatedSlugs: ['salt-analysis', 'goc-and-mechanisms', 'aromatic-compounds'],
        faqs: [
            { q: 'Are functional-group tests covered with reagent reactions?', a: 'Yes. Tests for unsaturation (Br2 water, Baeyer\'s test), hydroxyls (Lucas, sodium metal), carbonyls (DNP, Tollens, Fehling), carboxyls (NaHCO3) and amines (Hinsberg, carbylamine) are all drawn with their distinguishing observations.' },
            { q: 'Is paper chromatography included?', a: 'Yes — Rf calculation, mobile/stationary phase concepts, and the lab manual chromatography practical are covered with worked examples.' },
            { q: 'Do the notes cover detection of elements via Lassaigne\'s test?', a: 'Yes. The full Lassaigne fusion procedure with sodium metal, plus tests for N (Prussian blue), S (sodium nitroprusside), and halogens (silver halide) are included.' },
        ],
    },
    {
        slug: 'name-reactions',
        chapterName: 'Name Reactions',
        classLevel: 12,
        ncertChapterNumber: 26.5,
        subject: 'Organic',
        seoTitle: 'Organic Name Reactions Handwritten Notes PDF — JEE & NEET',
        h1: 'Organic Name Reactions — Handwritten Notes',
        metaDescription: 'Free Organic Name Reactions handwritten notes by Paaras Sir for JEE Main, JEE Advanced, and NEET. Aldol, Cannizzaro, Claisen, Wittig, Reimer-Tiemann, and 30+ named reactions with mechanisms.',
        leadParagraph: 'Named organic reactions are guaranteed marks in JEE and NEET — every paper has at least 2-3 questions on Aldol, Cannizzaro, Wittig, Reimer-Tiemann, or similar. These handwritten notes by Paaras Sir compile the full set of named reactions with mechanism and product-prediction examples.',
        overview: [
            'Aldol, Cannizzaro, Claisen, Perkin, Knoevenagel — α-carbon name reactions',
            'Wittig, Reformatsky, Grignard — C–C bond-forming reactions',
            'Reimer-Tiemann, Kolbe, Sandmeyer, Gattermann — aromatic name reactions',
            'Hofmann bromamide, Curtius, Schmidt, Beckmann — rearrangement reactions',
        ],
        crucibleChapterId: 'ch12_carbonyl',
        bestTool: ORGANIC_WIZARD,
        relatedSlugs: ['aromatic-compounds', 'amines', 'goc-and-mechanisms'],
        faqs: [
            { q: 'How many named reactions are covered?', a: 'Over 30 of the most exam-relevant named reactions — Aldol, Cannizzaro, Wittig, Reimer-Tiemann, Sandmeyer, Hofmann bromamide, Beckmann, and many more — each with mechanism and starting material → product example.' },
            { q: 'Are mechanisms drawn for each reaction?', a: 'Yes — every name reaction is shown with the curved-arrow mechanism, intermediates, and key transition states. Pair with the Organic Wizard to test product prediction across this entire set.' },
            { q: 'Are these notes useful for JEE Advanced?', a: 'Yes. JEE Advanced often combines two named reactions in a single multi-step synthesis problem — knowing each one cold is the only way to chain them under exam pressure.' },
        ],
    },
    {
        slug: 'salt-analysis',
        chapterName: 'Salt Analysis',
        classLevel: 12,
        ncertChapterNumber: 30.5,
        subject: 'Practical',
        seoTitle: 'Salt Analysis Handwritten Notes PDF — Class 12 Practical | JEE & NEET',
        h1: 'Salt Analysis — Handwritten Notes',
        metaDescription: 'Free Salt Analysis handwritten notes by Paaras Sir for Class 12 practical exams, JEE, and NEET. Cation and anion analysis schemes, group reagents, confirmatory tests, and flame colours.',
        leadParagraph: 'Salt Analysis is the practical chapter that doubles as a high-scoring inorganic theory section for JEE and NEET. These handwritten notes by Paaras Sir cover the cation and anion group schemes, confirmatory tests, and flame-test colours that examiners reuse year after year.',
        overview: [
            'Anion analysis — dilute H2SO4 group, concentrated H2SO4 group, and special-anion tests',
            'Cation analysis — Group I (Pb, Ag, Hg), Group II (Cu, As), Group III (Fe, Al, Cr)',
            'Cation analysis continued — Group IV (Zn, Mn, Ni, Co), Group V (Ba, Sr, Ca), Zero group (NH4+)',
            'Dry tests — flame colours, borax-bead test, and characteristic gas evolutions',
        ],
        crucibleChapterId: 'ch12_salt',
        bestTool: SALT_SIM,
        relatedSlugs: ['d-and-f-block', 'p-block', 'coordination-compounds'],
        faqs: [
            { q: 'Are flame-test colours tabulated?', a: 'Yes — Na (golden yellow), K (lilac), Ca (brick red), Sr (crimson), Ba (apple green), Cu (bluish green), and other characteristic colours are listed in a single reference table.' },
            { q: 'Do the notes cover the chromyl chloride test?', a: 'Yes. The CrO2Cl2 vapour test for chloride ions, including the specific reagent setup (K2Cr2O7 + conc. H2SO4 + solid chloride), is drawn step-by-step.' },
            { q: 'Is the brown-ring test for nitrate included?', a: 'Yes — the FeSO4 + conc. H2SO4 + nitrate test producing the [Fe(H2O)5NO]2+ brown ring is covered with the underlying reaction.' },
        ],
    },
    {
        slug: 'environmental-chemistry',
        chapterName: 'Environmental Chemistry',
        classLevel: 11,
        ncertChapterNumber: 14,
        subject: 'Inorganic',
        seoTitle: 'Environmental Chemistry Handwritten Notes PDF — Class 11 | JEE & NEET',
        h1: 'Environmental Chemistry — Handwritten Notes',
        metaDescription: 'Free Environmental Chemistry handwritten notes by Paaras Sir for Class 11 Chemistry, JEE, and NEET. Air, water, and soil pollution; smog, ozone depletion, acid rain, and BOD/COD.',
        leadParagraph: 'Environmental Chemistry is short, factual, and almost entirely scoring-based in NEET — if you remember the named pollutants and reactions. These handwritten notes by Paaras Sir cover the air, water, and soil pollutants you must know with the underlying chemistry.',
        overview: [
            'Atmospheric pollutants — primary vs secondary; NOx, SOx, CO chemistry',
            'Photochemical and classical (London) smog — reactions and PAN formation',
            'Stratospheric ozone depletion — CFC mechanism and the Antarctic ozone hole',
            'Water pollution — BOD, COD, DO, and chemistry of acid rain',
        ],
        crucibleChapterId: null,
        bestTool: FLASHCARDS,
        relatedSlugs: ['surface-chemistry', 'metallurgy', 'p-block'],
        faqs: [
            { q: 'Is photochemical smog explained?', a: 'Yes — the full sequence (NO2 photolysis → O atoms → ozone + organic radicals → PAN) is drawn step-by-step with the conditions for smog formation.' },
            { q: 'Do the notes cover ozone-depletion mechanism?', a: 'Yes. The Cl-radical chain mechanism initiated by CFC photolysis is covered, with the catalytic cycle that lets one Cl atom destroy thousands of ozone molecules.' },
            { q: 'Is the BOD vs COD distinction made clear?', a: 'Yes. BOD measures only biodegradable organic load, COD measures total chemically oxidisable matter — with the typical values for clean vs polluted water tabulated.' },
        ],
    },

    // ─── Class 12 Organic ──────────────────────────────────────────────
    {
        slug: 'amines',
        chapterName: 'Amines',
        classLevel: 12,
        ncertChapterNumber: 27,
        subject: 'Organic',
        seoTitle: 'Amines Handwritten Notes PDF — Class 12 Organic | JEE & NEET',
        h1: 'Amines — Quick Handwritten Notes',
        metaDescription: 'Free Amines handwritten notes by Paaras Sir for Class 12 Chemistry, JEE, and NEET. Preparation, basicity, Hinsberg test, diazonium-salt reactions, and aromatic amine chemistry.',
        leadParagraph: 'Amines is one of the most reaction-heavy organic chapters in Class 12 — but every reaction is rule-driven once you sort out 1°/2°/3° behaviour. These handwritten notes by Paaras Sir cover preparation, basicity, distinguishing tests, and diazonium chemistry with worked examples.',
        overview: [
            'Preparation — Gabriel phthalimide, Hofmann bromamide, reduction of nitriles/amides',
            'Basicity of aliphatic vs aromatic amines — gas-phase vs aqueous trends',
            'Distinguishing tests — Hinsberg, carbylamine, azo-dye for primary aromatic amines',
            'Diazonium salts — coupling reactions and Sandmeyer/Gattermann substitutions',
        ],
        crucibleChapterId: 'ch12_amines',
        bestTool: ORGANIC_WIZARD,
        relatedSlugs: ['aromatic-compounds', 'goc-and-mechanisms', 'biomolecules-and-polymers'],
        faqs: [
            { q: 'Why are aromatic amines less basic than aliphatic amines?', a: 'Aromatic amines have the lone pair delocalised into the ring, which reduces availability for protonation. The notes show the resonance structures and quantify the pKb difference between aniline and methylamine.' },
            { q: 'Are all diazonium-salt coupling reactions covered?', a: 'Yes — coupling with phenols (alkaline) and aromatic amines (acidic) is drawn with the position of attack, plus Sandmeyer (CuCl/CuBr) and Gattermann (Cu/HCl) substitutions for halides.' },
            { q: 'Is the Hinsberg test included?', a: 'Yes. Reactions of 1°, 2°, and 3° amines with benzenesulfonyl chloride are drawn, with the basis for separation (alkali-soluble vs insoluble vs unreactive) tabulated.' },
        ],
        ncertBooksSlug: 'ncert-amines',
        ncertSolutionsSlug: 'amines',
    },
    {
        slug: 'biomolecules-and-polymers',
        chapterName: 'Biomolecules & Polymers',
        classLevel: 12,
        ncertChapterNumber: 28,
        subject: 'Organic',
        seoTitle: 'Biomolecules & Polymers Handwritten Notes PDF — Class 12 | NEET',
        h1: 'Biomolecules & Polymers — Handwritten Notes',
        metaDescription: 'Free Biomolecules and Polymers handwritten notes by Paaras Sir for Class 12 Chemistry, JEE, and NEET. Carbohydrates, proteins, nucleic acids, vitamins, and addition/condensation polymers.',
        leadParagraph: 'Biomolecules is a memory-heavy but high-scoring NEET chapter, and Polymers is similar in JEE Main. These handwritten notes by Paaras Sir cover carbohydrates, proteins, nucleic acids, vitamins, and the polymer types you must distinguish for the exam.',
        overview: [
            'Carbohydrates — monosaccharide structure (glucose, fructose), reducing/non-reducing sugars',
            'Proteins and amino acids — peptide bond, primary–quaternary structure, denaturation',
            'Nucleic acids — DNA vs RNA, base-pairing, double-helix structure',
            'Polymers — addition vs condensation, classification by source, and named polymers',
        ],
        crucibleChapterId: 'ch12_biomolecules',
        bestTool: FLASHCARDS,
        relatedSlugs: ['amines', 'aromatic-compounds', 'goc-and-mechanisms'],
        faqs: [
            { q: 'Is glucose structure derived?', a: 'Yes. The open-chain (Fischer) and cyclic (Haworth) structures of α- and β-D-glucose are drawn, with the experimental evidence for each functional group.' },
            { q: 'Are the four protein structure levels covered?', a: 'Yes — primary (sequence), secondary (α-helix, β-sheet), tertiary (3D folding), and quaternary (multi-subunit) structures are explained with the bonding interactions stabilising each level.' },
            { q: 'Do the notes cover named polymers?', a: 'Yes. Polythene, polypropene, PVC, Teflon, nylon-6, nylon-6,6, polyester, Bakelite, Buna-S, Buna-N, and natural rubber are tabulated with monomers, type (addition/condensation), and uses.' },
        ],
        ncertBooksSlug: 'ncert-biomolecules',
        ncertSolutionsSlug: 'biomolecules',
    },
];

const SLUG_MAP = new Map(CHAPTERS.map((c) => [c.slug, c]));
const NAME_MAP = new Map(CHAPTERS.map((c) => [c.chapterName, c]));

export const CHAPTER_META_LIST = CHAPTERS;

export function getChapterMetaBySlug(slug: string): ChapterMeta | null {
    return SLUG_MAP.get(slug) ?? null;
}

export function getChapterMetaByName(name: string): ChapterMeta | null {
    return NAME_MAP.get(name) ?? null;
}

export const ALL_CHAPTER_SLUGS: string[] = CHAPTERS.map((c) => c.slug);
