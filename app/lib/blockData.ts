// Block-specific NCERT data - Tables and important information per block
// Used for the Block Info Panel feature

export interface BlockTableData {
    title: string;
    source: string;  // e.g., "Table 7.3"
    headers: string[];
    rows: (string | number)[][];
    notes?: string[];
    isTextOnly?: boolean;
}

export interface BlockInfo {
    name: string;
    description: string;
    tables: BlockTableData[];
    keyPoints?: string[];
}

// P-Block NCERT Tables
export const pBlockData: BlockInfo = {
    name: "p-Block Elements",
    description: "Groups 13-18: B, C, N, O, F families. Elements have valence electrons in p-orbitals.",
    keyPoints: [
        "Show variable oxidation states",
        "Form covalent compounds predominantly",
        "Include metals, metalloids, and non-metals",
        "Inert pair effect seen in heavier elements"
    ],
    tables: [
        {
            title: "Atomic and Physical Properties of Group 13 Elements",
            source: "Table 11.2",
            headers: ["Property", "Boron B", "Aluminium Al", "Gallium Ga", "Indium In", "Thallium Tl"],
            rows: [
                ["Atomic number", 5, 13, 31, 49, 81],
                ["Atomic mass(g mol⁻¹)", 10.81, 26.98, 69.72, 114.82, 204.38],
                ["Electronic configuration", "[He]2s²2p¹", "[Ne]3s²3p¹", "[Ar]3d¹⁰4s²4p¹", "[Kr]4d¹⁰5s²5p¹", "[Xe]4f¹⁴5d¹⁰6s²6p¹"],
                ["Atomic radius/pm", 85, 143, 135, 167, 170],
                ["Ionic radius M³⁺/pm", 27, 53.5, 62.0, 80.0, 88.5],
                ["Ionic radius M⁺/pm", "-", "-", 120, 140, 150],
                ["Ionization enthalpy (I) / kJ mol⁻¹", 801, 577, 579, 558, 589],
                ["Ionization enthalpy (II) / kJ mol⁻¹", 2427, 1816, 1979, 1820, 1971],
                ["Ionization enthalpy (III) / kJ mol⁻¹", 3659, 2744, 2962, 2704, 2877],
                ["Electronegativity", 2.0, 1.5, 1.6, 1.7, 1.8],
                ["Density / g cm⁻³", 2.35, 2.70, 5.90, 7.31, 11.85],
                ["Melting point / K", 2453, 933, 303, 430, 576],
                ["Boiling point / K", 3923, 2740, 2676, 2353, 1730],
                ["E⊖ / V for (M³⁺/M)", "-", -1.66, -0.56, -0.34, +1.26],
                ["E⊖ / V for (M⁺/M)", "-", +0.55, -0.79, -0.18, -0.34]
            ],
            notes: [
                "Atomic radius of Ga is less than Al due to poor shielding of d-electrons.",
                "Ga, In and Tl show +1 and +3 oxidation states but For Thallium +1 oxidation state is more stable than +3 due to inert pair effect. This makes Tl (+3) a good oxidising agent.",
                "Ionization Enthalpy 1: Max = B, Min = In",
                "Ionization Enthalpy 2: Max = B, Min = Al",
                "Ionization Enthalpy 3: Max = B, Min = In",
                "Density increases down the group.",
                "Melting point decreases upto Ga then increases.",
                "Boiling point decreases down the group."
            ]
        },
        {
            title: "Atomic and Physical Properties of Group 14 Elements",
            source: "Table 11.3",
            headers: ["Property", "Carbon C", "Silicon Si", "Germanium Ge", "Tin Sn", "Lead Pb"],
            rows: [
                ["Atomic Number", 6, 14, 32, 50, 82],
                ["Atomic mass (g mol⁻¹)", 12.01, 28.09, 72.60, 118.71, 207.2],
                ["Electronic configuration", "[He]2s²2p²", "[Ne]3s²3p²", "[Ar]3d¹⁰4s²4p²", "[Kr]4d¹⁰5s²5p²", "[Xe]4f¹⁴5d¹⁰6s²6p²"],
                ["Covalent radius/pm", 77, 118, 122, 140, 146],
                ["Ionic radius M⁴⁺/pm", "-", 40, 53, 69, 78],
                ["Ionic radius M²⁺/pm", "-", "-", 73, 118, 119],
                ["Ionization enthalpy (I) / kJ mol⁻¹", 1086, 786, 761, 708, 715],
                ["Ionization enthalpy (II) / kJ mol⁻¹", 2352, 1577, 1537, 1411, 1450],
                ["Ionization enthalpy (III) / kJ mol⁻¹", 4620, 3228, 3300, 2942, 3081],
                ["Ionization enthalpy (IV) / kJ mol⁻¹", 6220, 4354, 4409, 3929, 4082],
                ["Electronegativity", 2.5, 1.8, 1.8, 1.8, 1.9],
                ["Density / g cm⁻³", 3.51, 2.34, 5.32, 7.26, 11.34],
                ["Melting point/K", 4373, 1693, 1218, 505, 600],
                ["Boiling point/K", "-", 3550, 3123, 2896, 2024],
                ["Electrical resistivity / ohm cm", "10¹⁴-10¹⁶", 50, 50, "10⁻⁵", "2×10⁻⁵"]
            ],
            notes: [
                "Carbon has highest melting and boiling points due to strong covalent bonding.",
                "Electronegativity is nearly constant from Si to Pb (1.8 - 1.9).",
                "Stability of +2 oxidation state increases down the group (Pb²⁺ > Pb⁴⁺).",
                "Pb(+4) is a good oxidising agent e.g. PbO₂",
                "Ionization Enthalpy 1: Max = C, Min = Sn",
                "Density increases down the group.",
                "Melting point decreases from C to Sn then increases."
            ]
        },
        {
            title: "Atomic and Physical Properties of Group 15 Elements",
            source: "Table 7.1",
            headers: ["Property", "N", "P", "As", "Sb", "Bi"],
            rows: [
                ["Atomic number", 7, 15, 33, 51, 83],
                ["Atomic mass/g mol⁻¹", 14.01, 30.97, 74.92, 121.75, 208.98],
                ["Electronic configuration", "[He]2s²2p³", "[Ne]3s²3p³", "[Ar]3d¹⁰4s²4p³", "[Kr]4d¹⁰5s²5p³", "[Xe]4f¹⁴5d¹⁰6s²6p³"],
                ["Ionisation enthalpy (I) / kJ mol⁻¹", 1402, 1012, 947, 834, 703],
                ["Ionisation enthalpy (II) / kJ mol⁻¹", 2856, 1903, 1798, 1595, 1610],
                ["Ionisation enthalpy (III) / kJ mol⁻¹", 4577, 2910, 2736, 2443, 2466],
                ["Electronegativity", 3.0, 2.1, 2.0, 1.9, 1.9],
                ["Covalent radius/pm", 70, 110, 121, 141, 148],
                ["Ionic radius/pm", 171, 212, 222, 76, 103],
                ["Melting point/K", 63, 317, 1089, 904, 544],
                ["Boiling point/K", 77.2, 554, 888, 1860, 1837],
                ["Density / g cm⁻³", 0.879, 1.823, 5.778, 6.697, 9.808]
            ],
            notes: [
                "Nitrogen has unexpectedly high ionization enthalpy.",
                "Ionization Enthalpy 1: Max = N, Min = Bi (Decreases down the group)",
                "Density increases down the group.",
                "Melting point increases upto As then decreases.",
                "Boiling point increases upto Sb then decreases (Bi < Sb)."
            ]
        },
        {
            title: "Atomic and Physical Properties of Group 16 Elements",
            source: "Table 7.6",
            headers: ["Property", "O", "S", "Se", "Te", "Po"],
            rows: [
                ["Atomic number", 8, 16, 34, 52, 84],
                ["Atomic mass/g mol⁻¹", 16.00, 32.06, 78.96, 127.60, 210.00],
                ["Electronic configuration", "[He]2s²2p⁴", "[Ne]3s²3p⁴", "[Ar]3d¹⁰4s²4p⁴", "[Kr]4d¹⁰5s²5p⁴", "[Xe]4f¹⁴5d¹⁰6s²6p⁴"],
                ["Covalent radius/pm", 66, 104, 117, 137, 146],
                ["Ionic radius E²⁻/pm", 140, 184, 198, 221, 230],
                ["Electron gain enthalpy / kJ mol⁻¹", -141, -200, -195, -190, -174],
                ["Ionisation enthalpy (I) / kJ mol⁻¹", 1314, 1000, 941, 869, 813],
                ["Electronegativity", 3.50, 2.44, 2.48, 2.01, 1.76],
                ["Density / g cm⁻³", 1.32, 2.06, 4.19, 6.25, "-"],
                ["Melting point/K", 55, 393, 490, 725, 520],
                ["Boiling point/K", 90, 718, 958, 1260, 1235],
                ["Oxidation states", "-2,-1,1,2", "-2,2,4,6", "-2,2,4,6", "-2,2,4,6", "2,4"]
            ],
            notes: [
                "Oxygen has high electronegativity next to Fluorine.",
                "Electron gain enthalpy of Oxygen is less negative than Sulphur due to small size.",
                "Ionization Enthalpy 1: Max = O, Min = Po (Decreases down the group)",
                "Density increases down the group.",
                "Melting point increases upto Te then decreases.",
                "Boiling point increases upto Te then decreases."
            ]
        },
        {
            title: "Atomic and Physical Properties of Halogens (Group 17)",
            source: "Table 7.8",
            headers: ["Property", "F", "Cl", "Br", "I", "At"],
            rows: [
                ["Atomic number", 9, 17, 35, 53, 85],
                ["Atomic mass/g mol⁻¹", 19.00, 35.45, 79.90, 126.90, 210],
                ["Electronic configuration", "[He]2s²2p⁵", "[Ne]3s²3p⁵", "[Ar]3d¹⁰4s²4p⁵", "[Kr]4d¹⁰5s²5p⁵", "[Xe]4f¹⁴5d¹⁰6s²6p⁵"],
                ["Covalent radius/pm", 64, 99, 114, 133, "-"],
                ["Ionic radius X⁻/pm", 133, 184, 196, 220, "-"],
                ["Ionisation enthalpy / kJ mol⁻¹", 1680, 1256, 1142, 1008, "-"],
                ["Electron gain enthalpy / kJ mol⁻¹", -333, -349, -325, -296, "-"],
                ["Electronegativity", 4.0, 3.2, 3.0, 2.7, 2.2],
                ["Hydration Enthalpy / kJ mol⁻¹", 515, 381, 347, 305, "-"],
                ["Melting point/K", 54.4, 172.0, 265.8, 386.6, "-"],
                ["Boiling point/K", 84.9, 239.0, 332.5, 458.2, "-"],
                ["Density / g cm⁻³", 1.5, 1.66, 3.19, 4.94, "-"],
                ["Bond dissociation enthalpy / kJ mol⁻¹", 158.8, 242.6, 192.8, 151.1, "-"],
                ["Standard Electrode Potential E⊖ / V", 2.87, 1.36, 1.09, 0.54, "-"]
            ],
            notes: [
                "F has unique properties due to small size and high electronegativity.",
                "Bond dissociation enthalpy: Cl₂ > Br₂ > F₂ > I₂ (F₂ is unexpectedly low due to repulsion).",
                "Electron gain enthalpy: Cl > F > Br > I (F is less negative than Cl).",
                "Melting and Boiling points increase down the group."
            ]
        },
        {
            title: "Atomic and Physical Properties of Group 18 Elements",
            source: "Table 7.12",
            headers: ["Property", "He", "Ne", "Ar", "Kr", "Xe", "Rn"],
            rows: [
                ["Atomic number", 2, 10, 18, 36, 54, 86],
                ["Atomic mass/g mol⁻¹", 4.00, 20.18, 39.95, 83.80, 131.30, 222.00],
                ["Electronic configuration", "1s²", "[He]2s²2p⁶", "[Ne]3s²3p⁶", "[Ar]3d¹⁰4s²4p⁶", "[Kr]4d¹⁰5s²5p⁶", "[Xe]4f¹⁴5d¹⁰6s²6p⁶"],
                ["Atomic radius/pm", 120, 160, 190, 200, 220, "-"],
                ["Ionisation enthalpy / kJ mol⁻¹", 2372, 2080, 1520, 1351, 1170, 1037],
                ["Electron gain enthalpy / kJ mol⁻¹", 48, 116, 96, 96, 77, 68],
                ["Density (at STP) / g cm⁻³", "1.8×10⁻⁴", "9.0×10⁻⁴", "1.8×10⁻³", "3.7×10⁻³", "5.9×10⁻³", "9.7×10⁻³"],
                ["Melting point/K", "-", 24.6, 83.8, 115.9, 161.3, 202],
                ["Boiling point/K", 4.2, 27.1, 87.2, 119.7, 165.0, 211],
                ["Atmospheric content (% by volume)", "5.24×10⁻⁴", "1.82×10⁻³", 0.934, "1.14×10⁻⁴", "8.7×10⁻⁶", "-"]
            ],
            notes: [
                "Noble gases have very high ionization enthalpies due to stable configuration.",
                "Atomic radius increases down the group.",
                "Boiling points are very low (weak dispersion forces), increasing down the group.",
                "Argon is the most abundant noble gas in atmosphere."
            ]
        },
        {
            title: "Properties of Hydrides of Group 15",
            source: "Table 7.2",
            headers: ["Property", "NH₃", "PH₃", "AsH₃", "SbH₃", "BiH₃"],
            rows: [
                ["Melting point/K", 195.2, 139.5, 156.7, 185, "-"],
                ["Boiling point/K", 238.5, 185.5, 210.6, 254.6, 290],
                ["E-H Distance/pm", 101.7, 141.9, 151.9, 170.7, "-"],
                ["HEH angle (°)", 107.8, 93.6, 91.8, 91.3, "-"],
                ["ΔfH°/kJ mol⁻¹", -46.1, 13.4, 66.4, 145.1, 278],
                ["ΔdissH°(E-H)/kJ mol⁻¹", 389, 322, 297, 255, "-"]
            ],
            notes: [
                "NH₃ has unexpectedly high boiling point and highest melting point due to hydrogen bonding",
                "Bond angle decreases down the group (less s-character)",
                "Stability decreases down the group (ΔfH° becomes more positive)",
                "Bond dissociation enthalpy decreases down the group"
            ]
        },
        {
            title: "Properties of Hydrides of Group 16",
            source: "Table 7.7",
            headers: ["Property", "H₂O", "H₂S", "H₂Se", "H₂Te"],
            rows: [
                ["m.p/K", 273, 188, 208, 222],
                ["b.p/K", 373, 213, 232, 269],
                ["H-E distance/pm", 96, 134, 146, 169],
                ["HEH angle (°)", 104, 92, 91, 90],
                ["ΔfH/kJ mol⁻¹", -286, -20, 73, 100],
                ["Δdiss H(H-E)/kJ mol⁻¹", 463, 347, 276, 238],
                ["Dissociation constant", "1.8×10⁻¹⁶", "1.3×10⁻⁷", "1.3×10⁻⁴", "2.3×10⁻³"]
            ],
            notes: [
                "H₂O has highest melting and boiling points among group 16 hydrides due to H-Bonding",
                "Acidic strength increases down the group: H₂O < H₂S < H₂Se < H₂Te",
                "Bond angle decreases down the group due to decreasing electronegativity",
                "Reducing character increases down the group"
            ]
        },
        {
            title: "Properties of Hydrogen Halides",
            source: "Table 7.9",
            headers: ["Property", "HF", "HCl", "HBr", "HI"],
            rows: [
                ["Melting point/K", 190, 159, 185, 222],
                ["Boiling point/K", 293, 189, 206, 238],
                ["Bond length (H-X)/pm", 91.7, 127.4, 141.4, 160.9],
                ["ΔdissH°/kJ mol⁻¹", 574, 432, 363, 295],
                ["pKa", 3.2, -7.0, -9.5, -10.0]
            ],
            notes: [
                "HF has highest b.p (due to H-bonding) but HI has highest m.p",
                "Acidic strength increases down the group: HF < HCl < HBr < HI",
                "Bond dissociation enthalpy decreases down the group → easier to release H⁺",
            ]
        },
        // Restored Tables

        {
            title: "Oxides of Nitrogen",
            source: "Table 7.3",
            isTextOnly: true,
            headers: ["Name", "Formula", "O.S.", "Preparation", "Appearance"],
            rows: [
                ["Dinitrogen oxide", "N₂O", "+1", "NH₄NO₃ →Heat→ N₂O + 2H₂O", "Colourless gas, neutral"],
                ["Nitrogen monoxide", "NO", "+2", "2NaNO₂ + 2FeSO₄ + 3H₂SO₄ → ...", "Colourless gas, neutral"],
                ["Dinitrogen trioxide", "N₂O₃", "+3", "2NO + N₂O₄ →250K→ 2N₂O₃", "Blue solid, acidic"],
                ["Nitrogen dioxide", "NO₂", "+4", "2Pb(NO₃)₂ →673K→ 4NO₂ + 2PbO", "Brown gas, acidic"],
                ["Dinitrogen tetroxide", "N₂O₄", "+4", "2NO₂ ⇌ N₂O₄ (cool/heat)", "Colourless solid, acidic"],
                ["Dinitrogen pentoxide", "N₂O₅", "+5", "4HNO₃ + P₄O₁₀ → 2N₂O₅ + 4HPO₃", "Colourless solid, acidic"]
            ],
            notes: [
                "N₂O is used as anaesthetic (laughing gas)",
                "NO₂ is brown due to unpaired electron",
                "N₂O₄ ⇌ 2NO₂ equilibrium is temperature dependent",
                "Higher oxidation state = more acidic oxide"
            ]
        },
        {
            title: "Oxoacids of Phosphorus",
            source: "Table 7.5",
            isTextOnly: true,
            headers: ["Name", "Formula", "O.S.", "Characteristic bonds", "Preparation"],
            rows: [
                ["Hypophosphorous (Phosphinic)", "H₃PO₂", "+1", "One P-OH, Two P-H, One P=O", "white P₄ + alkali"],
                ["Orthophosphorous (Phosphonic)", "H₃PO₃", "+3", "Two P-OH, One P-H, One P=O", "P₂O₃ + H₂O"],
                ["Pyrophosphorous", "H₄P₂O₅", "+3", "Two P-OH, Two P-H, Two P=O", "PCl₃ + H₃PO₃"],
                ["Hypophosphoric", "H₄P₂O₆", "+4", "Four P-OH, Two P=O, One P-P", "red P₄ + alkali"],
                ["Orthophosphoric", "H₃PO₄", "+5", "Three P-OH, One P=O", "P₄O₁₀ + H₂O"],
                ["Pyrophosphoric", "H₄P₂O₇", "+5", "Four P-OH, Two P=O, One P-O-P", "heat phosphoric acid"],
                ["Metaphosphoric", "(HPO₃)ₙ", "+5", "Three P-OH, Three P=O, Three P-O-P", "phosphorus acid + Br₂, heat in sealed tube"]
            ],
            notes: [
                "Exists in polymeric forms only (Metaphosphoric)",
                "Acids with P-H bonds have strong reducing properties (e.g., H₃PO₂)",
                "P-H bonds do not ionize to give H⁺",
                "Only P-OH hydrogens are ionizable (basicity)"
            ]
        }
    ]
};

// D-Block NCERT Tables - Numeric Properties for Graphing
export const dBlockData: BlockInfo = {
    name: "d-Block Elements",
    description: "Groups 3-12: Transition metals with electrons in d-orbitals.",
    keyPoints: [
        "Variable oxidation states",
        "Coloured ions due to d-d transitions",
        "Form complex compounds",
        "Catalytic properties",
        "Paramagnetism due to unpaired electrons"
    ],
    tables: [
        {
            title: "Atomic and Physical Properties of 3d Transition Metals",
            source: "Table 8.1",
            headers: ["Property", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn"],
            rows: [
                ["Atomic number", 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
                ["Atomic mass (g mol⁻¹)", 44.96, 47.87, 50.94, 52.00, 54.94, 55.85, 58.93, 58.69, 63.55, 65.38],
                ["Metallic radius / pm", 164, 147, 135, 129, 137, 126, 125, 125, 128, 137],
                ["Ionic radius M²⁺ / pm", "-", 90, 88, 84, 80, 76, 74, 72, 72, 74],
                ["Ionic radius M³⁺ / pm", 73, 76, 74, 63, 66, 64, 63, 62, "-", "-"],
                ["Ionization enthalpy (I) / kJ mol⁻¹", 631, 658, 650, 653, 717, 762, 758, 736, 745, 906],
                ["Ionization enthalpy (II) / kJ mol⁻¹", 1235, 1310, 1414, 1592, 1509, 1561, 1644, 1752, 1958, 1733],
                ["Standard potential E⊖ (M²⁺/M) / V", "-", -1.63, -1.2, -0.91, -1.18, -0.44, -0.28, -0.26, 0.34, -0.76],
                ["Density / g cm⁻³", 2.99, 4.51, 6.11, 7.19, 7.21, 7.87, 8.90, 8.90, 8.92, 7.14],
                ["Melting Point / K", 1814, 1941, 2183, 2180, 1519, 1811, 1768, 1728, 1358, 693]
            ],
            notes: [
                "Ionization enthalpy generally increases across the series.",
                "Cr and Cu have unexpected electronic configurations (half-filled/full d-orbitals).",
                "Zn has the highest first IE due to fully filled stable 3d¹⁰ configuration.",
                "Cu has a positive E° (noble, does not react with dilute acids).",
                "Atomic radii decrease initially, then become nearly constant."
            ]
        },
        {
            title: "Standard Electrode Potentials of 3d Metals",
            source: "NCERT Table 8.2",
            headers: ["Property", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn"],
            rows: [
                ["E⊖ (M²⁺/M) / V", "-", -1.63, -1.2, -0.91, -1.18, -0.44, -0.28, -0.26, 0.34, -0.76],
                ["E⊖ (M³⁺/M²⁺) / V", "-", -0.37, -0.26, -0.41, 1.51, 0.77, 1.82, "-", "-", "-"]
            ],
            notes: [
                "Cu has positive E⊖ for M²⁺/M, hence doesn't liberate H₂ from acids.",
                "Mn³⁺/Mn²⁺ has high positive E⊖ → Mn³⁺ is a strong oxidant.",
                "Co³⁺/Co²⁺ has very high E⊖ → Co³⁺ is unstable in aqueous solution."
            ]
        },
        {
            title: "Colours of Some Common Ions of First Transition Series",
            source: "Table 8.8",
            isTextOnly: true,
            headers: ["Configuration", "Example Ion", "Colour", "Configuration", "Example Ion", "Colour"],
            rows: [
                ["3d⁰", "Sc³⁺", "Colourless", "3d⁵", "Mn²⁺", "Pink"],
                ["3d⁰", "Ti⁴⁺", "Colourless", "3d⁵", "Fe³⁺", "Yellow"],
                ["3d¹", "Ti³⁺", "Purple", "3d⁶", "Fe²⁺", "Green"],
                ["3d¹", "V⁴⁺", "Blue", "3d⁶", "Co³⁺", "Blue (in complex)"],
                ["3d²", "V³⁺", "Green", "3d⁷", "Co²⁺", "Pink"],
                ["3d³", "V²⁺", "Violet", "3d⁸", "Ni²⁺", "Green"],
                ["3d³", "Cr³⁺", "Violet", "3d⁹", "Cu²⁺", "Blue"],
                ["3d⁴", "Mn³⁺", "Violet", "3d¹⁰", "Zn²⁺", "Colourless"],
                ["3d⁴", "Cr²⁺", "Blue", "", "", ""]
            ],
            notes: [
                "Colour arises due to d-d transition of electrons.",
                "Ions with d⁰ or d¹⁰ configuration are colourless.",
                "The colour observed corresponds to the complementary colour of the light absorbed."
            ]
        },
        {
            title: "Oxides of 3d Metals",
            source: "Table 8.6",
            headers: ["Element", "Oxides Formed", "Nature"],
            rows: [
                ["Sc", "Sc₂O₃", "Basic"],
                ["Ti", "TiO, Ti₂O₃, TiO₂", "Amphoteric"],
                ["V", "VO, V₂O₃, V₂O₄, V₂O₅", "V₂O₃ basic → V₂O₅ amphoteric"],
                ["Cr", "CrO, Cr₂O₃, CrO₂, CrO₃", "CrO basic, Cr₂O₃ amph, CrO₃ acidic"],
                ["Mn", "MnO, Mn₂O₃, MnO₂, Mn₂O₇", "Basic → Neutral → Acidic"],
                ["Fe", "FeO, Fe₂O₃, Fe₃O₄", "Basic"],
                ["Co", "CoO, Co₃O₄", "Basic"],
                ["Ni", "NiO", "Basic"],
                ["Cu", "Cu₂O, CuO", "Basic"],
                ["Zn", "ZnO", "Amphoteric"]
            ],
            notes: [
                "Oxidation state increases → Acidic character increases",
                "Lowest oxidation state oxides are basic",
                "Highest oxidation state oxides are acidic/amphoteric"
            ]
        },
        {
            title: "Coloured Compounds - Quick Revision",
            source: "NCERT Notes",
            isTextOnly: true,
            headers: ["Colour", "Compounds"],
            rows: [
                ["Yellow (ppt)", "PbCrO₄, BaCrO₄, As₂S₃, PbI₂, AgI, SnS₂, CdS"],
                ["Yellow (soln)", "K₂CrO₄, Na₂CrO₄, (NH₄)₂S₂, K₃[Co(NO₂)₆], K₄[Fe(CN)₆]"],
                ["Canary Yellow", "(NH₄)₃[As(Mo₃O₁₀)₄], (NH₄)₃[P(Mo₃O₁₀)₄]"],
                ["Greenish Yellow", "Cl₂ gas"],
                ["Yellow when hot", "ZnO"],
                ["Black", "FeS, CoS, NiS, CuS, Ag₂S, PbS, MnO₂"],
                ["White", "ZnS, CuSO₄(anh.), Cu⁺ salts, BaSO₃, BaSO₄, NH₄Cl, AgCl, CaC₂O₄, SrSO₄, PbSO₄, Mn(OH)₂, Mg(NH₄)PO₄"],
                ["Green", "Cr(OH)₃, Fe(OH)₂, Ni(OH)₂, Cr(OH)₄⁻, Cr₂(SO₄)₃, MnO₄²⁻"],
                ["Reddish Brown", "Fe(OH)₃"],
                ["Brown/Black", "PbS, MnO₂"],
                ["Peach/Flesh", "MnS"],
                ["Dark Purple", "KMnO₄"],
                ["Orange", "Cr₂O₇²⁻, K₂Cr₂O₇"]
            ],
            notes: [
                "Br₂ vapour turns starch paper yellow",
                "Chromate (CrO₄²⁻) is yellow, Dichromate (Cr₂O₇²⁻) is orange",
                "Fe²⁺ compounds are generally green, Fe³⁺ are yellow/brown",
                "Most sulfides of transition metals are black"
            ]
        }
    ]
};

// S-Block NCERT Tables
export const sBlockData: BlockInfo = {
    name: "s-Block Elements",
    description: "Group 1 (Alkali Metals) and Group 2 (Alkaline Earth Metals). Valence electrons in s-orbital.",
    keyPoints: [
        "Low ionization enthalpies, highly reactive metals",
        "Reaction with water becomes more vigorous down the group",
        "Form basic oxides and hydrides",
        "Flame coloration: Characteristic colors due to excitation of valence electrons"
    ],
    tables: [
        {
            title: "Atomic and Physical Properties of the Alkali Metals",
            source: "Table 10.1",
            headers: ["Property", "Li", "Na", "K", "Rb", "Cs", "Fr"],
            rows: [
                ["Atomic number", 3, 11, 19, 37, 55, 87],
                ["Atomic mass (g mol⁻¹)", 6.94, 22.99, 39.10, 85.47, 132.91, "(223)"],
                ["Electronic configuration", "[He] 2s¹", "[Ne] 3s¹", "[Ar] 4s¹", "[Kr] 5s¹", "[Xe] 6s¹", "[Rn] 7s¹"],
                ["Ionization enthalpy / kJ mol⁻¹", 520, 496, 419, 403, 376, "~375"],
                ["Hydration enthalpy/kJ mol⁻¹", -506, -406, -330, -310, -276, "-"],
                ["Metallic radius / pm", 152, 186, 227, 248, 265, "-"],
                ["Ionic radius M⁺ / pm", 76, 102, 138, 152, 167, "(180)"],
                ["m.p. / K", 454, 371, 336, 312, 302, "-"],
                ["b.p / K", 1615, 1156, 1032, 961, 944, "-"],
                ["Density / g cm⁻³", 0.53, 0.97, 0.86, 1.53, 1.90, "-"],
                ["Standard potentials E⊖ / V for (M⁺ / M)", -3.04, -2.714, -2.925, -2.930, -2.927, "-"],

            ],
            notes: [
                "Ionization enthalpy decreases down the group due to increased size.",
                "Hydration enthalpy decreases with increase in ionic size (Li⁺ has max hydration).",
                "Density generally increases down the group, but K is unexpectedly lighter than Na.",
                "Li has most negative E⊖ (strongest reducing agent in aqueous solution) due to high hydration energy."
            ]
        },
        {
            title: "Atomic and Physical Properties of the Alkaline Earth Metals",
            source: "Table 10.2",
            headers: ["Property", "Be", "Mg", "Ca", "Sr", "Ba", "Ra"],
            rows: [
                ["Atomic number", 4, 12, 20, 38, 56, 88],
                ["Atomic mass (g mol⁻¹)", 9.01, 24.31, 40.08, 87.62, 137.33, 226.03],
                ["Electronic configuration", "[He] 2s²", "[Ne] 3s²", "[Ar] 4s²", "[Kr] 5s²", "[Xe] 6s²", "[Rn] 7s²"],
                ["Ionization enthalpy (I) / kJ mol⁻¹", 899, 737, 590, 549, 503, 509],
                ["Ionization enthalpy (II) /kJ mol⁻¹", 1757, 1450, 1145, 1064, 965, 979],
                ["Hydration enthalpy (kJ/mol)", -2494, -1921, -1577, -1443, -1305, "-"],
                ["Metallic radius / pm", 112, 160, 197, 215, 222, "-"],
                ["Ionic radius M²⁺ / pm", 31, 72, 100, 118, 135, 148],
                ["m.p. / K", 1560, 924, 1124, 1062, 1002, 973],
                ["b.p / K", 2745, 1363, 1767, 1655, 2078, "(1973)"],
                ["Density / g cm⁻³", 1.84, 1.74, 1.55, 2.63, 3.59, "(5.5)"],
                ["Standard potential E⊖ / V for (M²⁺ / M)", -1.97, -2.36, -2.84, -2.89, -2.92, -2.92],

            ],
            notes: [
                "Higher ionization enthalpies than Group 1 due to smaller size.",
                "Hydration enthalpies > Group 1 ions; compounds are more hydrated (e.g., MgCl₂·6H₂O).",
                "Melting and boiling points do not show regular trends due to crystal structure variations.",
                "Be and Mg are kinetically inert to oxygen and water due to oxide film."
            ]
        },
        {
            title: "Flame Colours of Alkali Metals",
            source: "NCERT",
            headers: ["Property", "Li", "Na", "K", "Rb", "Cs"],
            rows: [
                ["Colour", "Crimson red", "Yellow", "Violet", "Red violet", "Blue"],
                ["Wavelength λ / nm", 670.8, 589.2, 766.5, 780.0, 455.5]
            ],
            notes: [
                "Flame test is used for qualitative identification of alkali metals.",
                "Na gives persistent yellow colour due to strong D-line emission.",
                "K flame is best observed through blue cobalt glass (filters Na yellow)."
            ]
        }
    ]
};

// F-Block summary
export const fBlockData: BlockInfo = {
    name: "f-Block Elements",
    description: "Lanthanides (4f) and Actinides (5f) - Inner transition elements.",
    keyPoints: [
        "+3 is most stable oxidation state for lanthanides",
        "Lanthanide contraction affects properties",
        "Actinides show more variable oxidation states",
        "Ce⁴⁺ is oxidizing, Eu²⁺ and Yb²⁺ are reducing"
    ],
    tables: [
        {
            title: "Lanthanoid Radii",
            source: "Table 8.9",
            headers: ["Property", "La", "Ce", "Pr", "Nd", "Pm", "Sm", "Eu", "Gd", "Tb", "Dy", "Ho", "Er", "Tm", "Yb", "Lu"],
            rows: [
                ["Atomic number", 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71],
                ["Ln radius / pm", 187, 183, 182, 181, 181, 180, 199, 180, 178, 177, 176, 175, 174, 173, "-"],
                ["Ln³⁺ radius / pm", 106, 103, 101, 99, 98, 96, 95, 94, 92, 91, 89, 88, 87, 86, "-"]
            ],
            notes: [
                "Ln radius decreases from La to Lu (187→173 pm) - Lanthanide Contraction.",
                "Poor shielding by 4f electrons → increased Zeff → smaller size.",
                "Eu has larger radius (199 pm) due to 4f⁷6s² configuration.",
                "Ln³⁺ radius also decreases steadily (106→86 pm)."
            ]
        },
        {
            title: "Electronic Configurations",
            source: "Table 8.9",
            headers: ["Element", "Symbol", "Ln config", "Ln³⁺ config"],
            rows: [
                ["Lanthanum", "La", "5d¹6s²", "4f⁰"],
                ["Cerium", "Ce", "4f¹5d¹6s²", "4f¹"],
                ["Praseodymium", "Pr", "4f³6s²", "4f²"],
                ["Neodymium", "Nd", "4f⁴6s²", "4f³"],
                ["Promethium", "Pm", "4f⁵6s²", "4f⁴"],
                ["Samarium", "Sm", "4f⁶6s²", "4f⁵"],
                ["Europium", "Eu", "4f⁷6s²", "4f⁶"],
                ["Gadolinium", "Gd", "4f⁷5d¹6s²", "4f⁷"],
                ["Terbium", "Tb", "4f⁹6s²", "4f⁸"],
                ["Dysprosium", "Dy", "4f¹⁰6s²", "4f⁹"],
                ["Holmium", "Ho", "4f¹¹6s²", "4f¹⁰"],
                ["Erbium", "Er", "4f¹²6s²", "4f¹¹"],
                ["Thulium", "Tm", "4f¹³6s²", "4f¹²"],
                ["Ytterbium", "Yb", "4f¹⁴6s²", "4f¹³"],
                ["Lutetium", "Lu", "4f¹⁴5d¹6s²", "4f¹⁴"]
            ],
            notes: [
                "All lanthanoids have general config [Xe] 4f¹⁻¹⁴ 5d⁰⁻¹ 6s².",
                "+3 is the most stable oxidation state for all lanthanoids.",
                "Ce⁴⁺ is stable (4f⁰ = noble gas-like configuration).",
                "Eu²⁺ (4f⁷) and Yb²⁺ (4f¹⁴) are stable due to half/full-filled orbitals."
            ]
        },
        {
            title: "Special Oxidation States in f-Block",
            source: "NCERT",
            headers: ["Element", "Special O.S.", "Reason", "Behaviour"],
            rows: [
                ["Ce", "+4", "Attains 4f⁰ (noble gas-like)", "Oxidizing agent"],
                ["Eu", "+2", "Attains 4f⁷ (half-filled)", "Reducing agent"],
                ["Yb", "+2", "Attains 4f¹⁴ (full-filled)", "Reducing agent"],
                ["Gd", "+3", "Has 4f⁷5d¹ (exception)", "Most stable"],
                ["Tb", "+4", "Attains 4f⁷ (half-filled)", "Oxidizing agent"]
            ],
            notes: [
                "Half-filled and full-filled f-orbitals are extra stable",
                "Ce⁴⁺/Ce³⁺ has E° = +1.74 V (strong oxidant)",
                "Eu²⁺/Eu³⁺ has E° = -0.43 V (reducing)"
            ]
        }
    ]
};

// Export all block data
export const BLOCK_DATA: Record<string, BlockInfo> = {
    's': sBlockData,
    'p': pBlockData,
    'd': dBlockData,
    'f': fBlockData
};

