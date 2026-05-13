import { QuizData } from './types';

// 30-question revision quiz on p-block anomalies.
//
// This quiz drills deep into Groups 13–18 (the p-block) — the section of
// inorganic chemistry where almost every "down a group" trend has a
// counter-intuitive twist. Most questions source from previously unused
// trend blocks in app/lib/inorganicTrendsData.ts so there's minimal
// overlap with the broader inorganic-exceptions quiz.

export const pBlockAnomaliesQuiz: QuizData = {
    slug: 'p-block-anomalies',
    title: 'P-Block Anomalies and Exceptions Quiz for JEE Main and NEET',
    description:
        'A 41-question revision quiz on the most-tested anomalies of the p-block (Groups 13 through 18). Covers back bonding in boron halides, lanthanoid-contraction fingerprints (Pb>Sn IE, Bi IE₃ rise, Tl reduction potential), the inert pair effect quantified, hydrogen-bonding boosts in NH₃ and HF, halogen oxidising power, oxoacid acidity vs oxidising power inversions, nitrogen and phosphorus trihalide quirks, NOₓ acidity, noble gas behaviour, and Fajans\' rule. Built from NCERT-aligned content for JEE Main, JEE Advanced, NEET and BITSAT aspirants.',
    shortLabel: 'P-Block Anomalies',
    datePublished: '2026-05-06',
    dateModified: '2026-05-06',
    educationalLevel: 'Class 11 / Class 12',
    targetExams: ['JEE Main', 'JEE Advanced', 'NEET', 'BITSAT'],
    keywords: [
        'p-block anomalies quiz',
        'p-block exceptions',
        'p-block MCQ for JEE',
        'p-block MCQ for NEET',
        'group 13 exceptions',
        'group 14 exceptions',
        'group 15 hydrides MCQ',
        'group 16 MCQ',
        'halogens MCQ',
        'noble gases MCQ',
        'inert pair effect MCQ',
        'back bonding boron halides',
        'Fajans rule MCQ',
        'lanthanoid contraction Pb anomaly',
    ],
    learningOutcomes: [
        'Identify which Group 13 trihalide is the strongest Lewis acid and why',
        'Explain inert pair effect anomalies in Pb, Tl and Sn — and predict which oxidation state dominates',
        'Compare hydride properties (MP, BP, basicity, reducing character, thermal stability) for Groups 15 and 16',
        'Justify halogen anomalies — F\'s low electron gain enthalpy, F₂\'s low bond dissociation enthalpy, HF\'s high boiling point',
        'Apply Fajans\' rule to predict ionic vs covalent character in NaX and LiX series',
    ],
    questions: [
        // ───── Group 13 (5 questions) ───────────────────────────────────────
        {
            id: 1,
            topic: 'Group 13 (Boron Family)',
            difficulty: 'medium',
            sourceTrendIds: [4],
            stem: 'Among the Group 13 metals, which is the strongest reducing agent?',
            options: [
                { id: 'a', text: '$Tl$' },
                { id: 'b', text: '$In$' },
                { id: 'c', text: '$Ga$' },
                { id: 'd', text: '$Al$' },
            ],
            answerId: 'd',
            explanation:
                'Reducing power follows $Al > Ga > In > Tl$. $Al$ strongly prefers the +3 state, so $Al$ metal readily gives up three electrons (acts as a reductant). $Tl$ prefers +1 (inert pair effect), so $Tl^{3+}$ is actually a strong oxidising agent — the opposite behaviour. This is why $Al$ is used in thermite reactions but $Tl$ is not.',
        },
        {
            id: 2,
            topic: 'Group 13 (Boron Family)',
            difficulty: 'medium',
            sourceTrendIds: [7],
            stem: 'Which of the following is the correct order of Lewis acidity of Group 13 trihalides $MX_3$?',
            options: [
                { id: 'a', text: '$BX_3 > AlX_3 > GaX_3 > InX_3$' },
                { id: 'b', text: '$AlX_3 > BX_3 > GaX_3 > InX_3$' },
                { id: 'c', text: '$InX_3 > GaX_3 > AlX_3 > BX_3$' },
                { id: 'd', text: '$GaX_3 > InX_3 > AlX_3 > BX_3$' },
            ],
            answerId: 'a',
            explanation:
                'For a fixed halogen, Lewis acidity decreases down Group 13. $B$ is the smallest and most electron-deficient, so $BX_3$ accepts a lone pair most readily. $Al$, $Ga$ and $In$ have empty d-orbitals available for accepting electron pairs but their larger size dilutes the effect. (Within the boron halides themselves the order is reversed because of $p\\pi$–$p\\pi$ back bonding — that\'s a separate trend.)',
        },
        {
            id: 3,
            topic: 'Group 13 (Boron Family)',
            difficulty: 'hard',
            sourceTrendIds: [44],
            stem: '$TlI_3$ is correctly formulated not as Thallium(III) iodide, but as:',
            options: [
                { id: 'a', text: '$Tl^{3+}(I^-)_3$, an ionic salt of $Tl^{3+}$' },
                { id: 'b', text: '$Tl^+(I_3^-)$, a salt of $Tl^+$ and the triiodide ion' },
                { id: 'c', text: '$Tl^{2+}(I_2^-)(I^-)$, a mixed-valence species' },
                { id: 'd', text: 'A covalent molecule with three Tl–I bonds' },
            ],
            answerId: 'b',
            explanation:
                'Due to the inert pair effect, $Tl^{3+}$ is a strong oxidising agent that would oxidise $I^-$ to $I_2$. So $TlI_3$ cannot be a $Tl^{3+}$ salt. It is actually $Tl^+(I_3^-)$ — the triiodide salt of $Tl^+$. This is the same logic that makes $PbI_4$ non-existent. The 6s² lone pair on Tl prefers to stay inert, stabilising the +1 state.',
        },
        {
            id: 4,
            topic: 'Group 13 (Boron Family)',
            difficulty: 'medium',
            sourceTrendIds: [6],
            stem: 'Which of the following boron halides shows the maximum extent of $p\\pi$–$p\\pi$ back bonding from halogen to boron?',
            options: [
                { id: 'a', text: '$BF_3$' },
                { id: 'b', text: '$BCl_3$' },
                { id: 'c', text: '$BBr_3$' },
                { id: 'd', text: '$BI_3$' },
            ],
            answerId: 'a',
            explanation:
                'Back bonding is most efficient when the orbitals overlapping are similar in size. In $BF_3$ the overlap is 2p (B) with 2p (F) — best size match, strongest back bonding. As we go to $BCl_3$ (2p-3p), $BBr_3$ (2p-4p), $BI_3$ (2p-5p), the size mismatch grows and back bonding weakens. This is why $BF_3$ is the *weakest* Lewis acid among boron halides — its electron deficiency is partially relieved by back bonding.',
        },
        {
            id: 5,
            topic: 'Group 13 (Boron Family)',
            difficulty: 'hard',
            sourceTrendIds: [1],
            stem: 'Which of the following best explains why Gallium has a smaller atomic radius than Aluminium, even though Ga is below Al in Group 13?',
            options: [
                { id: 'a', text: 'Ga has fewer valence electrons than Al' },
                { id: 'b', text: 'Ga\'s 4p orbital is more contracted than Al\'s 3p' },
                { id: 'c', text: 'Poor shielding by intervening 3d electrons (d-block contraction) raises effective nuclear charge on Ga\'s outer shell' },
                { id: 'd', text: 'Ga has a higher electronegativity than Al' },
            ],
            answerId: 'c',
            explanation:
                'Between Al (period 3) and Ga (period 4) sits the first row of the d-block (Sc to Zn). The 3d electrons shield the outer electrons very poorly, so the effective nuclear charge on Ga\'s 4p electron is higher than expected. The shell is pulled inward, making Ga ($135$ pm) actually smaller than Al ($143$ pm). This is the d-block contraction.',
        },
        {
            id: 31,
            topic: 'Group 13 (Boron Family)',
            difficulty: 'medium',
            sourceTrendIds: [56],
            stem: 'Which of the following Group 13 hydroxides is the most basic?',
            options: [
                { id: 'a', text: '$B(OH)_3$' },
                { id: 'b', text: '$Al(OH)_3$' },
                { id: 'c', text: '$Ga(OH)_3$' },
                { id: 'd', text: '$Tl(OH)_3$' },
            ],
            answerId: 'd',
            explanation:
                'Down Group 13 the M–OH bond becomes more ionic and $OH^-$ is released more easily. $B(OH)_3$ is actually *acidic* — boric acid donates a proton to water, since the small B atom polarises the O–H bond. $Al(OH)_3$ is amphoteric. $Ga(OH)_3$ is weakly basic. $Tl(OH)_3$ is the most basic — it behaves like a typical alkali. The pattern parallels the metallic-character increase down the group.',
        },
        {
            id: 41,
            topic: 'Group 13 (Boron Family)',
            difficulty: 'hard',
            sourceTrendIds: [66],
            stem: 'Standard reduction potentials of Group 13 metals ($M^{3+}/M$) are: $Al = -1.66$ V, $Ga = -0.56$ V, $In = -0.34$ V, $Tl = +1.26$ V. What does the *positive* value for Tl tell you?',
            options: [
                { id: 'a', text: 'Tl is the strongest reducing agent in Group 13' },
                { id: 'b', text: '$Tl^{3+}$ is a strong oxidising agent that readily accepts electrons to become $Tl$ (or $Tl^+$)' },
                { id: 'c', text: 'Tl is more electronegative than Al' },
                { id: 'd', text: 'Tl has the largest atomic radius and lowest density' },
            ],
            answerId: 'b',
            explanation:
                'A positive $E°$ for $M^{3+}/M$ means the reduction $Tl^{3+} + 3e^- \\rightarrow Tl$ is spontaneous — i.e. $Tl^{3+}$ readily accepts electrons. So $Tl^{3+}$ behaves as an *oxidising agent*. The other Group 13 metals all have negative $E°$ (Al most negative at $-1.66$ V), so they\'re reducing agents — $Al \\rightarrow Al^{3+} + 3e^-$ is spontaneous. The smooth slide from very negative (Al) to positive (Tl) is the **inert pair effect quantified**: the 6s² electrons in Tl resist removal, making $Tl^+$ the stable oxidation state and $Tl^{3+}$ a strong oxidiser.',
        },

        // ───── Group 14 (6 questions) ───────────────────────────────────────
        {
            id: 6,
            topic: 'Group 14 (Carbon Family)',
            difficulty: 'hard',
            sourceTrendIds: [9],
            stem: 'In Group 14, the first ionization enthalpy follows the order $C > Si > Ge > Pb > Sn$. Why is $IE_1$ of $Pb$ higher than that of $Sn$?',
            options: [
                { id: 'a', text: '$Pb$ is smaller than $Sn$' },
                { id: 'b', text: 'Lanthanoid contraction increases effective nuclear charge on $Pb$\'s 6p electron' },
                { id: 'c', text: '$Pb$ has a half-filled 6p configuration' },
                { id: 'd', text: '$Pb$ has more shielding electrons than $Sn$' },
            ],
            answerId: 'b',
            explanation:
                'Between Sn (period 5) and Pb (period 6) lies the lanthanoid series (4f filling). The 4f electrons shield very poorly, so the 6p electron in Pb feels a higher effective nuclear charge than expected. This raises Pb\'s IE above Sn\'s — a clean fingerprint of lanthanoid contraction in the p-block. Compare with the same effect making $Tl$\'s IE anomalously high in Group 13.',
        },
        {
            id: 7,
            topic: 'Group 14 (Carbon Family)',
            difficulty: 'easy',
            sourceTrendIds: [53],
            stem: 'Which of the following is the correct order of thermal stability of Group 14 hydrides?',
            options: [
                { id: 'a', text: '$CH_4 > SiH_4 > GeH_4 > SnH_4 > PbH_4$' },
                { id: 'b', text: '$PbH_4 > SnH_4 > GeH_4 > SiH_4 > CH_4$' },
                { id: 'c', text: '$SiH_4 > CH_4 > GeH_4 > SnH_4 > PbH_4$' },
                { id: 'd', text: '$CH_4 > GeH_4 > SiH_4 > SnH_4 > PbH_4$' },
            ],
            answerId: 'a',
            explanation:
                'As you go down Group 14, the M–H bond length grows and bond strength falls steadily. Thermal stability follows bond strength, so $CH_4$ (strongest C–H bond) is most stable while $PbH_4$ is so unstable that it has barely been characterised. The order is monotonic: $CH_4 > SiH_4 > GeH_4 > SnH_4 > PbH_4$.',
        },
        {
            id: 8,
            topic: 'Group 14 (Carbon Family)',
            difficulty: 'medium',
            sourceTrendIds: [8],
            stem: 'Carbon shows a much greater tendency for catenation than the rest of Group 14. The primary reason is:',
            options: [
                { id: 'a', text: 'Carbon has the smallest atomic radius in the group' },
                { id: 'b', text: 'The C–C bond is exceptionally strong (~$348$ kJ/mol) due to optimal 2p–2p orbital overlap' },
                { id: 'c', text: 'Carbon has the highest electronegativity of the group' },
                { id: 'd', text: 'Carbon has vacant d-orbitals available for back bonding' },
            ],
            answerId: 'b',
            explanation:
                'Catenation depends on M–M bond strength. The C–C single bond is one of the strongest homoatomic single bonds (~$348$ kJ/mol) because both atoms are small and 2p orbitals overlap optimally. As atomic size grows, M–M bond strength falls sharply: $C \\gg Si > Ge \\approx Sn$, and $Pb$ shows essentially no catenation. Note: carbon does *not* have d-orbitals — that\'s what stops $CCl_4$ from hydrolysing.',
        },
        {
            id: 9,
            topic: 'Group 14 (Carbon Family)',
            difficulty: 'hard',
            sourceTrendIds: [51],
            stem: '$CCl_4$ does not hydrolyse in water but $SiCl_4$ hydrolyses readily. The best explanation is:',
            options: [
                { id: 'a', text: 'C–Cl bonds are much stronger than Si–Cl bonds' },
                { id: 'b', text: 'C is more electronegative than Si' },
                { id: 'c', text: 'Si has accessible vacant 3d orbitals to accept water\'s lone pair; C (period 2) has no such orbitals' },
                { id: 'd', text: '$SiCl_4$ has a different geometry than $CCl_4$' },
            ],
            answerId: 'c',
            explanation:
                'Hydrolysis of $SiCl_4$ proceeds by lone-pair donation from water onto a vacant 3d orbital on Si, which makes the central atom temporarily 5-coordinate. Carbon is in period 2 and has no accessible d-orbitals, so the same mechanism is closed off. $CCl_4$ is therefore kinetically inert toward water. Same logic explains why $NF_3$ doesn\'t hydrolyse but $NCl_3$ does (Cl has 3d available, F doesn\'t).',
        },
        {
            id: 10,
            topic: 'Group 14 (Carbon Family)',
            difficulty: 'medium',
            sourceTrendIds: [16],
            stem: 'For Group 14 tetrahalides, which order of thermal stability is correct (for the same metal across different halogens)?',
            options: [
                { id: 'a', text: '$MF_4 > MCl_4 > MBr_4 > MI_4$' },
                { id: 'b', text: '$MI_4 > MBr_4 > MCl_4 > MF_4$' },
                { id: 'c', text: '$MCl_4 > MF_4 > MBr_4 > MI_4$' },
                { id: 'd', text: '$MBr_4 > MCl_4 > MI_4 > MF_4$' },
            ],
            answerId: 'a',
            explanation:
                'For a given metal, M–F is the shortest and strongest M–X bond (F is small and highly electronegative), so $MF_4$ is most thermally stable. Stability falls as the halogen grows. The trend is reinforced by the redox angle: large iodides like $PbI_4$ don\'t exist at all because $Pb^{4+}$ oxidises $I^-$ to $I_2$, leaving $PbI_2$ behind.',
        },
        {
            id: 32,
            topic: 'Group 14 (Carbon Family)',
            difficulty: 'medium',
            sourceTrendIds: [57],
            stem: 'Density of Group 14 elements follows the order $Si < C < Ge < Sn < Pb$ (densities: $2.34, 3.51, 5.32, 7.26, 11.34$ g/cm³). Why is silicon less dense than carbon (diamond)?',
            options: [
                { id: 'a', text: 'Silicon has fewer protons than carbon' },
                { id: 'b', text: 'Diamond\'s tetrahedral lattice has very short C–C bonds, packing atoms more tightly than the corresponding silicon lattice' },
                { id: 'c', text: 'Silicon is in the liquid state at room temperature' },
                { id: 'd', text: 'Carbon has stronger metallic bonding than silicon' },
            ],
            answerId: 'b',
            explanation:
                'Both diamond and silicon adopt the same tetrahedral lattice geometry, but bond lengths differ sharply: C–C is ~$1.54$ Å while Si–Si is ~$2.35$ Å. Diamond therefore packs ~$3.5$× more atoms per unit volume than silicon. From Ge onward, atomic mass grows much faster than volume, so density rises smoothly: $Ge < Sn < Pb$. The Si dip is the lone density anomaly in Group 14.',
        },

        // ───── Group 15 (9 questions) ───────────────────────────────────────
        {
            id: 11,
            topic: 'Group 15 (Nitrogen Family)',
            difficulty: 'hard',
            sourceTrendIds: [11],
            stem: 'The melting points of Group 15 hydrides follow the unusual order $NH_3 > SbH_3 > AsH_3 > PH_3$. Which hydride has the highest melting point and why?',
            options: [
                { id: 'a', text: '$SbH_3$ — heaviest molecule, strongest Van der Waals forces' },
                { id: 'b', text: '$NH_3$ — strong intermolecular hydrogen bonding stabilises the solid lattice' },
                { id: 'c', text: '$BiH_3$ — most polarisable molecule' },
                { id: 'd', text: '$PH_3$ — smallest molecule, packs most efficiently in the solid' },
            ],
            answerId: 'b',
            explanation:
                '$NH_3$ has the highest melting point ($195.2$ K) because of strong intermolecular hydrogen bonding, which creates a tightly held solid lattice. Among the rest, mass-driven Van der Waals forces dominate, giving $SbH_3 > AsH_3 > PH_3$. The same hydrogen-bonding effect explains $NH_3$\'s anomalously high boiling point.',
        },
        {
            id: 12,
            topic: 'Group 15 (Nitrogen Family)',
            difficulty: 'medium',
            sourceTrendIds: [13],
            stem: 'Which Group 15 hydride is the most thermally stable?',
            options: [
                { id: 'a', text: '$BiH_3$' },
                { id: 'b', text: '$SbH_3$' },
                { id: 'c', text: '$PH_3$' },
                { id: 'd', text: '$NH_3$' },
            ],
            answerId: 'd',
            explanation:
                'Thermal stability falls down the group: $NH_3 > PH_3 > AsH_3 > SbH_3 > BiH_3$. As the central atom grows, the M–H bond lengthens and bond dissociation enthalpy drops sharply (~$389$ kJ/mol for $NH_3$ vs ~$255$ kJ/mol for $SbH_3$). $BiH_3$ is so unstable it decomposes near room temperature.',
        },
        {
            id: 13,
            topic: 'Group 15 (Nitrogen Family)',
            difficulty: 'medium',
            sourceTrendIds: [14],
            stem: 'Which of the following Group 15 hydrides is the strongest reducing agent?',
            options: [
                { id: 'a', text: '$NH_3$' },
                { id: 'b', text: '$PH_3$' },
                { id: 'c', text: '$AsH_3$' },
                { id: 'd', text: '$BiH_3$' },
            ],
            answerId: 'd',
            explanation:
                'Reducing character is inversely correlated with thermal stability — a hydride that decomposes easily readily releases H to reduce other species. So the order is $NH_3 < PH_3 < AsH_3 < SbH_3 < BiH_3$. The weakest M–H bond ($BiH_3$) makes it the strongest reductant.',
        },
        {
            id: 14,
            topic: 'Group 15 (Nitrogen Family)',
            difficulty: 'easy',
            sourceTrendIds: [15],
            stem: 'Which Group 15 hydride is the most basic (most readily donates its lone pair)?',
            options: [
                { id: 'a', text: '$NH_3$' },
                { id: 'b', text: '$PH_3$' },
                { id: 'c', text: '$AsH_3$' },
                { id: 'd', text: '$BiH_3$' },
            ],
            answerId: 'a',
            explanation:
                'Basicity follows $NH_3 > PH_3 > AsH_3 > SbH_3 > BiH_3$. The small N atom holds its lone pair tightly localised at high electron density, so $NH_3$ donates the pair vigorously. As the central atom grows, the lone pair spreads out over a larger volume — lower charge density, weaker donor.',
        },
        {
            id: 15,
            topic: 'Group 15 (Nitrogen Family)',
            difficulty: 'medium',
            sourceTrendIds: [49],
            stem: 'Which of the following is the correct order of bond angles in $NO_2^+$, $NO_2$ and $NO_2^-$?',
            options: [
                { id: 'a', text: '$NO_2^- > NO_2 > NO_2^+$' },
                { id: 'b', text: '$NO_2^+ > NO_2 > NO_2^-$' },
                { id: 'c', text: '$NO_2 > NO_2^+ > NO_2^-$' },
                { id: 'd', text: '$NO_2^+ > NO_2^- > NO_2$' },
            ],
            answerId: 'b',
            explanation:
                '$NO_2^+$ is sp-hybridised (no lone pair on N) and linear, so bond angle is $180°$. $NO_2$ has a single odd electron on N (mild repulsion), giving a bent structure with angle $\\sim 134°$. $NO_2^-$ has a full lone pair on N (stronger lp–bp repulsion), bending it further to $\\sim 115°$. Lone-pair repulsion squeezes the bond angle harder than a single odd electron does.',
        },
        {
            id: 33,
            topic: 'Group 15 (Nitrogen Family)',
            difficulty: 'medium',
            sourceTrendIds: [59],
            stem: 'Among the nitrogen trihalides $NF_3$, $NCl_3$, $NBr_3$ and $NI_3$, which is the only one stable at room temperature?',
            options: [
                { id: 'a', text: '$NF_3$' },
                { id: 'b', text: '$NCl_3$' },
                { id: 'c', text: '$NBr_3$' },
                { id: 'd', text: '$NI_3$' },
            ],
            answerId: 'a',
            explanation:
                '$NF_3$ is a stable, colourless gas (used as an etchant in semiconductor manufacturing). $NCl_3$ is an explosive yellow oil. $NBr_3$ and $NI_3$ are far worse — $NI_3 \\cdot NH_3$ famously detonates from the lightest contact. The reason: N is small, so as halogen size grows, steric strain around N rises sharply while N–X bond strength falls. F is the only halogen small and electronegative enough to give a strong, short, well-fitting N–F bond.',
        },
        {
            id: 34,
            topic: 'Group 15 (Nitrogen Family)',
            difficulty: 'hard',
            sourceTrendIds: [58],
            stem: 'The bond angles in phosphorus trihalides follow the order $PF_3(98°) < PCl_3(100°) < PBr_3(101°) < PI_3$. Why does the bond angle *increase* with halogen size, even though larger halogens are less electronegative?',
            options: [
                { id: 'a', text: '$PI_3$ has more lone pairs on P than $PF_3$' },
                { id: 'b', text: 'Larger halogens crowd each other sterically and bond pairs sit closer to P (lower X electronegativity), both opening the X–P–X angle' },
                { id: 'c', text: '$PF_3$ uses sp² hybridization; $PI_3$ uses sp³' },
                { id: 'd', text: 'Phosphorus is smaller in $PI_3$ than in $PF_3$' },
            ],
            answerId: 'b',
            explanation:
                'Two effects open the X–P–X angle as we go from F to I: (i) larger halogens crowd each other sterically, and (ii) decreasing electronegativity ($F > Cl > Br > I$) means bond pairs sit closer to P, raising bp–bp repulsion. In $PF_3$, highly electronegative F pulls bond pairs away from P, weakening repulsion and giving the smallest angle. Note this is the *opposite* pattern to Group 15 hydrides ($NH_3 > PH_3 > AsH_3$) where the central atom changes — there, the angle drops as the central atom grows.',
        },
        {
            id: 35,
            topic: 'Group 15 (Nitrogen Family)',
            difficulty: 'medium',
            sourceTrendIds: [61],
            stem: 'Among the trioxides of Group 15 elements ($N_2O_3$, $P_2O_3$, $As_2O_3$, $Sb_2O_3$, $Bi_2O_3$), which is purely basic?',
            options: [
                { id: 'a', text: '$N_2O_3$' },
                { id: 'b', text: '$P_2O_3$' },
                { id: 'c', text: '$As_2O_3$' },
                { id: 'd', text: '$Bi_2O_3$' },
            ],
            answerId: 'd',
            explanation:
                'Down Group 15, oxides shift from acidic to basic. $N_2O_3$ and $P_2O_3$ are *acidic* (give $HNO_2$ and $H_3PO_3$ with water). $As_2O_3$ and $Sb_2O_3$ are *amphoteric* (react with both acids and bases). $Bi_2O_3$ is *basic* — it dissolves only in acids, like a typical metal oxide. The pattern reflects the standard increase in metallic character down a group.',
        },
        {
            id: 36,
            topic: 'Group 15 (Nitrogen Family)',
            difficulty: 'hard',
            sourceTrendIds: [60],
            stem: 'Lewis basicity of nitrogen trihalides follows $NF_3 < NCl_3 < NBr_3 < NI_3$. The best explanation is:',
            options: [
                { id: 'a', text: '$NI_3$ has the smallest N atom among the four' },
                { id: 'b', text: 'Highly electronegative F atoms pull electron density away from N\'s lone pair, making it less available for donation' },
                { id: 'c', text: 'F has more lone pairs that block N\'s lone pair sterically' },
                { id: 'd', text: '$NI_3$ has more bonds to N than $NF_3$' },
            ],
            answerId: 'b',
            explanation:
                'Lewis basicity depends on N\'s lone-pair availability. In $NF_3$, the highly electronegative F atoms pull electron density away from N, leaving the lone pair impoverished — $NF_3$ is a *very* poor Lewis base. As halogen electronegativity drops ($F > Cl > Br > I$), more density stays on N and the lone pair becomes increasingly available. $NI_3$ is the strongest donor in the series. The same reasoning explains why $NH_3$ has a much larger dipole moment than $NF_3$.',
        },
        {
            id: 39,
            topic: 'Group 15 (Nitrogen Family)',
            difficulty: 'medium',
            sourceTrendIds: [64],
            stem: 'Among the nitrogen oxides $N_2O$, $NO$, $N_2O_3$, $N_2O_4$ and $N_2O_5$, which is the most strongly acidic?',
            options: [
                { id: 'a', text: '$N_2O$' },
                { id: 'b', text: '$NO$' },
                { id: 'c', text: '$N_2O_3$' },
                { id: 'd', text: '$N_2O_5$' },
            ],
            answerId: 'd',
            explanation:
                'Acidic character of $NO_x$ rises with the oxidation state of nitrogen. $N_2O$ (N is +1) and $NO$ (+2) are essentially *neutral* — they don\'t form acids in water. $N_2O_3$ (+3) is the anhydride of $HNO_2$. $N_2O_4$ (+4) disproportionates to $HNO_2 + HNO_3$. $N_2O_5$ (+5) is the anhydride of nitric acid — it dissolves vigorously in water to give $HNO_3$, the standard strong mineral acid. Higher OS on N → more delocalisation in the conjugate base → stronger acid.',
        },
        {
            id: 40,
            topic: 'Group 15 (Nitrogen Family)',
            difficulty: 'hard',
            sourceTrendIds: [65],
            stem: 'In Group 15, $IE_1$ falls smoothly down the group ($N > P > As > Sb > Bi$). However, $IE_3$ falls only up to Sb and then *rises* for Bi. The best explanation is:',
            options: [
                { id: 'a', text: 'Bi has more inner shielding electrons than Sb' },
                { id: 'b', text: 'Lanthanoid contraction — poor shielding by 4f electrons raises effective nuclear charge on Bi\'s 6p electrons, making them harder to remove' },
                { id: 'c', text: 'Bi has a half-filled 6p configuration' },
                { id: 'd', text: 'Sb is more electronegative than Bi' },
            ],
            answerId: 'b',
            explanation:
                'Between Sb (period 5) and Bi (period 6) sit the 14 lanthanoids, where the 4f shell fills. The 4f electrons shield extremely poorly, so Bi\'s outer 6p electrons feel a higher effective nuclear charge than expected. This raises $IE_2$ and $IE_3$ for Bi above the Sb value, breaking the down-the-group trend. Same fingerprint as $Pb > Sn$ in Group 14 IE and $Tl$\'s anomalously high IE in Group 13 — all three are signatures of lanthanoid contraction in the heavy p-block.',
        },

        // ───── Group 16 (4 questions) ───────────────────────────────────────
        {
            id: 16,
            topic: 'Group 16 (Chalcogens)',
            difficulty: 'medium',
            sourceTrendIds: [20],
            stem: 'The H–O–H bond angle in $H_2O$ is $104°$ but the H–S–H angle in $H_2S$ is only $92°$. The reason is:',
            options: [
                { id: 'a', text: 'Sulphur has a smaller atomic radius than oxygen' },
                { id: 'b', text: 'In $H_2S$ bonding electrons sit far from S, reducing bond-pair–bond-pair repulsion and allowing pure-p bonding (~$90°$)' },
                { id: 'c', text: '$H_2O$ uses sp hybrid orbitals, $H_2S$ uses sp³' },
                { id: 'd', text: '$H_2S$ has more lone pairs than $H_2O$' },
            ],
            answerId: 'b',
            explanation:
                'In $H_2O$ the small, highly electronegative O pulls bond pairs close, increasing bp–bp repulsion and pushing the angle outward to $104°$ (sp³-like). In $H_2S$, the S–H bonds are longer and the bond pairs sit far from S, so repulsion is small — the bonds use almost pure p-orbitals (Drago\'s rule), giving the natural $90°$ p–p angle. The same trend continues in $H_2Se$ ($91°$) and $H_2Te$ ($90°$).',
        },
        {
            id: 17,
            topic: 'Group 16 (Chalcogens)',
            difficulty: 'medium',
            sourceTrendIds: [22],
            stem: 'Sulphur readily forms $S_8$ rings and long $S_n$ chains, but oxygen exists almost exclusively as $O_2$. The key reason is:',
            options: [
                { id: 'a', text: 'O–O single bonds are much stronger than S–S' },
                { id: 'b', text: 'Sulphur is more electronegative than oxygen' },
                { id: 'c', text: 'Lone-pair–lone-pair repulsion weakens the O–O single bond, while S–S is stronger because S is larger' },
                { id: 'd', text: 'Oxygen forms a stronger metallic bond than sulphur' },
            ],
            answerId: 'c',
            explanation:
                'In O–O, the two small oxygen atoms have multiple lone pairs uncomfortably close, leading to strong electron-pair repulsion that weakens the single bond ($\\sim 142$ kJ/mol). S is larger, so S–S lone pairs sit further apart and the bond is much stronger ($\\sim 226$ kJ/mol). Strong S–S bonds enable extensive catenation; weak O–O bonds limit oxygen mostly to $O=O$ (which uses a strong $\\pi$ system instead).',
        },
        {
            id: 18,
            topic: 'Group 16 (Chalcogens)',
            difficulty: 'hard',
            sourceTrendIds: [18],
            stem: 'In Group 16, the element with the *least* negative electron gain enthalpy (excluding Po) is oxygen. The reason is:',
            options: [
                { id: 'a', text: 'Oxygen already has a half-filled valence shell' },
                { id: 'b', text: 'High inter-electronic repulsion in the small, compact 2p orbital opposes electron addition' },
                { id: 'c', text: 'Oxygen has a higher ionization enthalpy than sulphur' },
                { id: 'd', text: 'Oxygen forms strong $\\pi$ bonds, making electron addition unfavourable' },
            ],
            answerId: 'b',
            explanation:
                'The 2p orbital of O is small and already crowded with electrons. Adding another electron forces it into a tight, electron-rich region, so the energy released (electron gain enthalpy) is partially offset by inter-electronic repulsion. Sulphur\'s 3p orbital is larger and roomier, so $S$ accommodates the extra electron more comfortably and has a more negative $\\Delta_{eg}H$. The same reasoning explains $F < Cl$ for halogen EA.',
        },
        {
            id: 19,
            topic: 'Group 16 (Chalcogens)',
            difficulty: 'easy',
            sourceTrendIds: [19],
            stem: 'Excluding $H_2O$, which Group 16 hydride has the highest boiling point?',
            options: [
                { id: 'a', text: '$H_2S$' },
                { id: 'b', text: '$H_2Se$' },
                { id: 'c', text: '$H_2Te$' },
                { id: 'd', text: 'They are all approximately equal' },
            ],
            answerId: 'c',
            explanation:
                'For Group 16 hydrides without hydrogen bonding, BP rises with molecular mass because Van der Waals forces dominate. $H_2Te$ is the heaviest, so it has the highest BP. The full order excluding water is $H_2S < H_2Se < H_2Te$. $H_2O$ sits anomalously above all three because of strong intermolecular hydrogen bonding.',
        },

        // ───── Group 17 (5 questions) ───────────────────────────────────────
        {
            id: 20,
            topic: 'Group 17 (Halogens)',
            difficulty: 'medium',
            sourceTrendIds: [25],
            stem: 'Which is the strongest acid among the hydrogen halides?',
            options: [
                { id: 'a', text: '$HF$' },
                { id: 'b', text: '$HCl$' },
                { id: 'c', text: '$HBr$' },
                { id: 'd', text: '$HI$' },
            ],
            answerId: 'd',
            explanation:
                'Acid strength order: $HF < HCl < HBr < HI$. Acidity is governed by H–X bond dissociation enthalpy, which falls down the group as H–X bond length increases. $H–I$ is the weakest H–X bond, so it releases $H^+$ most readily. Counter-intuitively, $HF$ is the *weakest* acid in this series despite F being the most electronegative — its strong H–F bond holds the proton tightly.',
        },
        {
            id: 21,
            topic: 'Group 17 (Halogens)',
            difficulty: 'medium',
            sourceTrendIds: [27],
            stem: 'Which halogen is the strongest oxidising agent in aqueous solution?',
            options: [
                { id: 'a', text: '$F_2$' },
                { id: 'b', text: '$Cl_2$' },
                { id: 'c', text: '$Br_2$' },
                { id: 'd', text: '$I_2$' },
            ],
            answerId: 'a',
            explanation:
                'Oxidising power follows $F_2 > Cl_2 > Br_2 > I_2$. $F_2$ is the strongest oxidant because it combines (i) low bond dissociation enthalpy of $F_2$ (lone-pair–lone-pair repulsion makes F–F weak) and (ii) very high hydration enthalpy of $F^-$ (small ion, strong solvation). Both factors release a lot of energy when $F_2$ accepts electrons in solution.',
        },
        {
            id: 22,
            topic: 'Group 17 (Halogens)',
            difficulty: 'medium',
            sourceTrendIds: [28],
            stem: 'For oxoacids of halogens at the *same* oxidation state of the central atom, the acid strength order is:',
            options: [
                { id: 'a', text: '$HIO > HBrO > HClO$' },
                { id: 'b', text: '$HClO > HBrO > HIO$' },
                { id: 'c', text: '$HBrO > HClO > HIO$' },
                { id: 'd', text: 'They are all of equal strength' },
            ],
            answerId: 'b',
            explanation:
                'For the same oxidation state (+1 here), acid strength depends on the electronegativity of the halogen. More electronegative central atoms pull electron density away from the O–H bond, weakening it and making $H^+$ release easier. So $HClO > HBrO > HIO$. (Note: this is the *opposite* trend from the HX series, where bond dissociation enthalpy dominates.)',
        },
        {
            id: 23,
            topic: 'Group 17 (Halogens)',
            difficulty: 'easy',
            sourceTrendIds: [47],
            stem: 'Which halogen exists as a solid at room temperature?',
            options: [
                { id: 'a', text: '$F_2$' },
                { id: 'b', text: '$Cl_2$' },
                { id: 'c', text: '$Br_2$' },
                { id: 'd', text: '$I_2$' },
            ],
            answerId: 'd',
            explanation:
                'Melting points (and hence physical states) follow the regular Van der Waals trend for halogens: $F_2$ (gas, MP $-220°C$) $< Cl_2$ (gas, MP $-101°C$) $< Br_2$ (liquid, MP $-7°C$) $< I_2$ (solid, MP $114°C$). The order is monotonic — no anomalies here, since hydrogen bonding is absent in $X_2$ molecules.',
        },
        {
            id: 24,
            topic: 'Group 17 (Halogens)',
            difficulty: 'hard',
            sourceTrendIds: [40],
            stem: 'The bond angle in $Cl_2O$ is larger than that in $OF_2$. The best explanation is:',
            options: [
                { id: 'a', text: 'F is more electronegative than Cl, contracting the bond angle' },
                { id: 'b', text: 'Steric repulsion between large Cl atoms in $Cl_2O$ pushes the angle open' },
                { id: 'c', text: 'O–F bonds are shorter than O–Cl bonds' },
                { id: 'd', text: '$OF_2$ has more lone pairs than $Cl_2O$' },
            ],
            answerId: 'b',
            explanation:
                'In $OF_2$, the high electronegativity of F pulls bonding electrons away from O, reducing bp–bp repulsion at the central oxygen and giving an angle of $\\sim 103°$. In $Cl_2O$, the much larger Cl atoms sit closer to each other and repel sterically, opening the angle to $\\sim 110°$. Both effects exist, but in $Cl_2O$ steric crowding wins.',
        },
        {
            id: 37,
            topic: 'Group 17 (Halogens)',
            difficulty: 'hard',
            sourceTrendIds: [62],
            stem: 'Among the hydrogen halides, which has the highest *melting* point?',
            options: [
                { id: 'a', text: '$HCl$' },
                { id: 'b', text: '$HBr$' },
                { id: 'c', text: '$HF$' },
                { id: 'd', text: '$HI$' },
            ],
            answerId: 'd',
            explanation:
                'MP order: $HI(-50°C) > HF(-83.6°C) > HBr(-86°C) > HCl(-114°C)$. Counter-intuitively, $HI$ tops the MP list because Van der Waals forces (which scale with size/mass) dominate in the solid lattice — and HI is the heaviest. $HF$ comes second due to H-bonding. **This is different from BP order** ($HF > HI > HBr > HCl$), where H-bonding networks matter more in the liquid state and lift HF above HI. Both anomalies are JEE/NEET favourites.',
        },
        {
            id: 38,
            topic: 'Group 17 (Halogens)',
            difficulty: 'hard',
            sourceTrendIds: [63],
            stem: 'Among $HClO$, $HClO_2$, $HClO_3$ and $HClO_4$, which is the strongest *oxidising* agent in aqueous solution?',
            options: [
                { id: 'a', text: '$HClO$' },
                { id: 'b', text: '$HClO_2$' },
                { id: 'c', text: '$HClO_3$' },
                { id: 'd', text: '$HClO_4$' },
            ],
            answerId: 'a',
            explanation:
                'Oxidising power is the **inverse** of acid strength here. $HClO$ has Cl in the $+1$ state with a single, easily-released O atom — kinetically reactive, generates nascent oxygen and hypochlorite readily. $HClO_4$ has Cl in $+7$ but is so resonance-stabilised that it\'s kinetically reluctant to oxidise. So while $HClO_4 > HClO_3 > HClO_2 > HClO$ for *acid strength*, oxidising power follows $HClO > HClO_2 > HClO_3 > HClO_4$. Students who memorise only the acidity order get this question wrong — a perennial JEE/NEET trap.',
        },

        // ───── Misc / PYQ Specials (6 questions) ────────────────────────────
        {
            id: 25,
            topic: 'Noble Gases',
            difficulty: 'medium',
            sourceTrendIds: [50],
            stem: 'Why do noble gases have large positive (rather than negative) electron gain enthalpy values?',
            options: [
                { id: 'a', text: 'They are too unreactive to gain electrons' },
                { id: 'b', text: 'Adding an electron forces it into the next higher principal quantum shell, which is energetically unfavourable' },
                { id: 'c', text: 'Their nuclei have very low effective charge' },
                { id: 'd', text: 'They already exist as anions in nature' },
            ],
            answerId: 'b',
            explanation:
                'Noble gases have completely filled $ns^2 np^6$ valence shells. Any added electron must go into the next $(n+1)s$ orbital, which is much higher in energy. This costs energy rather than releasing it — hence positive $\\Delta_{eg}H$. This is the reason noble gases are extremely reluctant to form anions and remain monatomic.',
        },
        {
            id: 26,
            topic: 'Noble Gases',
            difficulty: 'easy',
            sourceTrendIds: [41],
            stem: 'Which noble gas has the lowest boiling point?',
            options: [
                { id: 'a', text: 'He' },
                { id: 'b', text: 'Ne' },
                { id: 'c', text: 'Ar' },
                { id: 'd', text: 'Xe' },
            ],
            answerId: 'a',
            explanation:
                'Noble gases are held together only by weak London dispersion forces, which scale with atomic size and electron count. Helium is the smallest and least polarisable, so its dispersion forces are minimal — He has the lowest BP of *any* substance ($4.2$ K). The full order is $He < Ne < Ar < Kr < Xe < Rn$.',
        },
        {
            id: 27,
            topic: 'Amphoteric Oxides',
            difficulty: 'medium',
            sourceTrendIds: [54],
            stem: 'Which of the following oxides is amphoteric (reacts with both acids and bases)?',
            options: [
                { id: 'a', text: '$CO$' },
                { id: 'b', text: '$N_2O$' },
                { id: 'c', text: '$Al_2O_3$' },
                { id: 'd', text: '$MgO$' },
            ],
            answerId: 'c',
            explanation:
                '$Al_2O_3$ dissolves in HCl (acting as a base) and in NaOH (acting as an acid, forming $NaAlO_2$) — it is the textbook amphoteric oxide. Other amphoteric oxides include $BeO$, $ZnO$, $Ga_2O_3$, $SnO/SnO_2$, $PbO/PbO_2$. $CO$, $NO$ and $N_2O$ are *neutral*. $MgO$ is purely basic.',
        },
        {
            id: 28,
            topic: 'Catenation',
            difficulty: 'medium',
            sourceTrendIds: [45],
            stem: 'Phosphorus shows a stronger tendency for catenation (forming P–P bonds in $P_4$ and polyphosphates) than nitrogen. Why?',
            options: [
                { id: 'a', text: 'Phosphorus is more electronegative than nitrogen' },
                { id: 'b', text: 'Lone-pair–lone-pair repulsion is significant in N–N (small atoms), much weaker in P–P (larger atoms)' },
                { id: 'c', text: 'Nitrogen lacks d-orbitals' },
                { id: 'd', text: 'Phosphorus has a half-filled valence shell' },
            ],
            answerId: 'b',
            explanation:
                'In a single N–N bond, the two small N atoms have multiple lone pairs uncomfortably close, causing significant electron-pair repulsion that weakens the bond. P is larger, so P–P lone pairs sit further apart and the bond is stronger. This parallels the O–O vs S–S story. As a result, $P_4$ and polyphosphate $P–O–P$ chains are common, but N catenates only minimally (mostly via $\\pi$ systems like $N_2$, azides).',
        },
        {
            id: 29,
            topic: 'Inert Pair Effect',
            difficulty: 'medium',
            sourceTrendIds: [17],
            stem: 'Why is $Pb^{4+}$ a strong oxidising agent in aqueous solution?',
            options: [
                { id: 'a', text: '$Pb$ has the highest electronegativity in Group 14' },
                { id: 'b', text: 'The 6s² inert pair on Pb prefers to remain non-bonding, so $Pb^{4+}$ readily gains 2 electrons to become the more stable $Pb^{2+}$' },
                { id: 'c', text: '$Pb^{4+}$ has a half-filled d-subshell' },
                { id: 'd', text: 'Pb has fewer protons than Sn' },
            ],
            answerId: 'b',
            explanation:
                'Inert pair effect: the 6s² electrons on Pb are reluctant to participate in bonding because of poor shielding by intervening 4f and 5d electrons (relativistic + lanthanoid contraction). So $Pb^{2+}$ (with the 6s² pair retained) is much more stable than $Pb^{4+}$. Whenever $Pb^{4+}$ is forced into a compound, it strongly oxidises whatever is nearby to revert to $Pb^{2+}$ — that is why $PbO_2$ is a powerful oxidiser used in lead-acid batteries.',
        },
        {
            id: 30,
            topic: 'Fajans\' Rule',
            difficulty: 'medium',
            sourceTrendIds: [39],
            stem: 'Which of the following sodium halides has the maximum ionic character?',
            options: [
                { id: 'a', text: '$NaF$' },
                { id: 'b', text: '$NaCl$' },
                { id: 'c', text: '$NaBr$' },
                { id: 'd', text: '$NaI$' },
            ],
            answerId: 'a',
            explanation:
                'By Fajans\' rule, ionic character decreases as the anion grows larger and more polarisable. $F^-$ is the smallest, least polarisable halide, so $NaF$ is the most ionic. $I^-$ is large and easily polarised, so $NaI$ has significant covalent character. Order of ionic character: $NaF > NaCl > NaBr > NaI$. (For lithium halides the trend is the same, and $LiI$ is essentially molecular.)',
        },
    ],
    faqs: [
        {
            question: 'What does "p-block anomaly" mean?',
            answer:
                'A p-block anomaly is a property of a Group 13–18 element that breaks the regular periodic trend. Examples: Ga is smaller than Al instead of larger (d-block contraction); $BF_3$ is the *weakest* Lewis acid among boron halides instead of the strongest (back bonding); $HF$ is a weaker acid than $HCl$ despite F being more electronegative (strong H–F bond). Examiners love these because they filter out students who learnt only the headline trend.',
        },
        {
            question: 'Which p-block topics carry the highest weightage in JEE and NEET?',
            answer:
                'For JEE Main and NEET, the consistent high-yield topics are (i) Group 13: back bonding in $BX_3$, inert pair in Tl, diborane structure; (ii) Group 14: catenation, oxidation-state stability, $PbI_4$ non-existence; (iii) Group 15: hydride trends (basicity, BP, thermal stability), $NF_3$ vs $NCl_3$ hydrolysis; (iv) Group 17: $F_2$ low BDE, $HF$ anomalies, oxoacid acidities; (v) Noble gases: $XeF_n$ structures and EA values. This quiz covers all five clusters.',
        },
        {
            question: 'Are all 41 questions sourced from NCERT?',
            answer:
                'Yes — every question is built directly from trend data on the Periodic Trends study tool, which is itself derived from NCERT Class 11 (Chapters 7–10) and Class 12 (Chapters 5–6) Chemistry. We have not added out-of-syllabus content. The quiz is appropriate for JEE Main, JEE Advanced, NEET, BITSAT, and CBSE board preparation.',
        },
        {
            question: 'How does this quiz differ from the Inorganic Exceptions quiz?',
            answer:
                'The Inorganic Exceptions quiz spans s-block, p-block, d-block and f-block, sampling the most-tested anomaly from each. This P-Block Anomalies quiz drills deeper into Groups 13–18 specifically — seven questions on Group 13, six on Group 14, eleven on Group 15 (including all the trihalide and oxide anomalies, NOₓ acidity, and the Bi IE anomaly), four on Group 16, seven on Group 17 (including the HX MP/BP split and the oxoacid acidity vs oxidising-power inversion), plus six on noble gases, amphoteric oxides, catenation, the inert pair effect and Fajans\' rule. If you have time, do both: Inorganic Exceptions for breadth, P-Block Anomalies for depth.',
        },
        {
            question: 'I got the answer right but didn\'t understand the explanation — what should I do?',
            answer:
                'Open the Periodic Trends study tool and find the trend card on the same topic. Each card has the original "Examiner\'s Logic" with extra context, formulae, and worked numbers. Once the trend feels solid, retake the question. If you got the *wrong* answer, do this immediately — the gap between recognising a trend and actually applying it under exam pressure is usually only one or two careful re-reads.',
        },
    ],
    relatedLinks: [
        {
            label: 'Inorganic Chemistry Exceptions Quiz',
            href: '/quiz/chemistry/inorganic-exceptions',
            description: 'Companion 30-question quiz covering exceptions across s-block, p-block, d-block and f-block. Pair with this one for full coverage.',
        },
        {
            label: 'Periodic Trends — Study Tool',
            href: '/periodic-trends',
            description: 'Interactive trend graphs plus 60+ exception cards with examiner logic. The source of every question in this quiz.',
        },
        {
            label: 'The Crucible — Adaptive Practice',
            href: '/the-crucible',
            description: 'Hundreds of JEE/NEET questions on the p-block elements. Practice chapter-wise with adaptive recommendations.',
        },
        {
            label: 'Inorganic Chemistry Hub',
            href: '/inorganic-chemistry-hub',
            description: 'VSEPR theory, bond angles, and structural questions for the full inorganic syllabus.',
        },
    ],
};
