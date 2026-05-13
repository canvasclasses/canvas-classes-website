import { QuizData } from './types';

// 30-question revision quiz on inorganic chemistry exceptions.
//
// Every question is sourced from a specific trend block in
// app/lib/inorganicTrendsData.ts (referenced via `sourceTrendIds`). The
// `explanation` field paraphrases the `logic` from that block — never
// generated from training knowledge. If you add or replace a question,
// keep the source-trend reference accurate so the audit chain holds.

export const inorganicExceptionsQuiz: QuizData = {
    slug: 'inorganic-exceptions',
    title: 'Inorganic Chemistry Exceptions Quiz for JEE Main Revision',
    description:
        'A 30-question revision quiz on the most-tested exceptions in inorganic chemistry — periodic anomalies, s-block oddities, p-block back-bonding, inert pair effect, lanthanoid contraction, and group-trend reversals. Built from NCERT-aligned content for JEE Main, JEE Advanced, NEET and BITSAT aspirants.',
    shortLabel: 'Inorganic Exceptions',
    datePublished: '2026-05-06',
    dateModified: '2026-05-06',
    educationalLevel: 'Class 11 / Class 12',
    targetExams: ['JEE Main', 'JEE Advanced', 'NEET', 'BITSAT'],
    keywords: [
        'inorganic chemistry exceptions',
        'inorganic exceptions quiz',
        'periodic table exceptions',
        'periodic trends and exceptions',
        'JEE Main inorganic chemistry quiz',
        'NEET inorganic chemistry MCQ',
        's-block exceptions',
        'p-block exceptions',
        'd-block anomalies',
        'inert pair effect MCQ',
        'lanthanoid contraction MCQ',
        'back bonding MCQ',
        'Fajans rule MCQ',
        'inorganic chemistry revision quiz',
    ],
    learningOutcomes: [
        'Recognise the most commonly tested anomalies across s-block, p-block, d-block and f-block',
        'Apply the inert pair effect, lanthanoid contraction, back bonding and Fajans\' rule to predict exceptions',
        'Distinguish exception-driven trends from regular periodic trends in JEE / NEET MCQs',
        'Recall the canonical exception examples (Li_2CO_3 decomposing, NF_3 not hydrolysing, F_2 low BDE, etc.) on demand',
    ],
    questions: [
        // ───── S-Block (4 questions) ────────────────────────────────────────
        {
            id: 1,
            topic: 'S-Block',
            difficulty: 'easy',
            sourceTrendIds: [101],
            stem: 'Which of the following represents the correct order of thermal stability of Group 1 hydrides?',
            options: [
                { id: 'a', text: '$LiH < NaH < KH < RbH < CsH$' },
                { id: 'b', text: '$LiH > NaH > KH > RbH > CsH$' },
                { id: 'c', text: '$NaH > LiH > KH > RbH > CsH$' },
                { id: 'd', text: '$LiH > KH > NaH > RbH > CsH$' },
            ],
            answerId: 'b',
            explanation:
                'As you go down Group 1, the cation grows larger and the ionic M–H bond lengthens and weakens. A weaker bond decomposes at a lower temperature. $LiH$ has the smallest cation and the strongest bond, so it is the most thermally stable Group 1 hydride.',
        },
        {
            id: 2,
            topic: 'S-Block',
            difficulty: 'easy',
            sourceTrendIds: [102, 104],
            stem: 'Among the Group 2 oxides $BeO$, $MgO$, $CaO$ and $SrO$, which one is amphoteric?',
            options: [
                { id: 'a', text: '$MgO$' },
                { id: 'b', text: '$CaO$' },
                { id: 'c', text: '$BeO$' },
                { id: 'd', text: '$SrO$' },
            ],
            answerId: 'c',
            explanation:
                '$BeO$ is amphoteric — it reacts with both acids and bases. The other Group 2 oxides become progressively more basic down the group as the cation grows and the M–O bond becomes more ionic. $Be(OH)_2$ is similarly amphoteric while $Ba(OH)_2$ is a strong base.',
        },
        {
            id: 3,
            topic: 'S-Block',
            difficulty: 'medium',
            sourceTrendIds: [106],
            stem: 'Which alkali metal carbonate is the only one that decomposes on heating to give the corresponding oxide and $CO_2$?',
            options: [
                { id: 'a', text: '$Na_2CO_3$' },
                { id: 'b', text: '$K_2CO_3$' },
                { id: 'c', text: '$Li_2CO_3$' },
                { id: 'd', text: '$Cs_2CO_3$' },
            ],
            answerId: 'c',
            explanation:
                '$Li_2CO_3 \\rightarrow Li_2O + CO_2$ on heating. The very small $Li^+$ has high polarising power and destabilises the carbonate ion. All heavier alkali carbonates ($Na_2CO_3$, $K_2CO_3$, $Rb_2CO_3$, $Cs_2CO_3$) are thermally stable. This is a classic anomaly of lithium driven by its diagonal relationship with magnesium.',
        },
        {
            id: 4,
            topic: 'S-Block',
            difficulty: 'medium',
            sourceTrendIds: [109, 42],
            stem: 'Which of the following is the correct order of solubility in water for Group 2 sulphates?',
            options: [
                { id: 'a', text: '$BaSO_4 > SrSO_4 > CaSO_4 > MgSO_4 > BeSO_4$' },
                { id: 'b', text: '$BeSO_4 > MgSO_4 > CaSO_4 > SrSO_4 > BaSO_4$' },
                { id: 'c', text: '$MgSO_4 > BeSO_4 > CaSO_4 > BaSO_4 > SrSO_4$' },
                { id: 'd', text: '$CaSO_4 > MgSO_4 > BeSO_4 > BaSO_4 > SrSO_4$' },
            ],
            answerId: 'b',
            explanation:
                '$SO_4^{2-}$ is a large anion, so lattice energy barely changes down the group, but hydration enthalpy of $M^{2+}$ falls sharply as the cation grows. $Be^{2+}$ has very high hydration enthalpy, making $BeSO_4$ highly soluble; $Ba^{2+}$ has low hydration enthalpy, so $BaSO_4$ is nearly insoluble (used in X-ray barium meals).',
        },

        // ───── Group 13 (4 questions) ───────────────────────────────────────
        {
            id: 5,
            topic: 'Group 13 (Boron Family)',
            difficulty: 'medium',
            sourceTrendIds: [1],
            stem: 'In Group 13, which element has a smaller atomic radius than the element directly above it, breaking the down-the-group size trend?',
            options: [
                { id: 'a', text: 'Boron' },
                { id: 'b', text: 'Aluminium' },
                { id: 'c', text: 'Gallium' },
                { id: 'd', text: 'Indium' },
            ],
            answerId: 'c',
            explanation:
                'Atomic size generally increases down a group, but $Ga$ ($135$ pm) is smaller than $Al$ ($143$ pm). The reason is the poor shielding of the intervening 3d electrons (d-block contraction) which raises effective nuclear charge on the outer 4p electron and pulls the shell closer.',
        },
        {
            id: 6,
            topic: 'Group 13 (Boron Family)',
            difficulty: 'hard',
            sourceTrendIds: [2],
            stem: 'After Boron, which Group 13 element has the highest first ionization enthalpy?',
            options: [
                { id: 'a', text: 'Aluminium' },
                { id: 'b', text: 'Gallium' },
                { id: 'c', text: 'Indium' },
                { id: 'd', text: 'Thallium' },
            ],
            answerId: 'd',
            explanation:
                'Group 13 ionization enthalpy follows the irregular order $B > Tl > Ga > Al > In$ (the so-called "W graph"). $Tl$ has anomalously high IE because of poor shielding by intervening 4f electrons (lanthanoid contraction), which raises the effective nuclear charge on the outer 6p electron.',
        },
        {
            id: 7,
            topic: 'Group 13 (Boron Family)',
            difficulty: 'medium',
            sourceTrendIds: [3],
            stem: 'Stability of the +1 oxidation state in Group 13 follows the order:',
            options: [
                { id: 'a', text: '$B > Al > Ga > In > Tl$' },
                { id: 'b', text: '$Al > B > Tl > In > Ga$' },
                { id: 'c', text: '$B < Al < Ga < In < Tl$' },
                { id: 'd', text: '$Tl < In < Ga < Al < B$' },
            ],
            answerId: 'c',
            explanation:
                'The inert pair effect makes heavier Group 13 elements increasingly prefer the +1 state over the group oxidation state (+3). The 6s² electrons in $Tl$ are reluctant to participate in bonding, so $Tl^+$ is the most stable +1 ion of the group, while $B$ shows essentially no +1 chemistry.',
        },
        {
            id: 8,
            topic: 'Group 13 (Boron Family)',
            difficulty: 'medium',
            sourceTrendIds: [5, 6],
            stem: 'Which of the following is the correct order of Lewis acidity of boron trihalides?',
            options: [
                { id: 'a', text: '$BF_3 > BCl_3 > BBr_3 > BI_3$' },
                { id: 'b', text: '$BI_3 > BBr_3 > BCl_3 > BF_3$' },
                { id: 'c', text: '$BCl_3 > BBr_3 > BI_3 > BF_3$' },
                { id: 'd', text: '$BBr_3 > BI_3 > BCl_3 > BF_3$' },
            ],
            answerId: 'b',
            explanation:
                'Counter-intuitively, $BF_3$ is the *weakest* Lewis acid of the boron halides despite F being most electronegative. Strong $p\\pi$–$p\\pi$ back bonding between the small B (2p) and F (2p) orbitals partially satisfies boron\'s electron deficiency. As halogen size grows ($Cl \\to I$), back-bonding weakens and Lewis acidity rises.',
        },

        // ───── Group 14 & 15 (5 questions) ──────────────────────────────────
        {
            id: 9,
            topic: 'Group 14 & 15',
            difficulty: 'easy',
            sourceTrendIds: [8],
            stem: 'Which Group 14 element shows the strongest tendency for catenation?',
            options: [
                { id: 'a', text: 'Silicon' },
                { id: 'b', text: 'Carbon' },
                { id: 'c', text: 'Germanium' },
                { id: 'd', text: 'Tin' },
            ],
            answerId: 'b',
            explanation:
                'Catenation tendency follows $C \\gg Si > Ge \\approx Sn$, with $Pb$ showing essentially no catenation. The C–C bond is exceptionally strong (~$348$ kJ/mol). As atomic size grows down the group, M–M bond strength falls sharply, killing catenation.',
        },
        {
            id: 10,
            topic: 'Group 14 & 15',
            difficulty: 'medium',
            sourceTrendIds: [10],
            stem: 'Among the Group 15 hydrides, $NH_3$ has an unusually high boiling point. The reason is:',
            options: [
                { id: 'a', text: 'Larger molecular mass than $PH_3$' },
                { id: 'b', text: 'Stronger Van der Waals forces due to more electrons' },
                { id: 'c', text: 'Strong intermolecular hydrogen bonding' },
                { id: 'd', text: 'Higher polarisability of the N atom' },
            ],
            answerId: 'c',
            explanation:
                'Boiling point of Group 15 hydrides generally rises with mass (Van der Waals forces). $NH_3$ breaks the trend due to strong intermolecular hydrogen bonding from the highly electronegative N. The full BP order is $PH_3 < AsH_3 < NH_3 < SbH_3 < BiH_3$.',
        },
        {
            id: 11,
            topic: 'Group 14 & 15',
            difficulty: 'medium',
            sourceTrendIds: [12, 20],
            stem: 'Which of the following hydrides has the largest bond angle?',
            options: [
                { id: 'a', text: '$PH_3$' },
                { id: 'b', text: '$AsH_3$' },
                { id: 'c', text: '$SbH_3$' },
                { id: 'd', text: '$NH_3$' },
            ],
            answerId: 'd',
            explanation:
                'Bond angle order: $NH_3$ ($107.8°$) $> PH_3$ ($93.6°$) $> AsH_3$ ($91.8°$) $> SbH_3$ ($91.3°$). As the central atom grows larger and less electronegative, bonding electrons sit further from it and the bonds approach pure-p character (~$90°$). Only $NH_3$ retains substantial sp³ hybridisation, giving it a near-tetrahedral angle.',
        },
        {
            id: 12,
            topic: 'Group 14 & 15',
            difficulty: 'hard',
            sourceTrendIds: [16, 17],
            stem: '$PbI_4$ does not exist as a stable compound. The best explanation is:',
            options: [
                { id: 'a', text: 'Lead cannot form four bonds' },
                { id: 'b', text: '$Pb^{4+}$ oxidises $I^-$ to $I_2$, reducing itself to $Pb^{2+}$' },
                { id: 'c', text: 'Iodine atoms are too large to fit around lead' },
                { id: 'd', text: 'The ionic character is too low' },
            ],
            answerId: 'b',
            explanation:
                'Due to the inert pair effect, $Pb^{4+}$ is a strong oxidising agent — it strongly prefers $Pb^{2+}$. $I^-$ is a reducing agent. The two react internally: $PbI_4 \\rightarrow PbI_2 + I_2$, so $PbI_4$ cannot be isolated. The same effect makes $Tl^{3+}$ unstable and $TlI_3$ actually exist as $Tl^+(I_3)^-$.',
        },
        {
            id: 13,
            topic: 'Group 14 & 15',
            difficulty: 'medium',
            sourceTrendIds: [17],
            stem: 'Stability of the +4 oxidation state in Group 14 elements decreases in the order:',
            options: [
                { id: 'a', text: '$Pb > Sn > Ge > Si > C$' },
                { id: 'b', text: '$C > Si > Ge > Sn > Pb$' },
                { id: 'c', text: '$Si > C > Ge > Pb > Sn$' },
                { id: 'd', text: '$Ge > Si > C > Sn > Pb$' },
            ],
            answerId: 'b',
            explanation:
                'The inert pair effect makes the +4 state progressively less stable down the group. $C^{4+}$ (effectively $CO_2$, $CCl_4$ etc.) is most stable; $Pb^{4+}$ is a strong oxidiser that readily reverts to $Pb^{2+}$, where the 6s² lone pair stays inert.',
        },

        // ───── Group 16 (3 questions) ───────────────────────────────────────
        {
            id: 14,
            topic: 'Group 16 (Chalcogens)',
            difficulty: 'medium',
            sourceTrendIds: [18, 23],
            stem: 'Among Group 16 elements, oxygen has a less negative electron gain enthalpy than expected. The reason is the same as why fluorine has a less negative $\\Delta_{eg}H$ than chlorine. That reason is:',
            options: [
                { id: 'a', text: 'Oxygen is more electronegative than sulphur' },
                { id: 'b', text: 'High inter-electronic repulsion in the small 2p orbital resists electron addition' },
                { id: 'c', text: 'Oxygen has a half-filled 2p subshell' },
                { id: 'd', text: 'Oxygen forms strong $\\pi$ bonds' },
            ],
            answerId: 'b',
            explanation:
                'The 2p orbital in $O$ (and similarly in $F$) is small and already crowded with electrons. Adding another electron causes large inter-electronic repulsion that partially offsets the energy released. The roomier 3p orbital of $S$ (and $Cl$) accommodates the new electron more comfortably, so $S$ has the most negative $\\Delta_{eg}H$ in Group 16.',
        },
        {
            id: 15,
            topic: 'Group 16 (Chalcogens)',
            difficulty: 'easy',
            sourceTrendIds: [19],
            stem: '$H_2O$ has the highest boiling point among Group 16 hydrides because:',
            options: [
                { id: 'a', text: 'Oxygen has the highest atomic mass' },
                { id: 'b', text: 'Water has the highest molecular weight in the group' },
                { id: 'c', text: 'Strong intermolecular hydrogen bonding' },
                { id: 'd', text: 'O–H bond is stronger than S–H, Se–H and Te–H' },
            ],
            answerId: 'c',
            explanation:
                'Among $H_2S$, $H_2Se$ and $H_2Te$, BP rises with molecular mass (Van der Waals). $H_2O$ sits anomalously above all three because the high electronegativity of oxygen enables strong intermolecular hydrogen bonding, raising the BP from the predicted $\\sim -90°C$ up to $100°C$.',
        },
        {
            id: 16,
            topic: 'Group 16 (Chalcogens)',
            difficulty: 'medium',
            sourceTrendIds: [21],
            stem: 'Which of the following is the correct order of acidic strength of Group 16 hydrides?',
            options: [
                { id: 'a', text: '$H_2O > H_2S > H_2Se > H_2Te$' },
                { id: 'b', text: '$H_2O < H_2S < H_2Se < H_2Te$' },
                { id: 'c', text: '$H_2Se > H_2S > H_2O > H_2Te$' },
                { id: 'd', text: '$H_2Te > H_2O > H_2Se > H_2S$' },
            ],
            answerId: 'b',
            explanation:
                'Acidity is governed by H–X bond dissociation energy, which decreases down the group. The H–Te bond is the longest and weakest, releasing $H^+$ most easily. Despite being the most electronegative central atom, $H_2O$ is the weakest acid in the group.',
        },

        // ───── Group 17 (4 questions) ───────────────────────────────────────
        {
            id: 17,
            topic: 'Group 17 (Halogens)',
            difficulty: 'medium',
            sourceTrendIds: [23],
            stem: 'Which halogen has the most negative electron gain enthalpy?',
            options: [
                { id: 'a', text: 'Fluorine' },
                { id: 'b', text: 'Chlorine' },
                { id: 'c', text: 'Bromine' },
                { id: 'd', text: 'Iodine' },
            ],
            answerId: 'b',
            explanation:
                'Order: $Cl > F > Br > I$. Fluorine\'s tiny 2p orbital is already crowded, so adding an extra electron causes large inter-electronic repulsion. Chlorine\'s 3p orbital is roomier and releases more energy on electron addition. $Cl$ has the most negative $\\Delta_{eg}H$ of any element in the periodic table.',
        },
        {
            id: 18,
            topic: 'Group 17 (Halogens)',
            difficulty: 'medium',
            sourceTrendIds: [24],
            stem: 'Which halogen has the lowest bond dissociation enthalpy?',
            options: [
                { id: 'a', text: '$F_2$' },
                { id: 'b', text: '$Cl_2$' },
                { id: 'c', text: '$Br_2$' },
                { id: 'd', text: '$I_2$' },
            ],
            answerId: 'a',
            explanation:
                'Order: $Cl_2 > Br_2 > F_2 > I_2$. Even though fluorine atoms are smallest (which usually predicts a strong bond), the two fluorines\' three lone pairs each are pressed close together, causing large lone-pair–lone-pair repulsion. This weakens the F–F bond well below the Cl–Cl and Br–Br bonds — a classic favourite of JEE / NEET examiners.',
        },
        {
            id: 19,
            topic: 'Group 17 (Halogens)',
            difficulty: 'easy',
            sourceTrendIds: [26],
            stem: 'Among the hydrogen halides, which has the highest boiling point?',
            options: [
                { id: 'a', text: '$HCl$' },
                { id: 'b', text: '$HBr$' },
                { id: 'c', text: '$HI$' },
                { id: 'd', text: '$HF$' },
            ],
            answerId: 'd',
            explanation:
                'BP order: $HCl < HBr < HI < HF$. The other three follow the Van der Waals (mass) trend, but $HF$ is anomalously high because of strong intermolecular hydrogen bonding ($F$ is small, highly electronegative, and has three lone pairs). $HF$ is liquid at room temperature; the others are gases.',
        },
        {
            id: 20,
            topic: 'Group 17 (Halogens)',
            difficulty: 'medium',
            sourceTrendIds: [29],
            stem: 'Arrange the oxoacids of chlorine in increasing order of acid strength:',
            options: [
                { id: 'a', text: '$HClO_4 < HClO_3 < HClO_2 < HClO$' },
                { id: 'b', text: '$HClO < HClO_2 < HClO_3 < HClO_4$' },
                { id: 'c', text: '$HClO_2 < HClO < HClO_3 < HClO_4$' },
                { id: 'd', text: '$HClO_3 < HClO_2 < HClO < HClO_4$' },
            ],
            answerId: 'b',
            explanation:
                'Acid strength rises with the oxidation state of the central atom (+1 in $HClO$ to +7 in $HClO_4$). More terminal O atoms allow greater delocalisation of the negative charge in the conjugate base by resonance. A more stable conjugate base $\\Rightarrow$ a stronger acid. $HClO_4$ is one of the strongest known oxoacids.',
        },

        // ───── D & F-Block (4 questions) ────────────────────────────────────
        {
            id: 21,
            topic: 'D & F-Block',
            difficulty: 'medium',
            sourceTrendIds: [30, 36],
            stem: 'The atomic radii of 4d and 5d transition series elements (e.g., $Zr \\approx Hf$) are very close. The reason is:',
            options: [
                { id: 'a', text: 'Both series have the same number of d electrons' },
                { id: 'b', text: 'Lanthanoid contraction — poor shielding by 4f electrons pulls the 5d shell inward' },
                { id: 'c', text: '5d electrons are more tightly bound than 4d' },
                { id: 'd', text: 'Filling of 4d orbitals reduces effective nuclear charge' },
            ],
            answerId: 'b',
            explanation:
                'Between the 4d and 5d series sit the 14 lanthanoids, where the 4f shell is filled. The 4f electrons shield the outer shell very poorly, so effective nuclear charge rises sharply across the lanthanoids and pulls the next 5d shell closer in. The result: 5d elements are nearly identical in size to their 4d counterparts ($Zr \\approx Hf$, $Nb \\approx Ta$, $Mo \\approx W$). This is the *lanthanoid contraction*.',
        },
        {
            id: 22,
            topic: 'D & F-Block',
            difficulty: 'hard',
            sourceTrendIds: [31],
            stem: 'Manganese has an anomalously low melting point in the 3d transition series compared to its neighbours. The reason is:',
            options: [
                { id: 'a', text: '$Mn$ has the smallest atomic radius in the series' },
                { id: 'b', text: 'The stable half-filled $3d^5$ configuration leads to weaker delocalisation in metallic bonding' },
                { id: 'c', text: '$Mn$ atoms exist as $Mn_2$ dimers in the solid state' },
                { id: 'd', text: '$Mn$ has a lower atomic mass than its neighbours' },
            ],
            answerId: 'b',
            explanation:
                'Melting points across the 3d series rise as more unpaired d electrons participate in metallic bonding, peaking near $d^5$ (Cr). $Mn$ ($3d^5\\, 4s^2$) holds its $d^5$ electrons tightly in an extra-stable half-filled configuration — they participate less in delocalised metallic bonding, so $Mn$\'s metallic bonding is unusually weak and its melting point dips below both $Cr$ and $Fe$.',
        },
        {
            id: 23,
            topic: 'D & F-Block',
            difficulty: 'easy',
            sourceTrendIds: [33],
            stem: 'Which of the following ions has the maximum number of unpaired electrons (and hence the maximum spin-only magnetic moment)?',
            options: [
                { id: 'a', text: '$Sc^{3+}$' },
                { id: 'b', text: '$Ti^{3+}$' },
                { id: 'c', text: '$Mn^{2+}$' },
                { id: 'd', text: '$Zn^{2+}$' },
            ],
            answerId: 'c',
            explanation:
                'Spin-only magnetic moment is $\\mu = \\sqrt{n(n+2)}$ B.M., where $n$ is the number of unpaired electrons. $Mn^{2+}$ has a $3d^5$ configuration with five unpaired electrons (the maximum possible in d-orbitals), giving $\\mu = 5.92$ B.M. — the highest among common 3d ions. $Sc^{3+}$ ($d^0$) and $Zn^{2+}$ ($d^{10}$) are diamagnetic.',
        },
        {
            id: 24,
            topic: 'D & F-Block',
            difficulty: 'hard',
            sourceTrendIds: [37],
            stem: 'The third ionization enthalpy of $Mn$ is unusually higher than that of $Fe$. Why?',
            options: [
                { id: 'a', text: '$Mn$ has a smaller atomic radius than $Fe$' },
                { id: 'b', text: 'Removing the third electron from $Mn$ ($d^5 \\to d^4$) breaks the stable half-filled configuration' },
                { id: 'c', text: '$Fe$ has more protons in the nucleus' },
                { id: 'd', text: '$Mn$ has higher effective nuclear charge than $Fe$' },
            ],
            answerId: 'b',
            explanation:
                '$Mn^{2+}$ is $3d^5$ (stable half-filled). Removing one more electron disrupts this stability, costing extra energy. In contrast, $Fe^{2+}$ is $3d^6$ — removing one electron *gives* the stable $3d^5$ configuration, which is energetically favourable. Hence $IE_3(Mn) > IE_3(Fe)$, even though $Fe$ comes after $Mn$ in the period.',
        },

        // ───── Misc / PYQ Specials (6 questions) ────────────────────────────
        {
            id: 25,
            topic: 'Hydration & Polarisation',
            difficulty: 'easy',
            sourceTrendIds: [38],
            stem: 'Which alkali metal cation has the highest hydration enthalpy?',
            options: [
                { id: 'a', text: '$Li^+$' },
                { id: 'b', text: '$Na^+$' },
                { id: 'c', text: '$K^+$' },
                { id: 'd', text: '$Cs^+$' },
            ],
            answerId: 'a',
            explanation:
                'Hydration enthalpy rises with charge density (charge / size). $Li^+$ is the smallest alkali cation, so it attracts water molecules most strongly. Order: $Li^+ > Na^+ > K^+ > Rb^+ > Cs^+$. A direct consequence: $Li^+_{(aq)}$ is actually the *largest* alkali ion in solution because it carries the thickest hydration shell.',
        },
        {
            id: 26,
            topic: 'Fajans\' Rule',
            difficulty: 'medium',
            sourceTrendIds: [39],
            stem: 'Which lithium halide has the highest covalent character?',
            options: [
                { id: 'a', text: '$LiF$' },
                { id: 'b', text: '$LiCl$' },
                { id: 'c', text: '$LiBr$' },
                { id: 'd', text: '$LiI$' },
            ],
            answerId: 'd',
            explanation:
                'By Fajans\' rule, covalent character of an ionic compound rises as the anion grows larger and more polarisable. $I^-$ is the largest, most polarisable halide, so $LiI$ is the most covalent. $LiF$, with the small, weakly-polarisable $F^-$, is the most ionic. Order of covalent character: $LiI > LiBr > LiCl > LiF$.',
        },
        {
            id: 27,
            topic: 'Dipole Moment',
            difficulty: 'hard',
            sourceTrendIds: [46],
            stem: '$NH_3$ has a higher dipole moment than $NF_3$ even though F is more electronegative than H. The best explanation is:',
            options: [
                { id: 'a', text: '$NF_3$ is non-polar by symmetry' },
                { id: 'b', text: 'The N–H bond is shorter than the N–F bond' },
                { id: 'c', text: 'In $NF_3$, the lone-pair dipole opposes the N–F bond dipoles, partially cancelling them' },
                { id: 'd', text: 'Hydrogen bonding inflates the measured dipole of $NH_3$' },
            ],
            answerId: 'c',
            explanation:
                'Both $NH_3$ and $NF_3$ are pyramidal, so the lone pair on N contributes a dipole along the molecular axis. In $NH_3$, the N–H bond dipoles point *toward* N (since N is more electronegative than H), reinforcing the lone-pair dipole. In $NF_3$, the N–F bond dipoles point *away* from N (toward F) and oppose the lone-pair dipole, partially cancelling it. Net: $\\mu(NH_3) = 1.47$ D vs $\\mu(NF_3) = 0.24$ D.',
        },
        {
            id: 28,
            topic: 'Hydrolysis & d-orbitals',
            difficulty: 'hard',
            sourceTrendIds: [51],
            stem: '$NCl_3$ hydrolyses readily but $NF_3$ does not. The best explanation is:',
            options: [
                { id: 'a', text: '$NF_3$ is too unreactive for water to attack' },
                { id: 'b', text: 'Vacant 3d orbitals on Cl can accept a lone pair from water; F has no accessible vacant d-orbitals' },
                { id: 'c', text: '$NCl_3$ is more polar than $NF_3$' },
                { id: 'd', text: 'The N–Cl bond is shorter than the N–F bond' },
            ],
            answerId: 'b',
            explanation:
                'Hydrolysis of $NCl_3$ proceeds via lone-pair donation from water onto a vacant 3d orbital of Cl. Fluorine (period 2) has no accessible d-orbitals, so the same mechanism is unavailable to $NF_3$ — it remains kinetically inert toward water. Notice the parallel with $CCl_4$ (no d-orbitals on C) which also resists hydrolysis, while $SiCl_4$ (vacant 3d on Si) hydrolyses readily.',
        },
        {
            id: 29,
            topic: 'Isoelectronic Species',
            difficulty: 'medium',
            sourceTrendIds: [48],
            stem: 'For the isoelectronic species $N^{3-}, O^{2-}, F^-, Na^+, Mg^{2+}, Al^{3+}$, which has the smallest ionic radius?',
            options: [
                { id: 'a', text: '$N^{3-}$' },
                { id: 'b', text: '$F^-$' },
                { id: 'c', text: '$Na^+$' },
                { id: 'd', text: '$Al^{3+}$' },
            ],
            answerId: 'd',
            explanation:
                'All six species have 10 electrons (the Ne core), so size is determined entirely by nuclear charge. More protons pull the same shell tighter. $Al^{3+}$ has 13 protons — the highest in the set — so it is the smallest. The order of radii is $N^{3-} > O^{2-} > F^- > Na^+ > Mg^{2+} > Al^{3+}$.',
        },
        {
            id: 30,
            topic: 'Paramagnetism',
            difficulty: 'medium',
            sourceTrendIds: [55],
            stem: 'Which of the following oxides of nitrogen is paramagnetic in its monomeric form?',
            options: [
                { id: 'a', text: '$N_2O$' },
                { id: 'b', text: '$NO$' },
                { id: 'c', text: '$N_2O_3$' },
                { id: 'd', text: '$N_2O_5$' },
            ],
            answerId: 'b',
            explanation:
                '$NO$ has 11 valence electrons — an odd number — so one electron is unpaired in a $\\pi^*$ molecular orbital, making it paramagnetic. $NO_2$ is similarly paramagnetic (17 valence electrons). Both dimerise on cooling ($N_2O_2$, $N_2O_4$) and become diamagnetic in the solid. $N_2O$, $N_2O_3$ and $N_2O_5$ all have even electron counts and are diamagnetic.',
        },
    ],
    faqs: [
        {
            question: 'How many questions are in this inorganic exceptions quiz?',
            answer:
                'There are 30 multiple-choice questions, each with four options, the correct answer, and a detailed explanation. Every question is sourced from the inorganic trends data on the periodic-trends study tool, so the difficulty and phrasing match what JEE Main, JEE Advanced, NEET and BITSAT examiners typically ask.',
        },
        {
            question: 'Which chapters does this quiz cover?',
            answer:
                'Questions span s-block (Class 11), p-block — Groups 13, 14, 15, 16, 17 (Class 11 and 12), d & f-block transition elements (Class 12), and a few cross-chapter favourites — Fajans\' rule, hydration enthalpy, isoelectronic species, dipole moments and paramagnetism. The common thread is that every question is about an *exception* to a regular periodic trend.',
        },
        {
            question: 'Is this quiz aligned with the NCERT syllabus?',
            answer:
                'Yes. Every question is built from data and explanations that appear in NCERT Class 11 and Class 12 Chemistry. We have not added any out-of-syllabus content. The quiz is appropriate for students preparing for JEE Main, JEE Advanced, NEET, BITSAT, and CBSE board exams.',
        },
        {
            question: 'What concepts should I revise before attempting this quiz?',
            answer:
                'The exception patterns lean heavily on five ideas: (1) the inert pair effect, (2) lanthanoid contraction and d-block contraction, (3) $p\\pi$–$p\\pi$ back bonding, (4) hydrogen bonding, and (5) Fajans\' rule. If any of these feels shaky, read the corresponding trend cards on the Periodic Trends study tool first, then come back to the quiz.',
        },
        {
            question: 'Where can I practice more JEE/NEET inorganic chemistry questions?',
            answer:
                'For full chapter-wise practice with previous-year questions and adaptive recommendations, use The Crucible — Canvas Classes\' adaptive practice platform. The "Classification of Elements and Periodicity" and "p-Block Elements" chapters cover dozens of additional exception-based questions beyond this quiz.',
        },
    ],
    relatedLinks: [
        {
            label: 'Periodic Trends — Study Tool',
            href: '/periodic-trends',
            description: 'Interactive trend graphs plus 60+ exception cards with examiner logic. Read this if a question stumps you.',
        },
        {
            label: 'Interactive Periodic Table',
            href: '/interactive-periodic-table',
            description: 'Click any element to see its properties, electronic configuration, and the exceptions that apply to it.',
        },
        {
            label: 'The Crucible — Adaptive Practice',
            href: '/the-crucible',
            description: 'Hundreds of JEE/NEET questions on classification of elements, periodicity, and the p-block.',
        },
        {
            label: 'Inorganic Chemistry Hub',
            href: '/inorganic-chemistry-hub',
            description: 'VSEPR theory, bond angles, and structural questions for all of inorganic chemistry.',
        },
    ],
};
