
export interface TrendBlock {
    id: number;
    title: string;
    trend: string;
    logic: string;
    source?: string;
}

export interface TrendSection {
    title: string;
    description?: string;
    blocks: TrendBlock[];
}

export const inorganicTrendsData: TrendSection[] = [
    {
        title: "Section 1: The \"Anomalous\" Group 13 (Boron Family)",
        description: "Derived heavily from your notes and NCERT 11th P-Block.",
        blocks: [
            {
                id: 1,
                title: "Atomic Radii Anomaly",
                trend: "$B < Ga < Al < In < Tl$",
                logic: "Generally, size increases down a group. However, **Gallium (135 pm)** is smaller than **Aluminium (143 pm)** due to the poor shielding of 3d electrons (**d-block contraction**) which pulls the outer shell closer."
            },
            {
                id: 2,
                title: "Ionization Enthalpy (The \"W\" Graph)",
                trend: "$B > Tl > Ga > Al > In$",
                logic: "This is the most \"jumbled\" group. $Tl$ has a very high **Ionization Enthalpy** due to poor shielding of 4f electrons (**Lanthanoid contraction**), making it harder to remove electrons than $In$, $Al$, or $Ga$."
            },
            {
                id: 3,
                title: "Stability of +1 Oxidation State",
                trend: "$B < Al < Ga < In < Tl$",
                logic: "Due to the **Inert Pair Effect**, the heavier elements prefer the +1 state over the group oxidation state (+3). $Tl$ is stable as $Tl^+$, while $Al$ is stable as $Al^{3+}$."
            },
            {
                id: 4,
                title: "Reducing Power",
                trend: "$Al > Ga > In > Tl$",
                logic: "Since $Tl$ prefers the +1 state, $Tl^{3+}$ is a strong oxidizing agent (wants to gain electrons). Conversely, $Al$ prefers +3, so $Al$ metal is a strong reducing agent."
            },
            {
                id: 5,
                title: "Lewis Acidity of Boron Halides",
                trend: "$BF_3 < BCl_3 < BBr_3 < BI_3$",
                logic: "This is counter-intuitive. Fluorine is most electronegative, but $BF_3$ is the *weakest* acid. This is due to strong $p\\pi - p\\pi$ **back bonding** between the small B (2p) and F (2p) orbitals, which satisfies Boron's electron deficiency. Large Iodine cannot back-bond effectively with small Boron."
            },
            {
                id: 6,
                title: "Extent of Back Bonding in Boron Halides",
                trend: "$BF_3 > BCl_3 > BBr_3 > BI_3$",
                logic: "The extent of $p\\pi - p\\pi$ back bonding decreases as: **2p-2p** (in $BF_3$) > **2p-3p** (in $BCl_3$) > **2p-4p** (in $BBr_3$) > **2p-5p** (in $BI_3$). The overlap between orbitals of similar size (2p-2p in $BF_3$) is most effective. As halogen size increases, the orbital size mismatch with Boron's small 2p orbital reduces back bonding efficiency."
            },
            {
                id: 7,
                title: "Lewis Acidity of Group 13 Trihalides",
                trend: "$BX_3 > AlX_3 > GaX_3 > InX_3$",
                logic: "All Group 13 trihalides ($AlX_3$, $GaX_3$, $InX_3$) have **empty d-orbitals** which can accept electron pairs, making them Lewis acids. However, $BX_3$ is the strongest Lewis acid because Boron is the smallest and most electron-deficient. $BF_3$ appears less acidic among boron halides due to very good $p\\pi - p\\pi$ back bonding with Fluorine filling its electron deficiency."
            }
        ]
    },
    {
        title: "Section 2: Group 14 & 15 (Carbon & Nitrogen Families)",
        blocks: [
            {
                id: 8,
                title: "Catenation Tendency",
                trend: "$C \\gg Si > Ge \\approx Sn$",
                logic: "C-C bonds are extremely strong ($348 kJmol^{-1}$). As size increases down the group, M-M bond strength decreases, reducing catenation. $Pb$ does not show catenation."
            },
            {
                id: 9,
                title: "Ionization Enthalpy (Group 14)",
                trend: "$C > Si > Ge > Pb > Sn$",
                logic: "Note the flip at the end. $Pb$ has a higher IE than $Sn$ due to the **Lanthanoid contraction** (poor shielding of f-electrons), increasing effective nuclear charge on $Pb$."
            },
            {
                id: 10,
                title: "Boiling Point of Hydrides (Group 15)",
                trend: "$PH_3 < AsH_3 < NH_3 < SbH_3 < BiH_3$",
                logic: "Boiling point generally increases with mass (Van der Waals forces). However, $NH_3$ has an anomalously high BP due to **Hydrogen Bonding**. It sits between $As$ and $Sb$."
            },
            {
                id: 11,
                title: "Melting Point of Hydrides (Group 15)",
                trend: "$\\underset{\\color{orange}195.2K}{NH_3} > \\underset{\\color{orange}185K}{SbH_3} > \\underset{\\color{orange}157K}{AsH_3} > \\underset{\\color{orange}140K}{PH_3}$",
                logic: "$NH_3$ has the highest melting point due to **Hydrogen Bonding** which creates a more ordered solid structure. Among the rest, heavier hydrides ($SbH_3$) have higher MP due to stronger Van der Waals forces."
            },
            {
                id: 12,
                title: "Bond Angle of Hydrides (Group 15)",
                trend: "$\\underset{\\color{orange}107.8°}{NH_3} > \\underset{\\color{orange}93.6°}{PH_3} > \\underset{\\color{orange}91.8°}{AsH_3} > \\underset{\\color{orange}91.3°}{SbH_3}$",
                logic: "As the central atom becomes larger and less electronegative, the bond pairs differ further apart, reducing repulsion. Pure p-orbitals are used for bonding in heavier elements (Drago's rule suggestion)."
            },
            {
                id: 13,
                title: "Thermal Stability of Hydrides (Group 15)",
                trend: "$NH_3 > PH_3 > AsH_3 > SbH_3 > BiH_3$",
                logic: "As the size of the central atom increases (N to Bi), the M-H bond length increases and bond dissociation enthalpy decreases ($NH_3$: 389 kJ/mol vs $SbH_3$: 255 kJ/mol), making them less stable."
            },
            {
                id: 14,
                title: "Reducing Character of Hydrides (Group 15)",
                trend: "$NH_3 < PH_3 < AsH_3 < SbH_3 < BiH_3$",
                logic: "Directly inverse to thermal stability. Since $Bi-H$ bonds break easily, $BiH_3$ is the strongest reducing agent (gives H easily)."
            },
            {
                id: 15,
                title: "Basic Character of Hydrides",
                trend: "$NH_3 > PH_3 > AsH_3 > SbH_3 > BiH_3$",
                logic: "High electron density on the small Nitrogen atom makes the lone pair available for donation. Large atoms disperse the charge, reducing basicity."
            },
            {
                id: 16,
                title: "Thermal Stability of Group 14 Halides",
                trend: "$CX_4 > SiX_4 > GeX_4 > SnX_4 > PbX_4$ and $MF_4 > MCl_4 > MBr_4 > MI_4$",
                logic: "Stability decreases down the group as M-X bond strength decreases with increasing size. For a given metal, fluorides are most stable. Note: $PbI_4$ **does not exist** because $Pb^{4+}$ is a strong oxidizing agent and $I^-$ is a reducing agent - they react to give $PbI_2$ and $I_2$."
            },
            {
                id: 17,
                title: "Oxidation State Stability (+4 State)",
                trend: "$C^{4+} > Si^{4+} > Ge^{4+} > Sn^{4+} > Pb^{4+}$",
                logic: "Due to the **Inert Pair Effect**, stability of +4 state decreases down the group. $Pb^{4+}$ is a strong **oxidizing agent** (wants to become $Pb^{2+}$). $Pb^{2+}$ is more stable than $Pb^{4+}$ because of the reluctance of 6s² electrons to participate in bonding."
            }
        ]
    },
    {
        title: "Section 3: Group 16 (Chalcogens)",
        blocks: [
            {
                id: 18,
                title: "Electron Gain Enthalpy (Negative Value)",
                trend: "$S > Se > Te > Po > O$ (Order of becoming less negative)",
                logic: "Oxygen has the *least* negative value in the group (except Polonium) due to its **small size and high inter-electronic repulsion**. Sulphur has the most negative value."
            },
            {
                id: 19,
                title: "Melting/Boiling Point of Hydrides",
                trend: "$H_2S < H_2Se < H_2Te < H_2O$ (BP)",
                logic: "$H_2O$ has the highest BP due to strong **hydrogen bonding**. Among the rest, BP increases with molecular mass (Van der Waals forces)."
            },
            {
                id: 20,
                title: "Bond Angle (Group 16 Hydrides)",
                trend: "$H_2O(104^\\circ) > H_2S(92^\\circ) > H_2Se(91^\\circ) > H_2Te(90^\\circ)$",
                logic: "Same logic as Group 15. Repulsion decreases as the central atom size increases."
            },
            {
                id: 21,
                title: "Acidic Character of Hydrides",
                trend: "$H_2O < H_2S < H_2Se < H_2Te$",
                logic: "Bond dissociation energy decreases down the group ($H-Te$ is weak). A weaker bond releases $H^+$ more easily, increasing acidity."
            },
            {
                id: 22,
                title: "O-O vs S-S Bond Energy",
                trend: "$S-S > O-O$",
                logic: "The O-O single bond is weaker than S-S due to **large electron-electron repulsion** between the lone pairs on the small Oxygen atoms. This makes catenation easier for Sulphur ($S_8$) than Oxygen."
            }
        ]
    },
    {
        title: "Section 4: Group 17 (Halogens)",
        blocks: [
            {
                id: 23,
                title: "Electron Gain Enthalpy (Negative Value)",
                trend: "$Cl > F > Br > I$",
                logic: "Chlorine has the most negative $\\Delta_{eg}H$ in the periodic table. Fluorine is less negative than Chlorine because its **tiny 2p orbitals cause inter-electronic repulsion**, resisting the addition of an electron."
            },
            {
                id: 24,
                title: "Bond Dissociation Enthalpy",
                trend: "$Cl_2 > Br_2 > F_2 > I_2$",
                logic: "$F_2$ has an anomalously low bond energy (lower than $Cl$ and $Br$) because of large **lone pair-lone pair repulsion** between the two close Fluorine atoms."
            },
            {
                id: 25,
                title: "Acid Strength of Hydrogen Halides",
                trend: "$HF < HCl < HBr < HI$",
                logic: "$H-I$ bond is the longest and weakest (lowest dissociation enthalpy), so it dissociates most easily to release $H^+$."
            },
            {
                id: 26,
                title: "Boiling Point of Hydrogen Halides",
                trend: "$HCl < HBr < HI < HF$",
                logic: "$HF$ is a liquid with the highest BP due to **Hydrogen Bonding**. The others follow the mass trend (Van der Waals)."
            },
            {
                id: 27,
                title: "Oxidizing Power of Halogens",
                trend: "$F_2 > Cl_2 > Br_2 > I_2$",
                logic: "Fluorine is the strongest oxidant due to high **hydration enthalpy** of $F^-$ and low bond dissociation enthalpy of $F_2$."
            },
            {
                id: 28,
                title: "Acidic Strength of Oxoacids (Same Oxidation State)",
                trend: "$HClO > HBrO > HIO$",
                logic: "$Cl$ is more electronegative, pulling electron density away from the O-H bond, making the release of $H^+$ easier."
            },
            {
                id: 29,
                title: "Acidic Strength of Oxoacids (Different Oxidation States)",
                trend: "$HClO < HClO_2 < HClO_3 < HClO_4$",
                logic: "As the oxidation state of the central atom increases (+1 to +7), the negative charge on the conjugate base is more delocalized (**resonance stabilization**), making the acid stronger."
            }
        ]
    },
    {
        title: "Section 5: D & F Block (Transition Elements)",
        blocks: [
            {
                id: 30,
                title: "Atomic Radii (Series Comparison)",
                trend: "$3d < 4d \\approx 5d$",
                logic: "The 4d and 5d series have virtually the same radii (e.g., $Zr \\approx Hf$) due to the **Lanthanoid Contraction**. The filling of 4f orbitals (poor shielding) pulls the 5d shells in."
            },
            {
                id: 31,
                title: "Melting Points (3d Series)",
                trend: "Increases to $Cr$ ($d^5$), Dips at $Mn$ ($d^5$), Peaks again, then decreases.",
                logic: "Maxima is at $d^5$ due to maximum unpaired electrons participating in metallic bonding. $Mn$ has a surprisingly low MP because its stable half-filled $d^5$ structure leads to weaker delocalization/metallic bonding."
            },
            {
                id: 32,
                title: "Density",
                trend: "Increases across the period (Sc to Cu). $Os$ and $Ir$ have the highest density.",
                logic: "Radius decreases while mass increases, leading to a sharp increase in density."
            },
            {
                id: 33,
                title: "Magnetic Moment (Paramagnetism)",
                trend: "$Sc^{3+}(0) < Ti^{3+}(1.73) < ... < Mn^{2+}(5.92) > Fe^{2+}$",
                logic: "Magnetic moment ($\\mu = \\sqrt{n(n+2)}$) depends on the number of unpaired electrons ($n$). $Mn^{2+}$ ($d^5$) has the maximum (5) unpaired electrons."
            },
            {
                id: 34,
                title: "Ionization Enthalpy (Zn, Cd, Hg)",
                trend: "Very High.",
                logic: "These elements have a fully filled $d^{10}s^2$ configuration, making them very stable and resistant to electron removal. This explains why they are often not considered \"typical\" transition metals."
            },
            {
                id: 35,
                title: "Stability of Halides",
                trend: "Ability of Fluorine to stabilize high oxidation states ($VF_5$, $CrF_6$).",
                logic: "Fluorine is small and highly electronegative; it can stabilize the highest oxidation states of transition metals. Iodine usually stabilizes lower states ($CuI$)."
            },
            {
                id: 36,
                title: "Basic Character of Lanthanoid Hydroxides",
                trend: "$La(OH)_3 > Ce(OH)_3 > ... > Lu(OH)_3$ (Decreasing basicity)",
                logic: "Due to **Lanthanoid Contraction**, the size of the cation decreases ($La^{3+} \\to Lu^{3+}$). The M-OH bond becomes more covalent and harder to break (less $OH^-$ release)."
            },
            {
                id: 37,
                title: "3rd Ionization Enthalpy Anomaly",
                trend: "$Mn > Fe$",
                logic: "Removing the 3rd electron from $Mn$ ($d^5 \\to d^4$) breaks the stable half-filled configuration, requiring huge energy. Removing it from $Fe$ ($d^6 \\to d^5$) achieves stability, so it is easier."
            }
        ]
    },
    {
        title: "Section 6: Miscellaneous & PYQ Specials",
        blocks: [
            {
                id: 38,
                title: "Hydration Enthalpy (Alkali/Alkaline)",
                trend: "$Li^+ > Na^+ > K^+ > Rb^+ > Cs^+$",
                logic: "Smaller ions have higher charge density and attract more water molecules. This is why hydrated radius order is inverse: $Li^+_{(aq)} > Cs^+_{(aq)}$."
            },
            {
                id: 39,
                title: "Ionic Character of Halides",
                trend: "$MF > MCl > MBr > MI$",
                logic: "The ionic character decreases down the group. According to **Fajans' Rule**, as the size of the anion increases ($F^- \\to I^-$), its polarizability increases. Higher polarization of the anion by the cation leads to higher **covalent character**. Therefore, $MI$ is the most covalent and $MF$ is the most ionic."
            },
            {
                id: 40,
                title: "Bond Angle in Group 16 Dihalides",
                trend: "$OF_2 < Cl_2O$",
                logic: "In $Cl_2O$, the large Cl atoms repel each other (steric hindrance), opening up the angle. In $OF_2$, the bonding electrons are closer to F, reducing lp-bp repulsion, but the steric crowding in $Cl_2O$ dominates."
            },
            {
                id: 41,
                title: "Boiling Point of Noble Gases",
                trend: "$He < Ne < Ar < Kr < Xe$",
                logic: "Dispersion forces (Van der Waals) increase with atomic size/mass. Helium has the lowest boiling point of any substance."
            },
            {
                id: 42,
                title: "Solubility of Group 2 Sulphates",
                trend: "$BeSO_4 > MgSO_4 > CaSO_4 > SrSO_4 > BaSO_4$",
                logic: "Hydration energy decreases faster than lattice energy down the group. $Be^{2+}$ is small and heavily hydrated, making it soluble."
            },
            {
                id: 43,
                title: "Thermal Stability of Group 2 Carbonates",
                trend: "$BeCO_3 < MgCO_3 < CaCO_3 < SrCO_3 < BaCO_3$",
                logic: "Large cations stabilize large anions ($CO_3^{2-}$). Small $Be^{2+}$ polarizes the carbonate ion strongly, causing it to decompose easily."
            },
            {
                id: 44,
                title: "Oxidation State of Thallium",
                trend: "$Tl^{+1} > Tl^{+3}$",
                logic: "$TlI_3$ is actually $Tl^{+}(I_3)^{-}$, not Thallium(+3) iodide. Tl prefers +1 due to inert pair effect."
            },
            {
                id: 45,
                title: "Nitrogen's Catenation vs Phosphorus",
                trend: "$N - N < P - P$",
                logic: "Single N-N bonds are weak due to repulsion between lone pairs on the small N atoms. P-P bonds are stronger, so P shows better catenation."
            },
            {
                id: 46,
                title: "Dipole Moment of NH3 vs NF3",
                trend: "$NH_3 > NF_3$",
                logic: "In $NH_3$, the orbital dipole and bond dipoles add up. In $NF_3$, the Fluorine pulls electrons resulting in bond dipoles opposing the orbital dipole."
            },
            {
                id: 47,
                title: "Melting Point of Group 17",
                trend: "$F_2 < Cl_2 < Br_2 < I_2$",
                logic: "Regular increase with size and Van der Waals forces. $I_2$ is a solid, $Br_2$ liquid, others gases."
            },
            {
                id: 48,
                title: "Ionic Radii of Isoelectronic Species",
                trend: "$N^{3-} > O^{2-} > F^- > Na^+ > Mg^{2+} > Al^{3+}$",
                logic: "For same electron count, higher nuclear charge (protons) pulls the shell in tighter. $Al^{3+}$ has most protons, smallest size."
            },
            {
                id: 49,
                title: "Bond Angle NO2 Species",
                trend: "$NO_2^+ > NO_2 > NO_2^-$",
                logic: "$NO_2^+$ is linear (sp, 180). $NO_2$ has one odd electron (bent). $NO_2^-$ has a full lone pair (bent, more repulsion than odd electron)."
            },
            {
                id: 50,
                title: "Electron Affinity of Noble Gases",
                trend: "Large Positive Values",
                logic: "They have stable octets. You must add energy to force an electron into a higher principal quantum number shell."
            },
            {
                id: 51,
                title: "Hydrolysis of Halides",
                trend: "$NCl_3$ hydrolyzes, $NF_3$ does not",
                logic: "$NCl_3$ has vacant d-orbitals on Cl to accept water's lone pair. $NF_3$ has no vacant d-orbitals on N or F. $CCl_4$ doesn't hydrolyze (no d-orbitals), but $SiCl_4$ does."
            },
            {
                id: 52,
                title: "Order of Trans-Effect (Coordination)",
                trend: "$CN^- \\approx CO > NO_2^- > I^- > Br^- > Cl^- > NH_3 > H_2O$",
                logic: "(Often asked in context of preparation). Strong $\\pi$-acceptors have high trans-effect."
            },
            {
                id: 53,
                title: "Stability of Hydrides (Group 14)",
                trend: "$CH_4 > SiH_4 > GeH_4 > SnH_4$",
                logic: "Bond length increases, bond strength decreases."
            },
            {
                id: 54,
                title: "Amphoteric Oxides (The \"List\")",
                trend: "$Al_2O_3, Ga_2O_3, SnO, SnO_2, PbO, PbO_2, ZnO, BeO$",
                logic: "You must memorize which are amphoteric. $CO, NO, N_2O$ are Neutral. $GeO$ is acidic."
            },
            {
                id: 55,
                title: "Paramagnetic Oxide of Nitrogen",
                trend: "$NO$ and $NO_2$",
                logic: "They have an odd number of valence electrons (11 and 17 valence electrons respectively). They dimerize ($N_2O_2, N_2O_4$) to become diamagnetic."
            }
        ]
    }
];
