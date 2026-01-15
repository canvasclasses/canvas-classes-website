// Block-specific NCERT data - Tables and important information per block
// Used for the Block Info Panel feature

export interface BlockTableData {
    title: string;
    source: string;  // e.g., "Table 7.3"
    headers: string[];
    rows: (string | number)[][];
    notes?: string[];
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
                "NH₃ has highest boiling point due to hydrogen bonding",
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
                "H₂O has anomalously high m.p and b.p due to hydrogen bonding",
                "Acidic strength increases: H₂O < H₂S < H₂Se < H₂Te",
                "Bond angle decreases due to decreasing electronegativity",
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
                "HF has highest b.p due to strong hydrogen bonding",
                "Acidic strength: HF < HCl < HBr < HI",
                "Bond dissociation enthalpy decreases → easier to release H⁺",
                "HF is a weak acid due to high H-F bond strength"
            ]
        },
        {
            title: "Oxides of Nitrogen",
            source: "Table 7.3",
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
            headers: ["Name", "Formula", "O.S.", "P-OH bonds", "Preparation"],
            rows: [
                ["Hypophosphorous", "H₃PO₂", "+1", "1 P-OH, 2 P-H", "White P₄ + alkali"],
                ["Orthophosphorous", "H₃PO₃", "+3", "2 P-OH, 1 P-H", "P₂O₃ + H₂O"],
                ["Pyrophosphorous", "H₄P₂O₅", "+3", "2 P-OH, 2 P-H", "PCl₃ + H₃PO₃"],
                ["Hypophosphoric", "H₄P₂O₆", "+4", "4 P-OH, 1 P-P", "Red P₄ + alkali"],
                ["Orthophosphoric", "H₃PO₄", "+5", "3 P-OH", "P₄O₁₀ + H₂O"],
                ["Pyrophosphoric", "H₄P₂O₇", "+5", "4 P-OH", "Heat H₃PO₄"],
                ["Metaphosphoric", "(HPO₃)n", "+5", "3 P-OH (per unit)", "H₃PO₄ + Br₂, heat"]
            ],
            notes: [
                "Basicity = number of P-OH bonds",
                "P-H bonds don't ionize in water",
                "H₃PO₂ is monobasic despite having 3 H atoms",
                "H₃PO₄ is tribasic (3 P-OH bonds)"
            ]
        }
    ]
};

// D-Block NCERT Tables (previously added data - summary)
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
            title: "Colours of Aquated 3d Metal Ions",
            source: "Table 8.8",
            headers: ["Configuration", "Example Ion", "Colour"],
            rows: [
                ["3d⁰", "Sc³⁺, Ti⁴⁺", "Colourless"],
                ["3d¹", "Ti³⁺, V⁴⁺", "Purple, Blue"],
                ["3d²", "V³⁺", "Green"],
                ["3d³", "V²⁺, Cr³⁺", "Violet"],
                ["3d⁴", "Mn³⁺, Cr²⁺", "Violet, Blue"],
                ["3d⁵", "Mn²⁺, Fe³⁺", "Pink, Yellow"],
                ["3d⁶", "Fe²⁺, Co³⁺", "Green, Blue"],
                ["3d⁷", "Co²⁺", "Pink"],
                ["3d⁸", "Ni²⁺", "Green"],
                ["3d⁹", "Cu²⁺", "Blue"],
                ["3d¹⁰", "Cu⁺, Zn²⁺", "Colourless"]
            ],
            notes: [
                "Colour due to d-d electronic transitions",
                "3d⁰ and 3d¹⁰ are colourless (no d-d transition possible)",
                "Colour depends on ligands attached (crystal field splitting)"
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
                "Higher oxidation state = more acidic oxide",
                "Fe₃O₄ and Co₃O₄ are mixed oxides",
                "Mn₂O₇ is a covalent green oil (acidic)"
            ]
        },
        {
            title: "Coloured Compounds - Quick Revision",
            source: "NCERT Notes",
            headers: ["Colour", "Compounds"],
            rows: [
                ["🟡 Yellow (ppt)", "PbCrO₄, BaCrO₄, As₂S₃, PbI₂, AgI, SnS₂, CdS"],
                ["🟡 Yellow (soln)", "K₂CrO₄, Na₂CrO₄, (NH₄)₂S₂, K₃[Co(NO₂)₆], K₄[Fe(CN)₆]"],
                ["🟡 Canary Yellow", "(NH₄)₃[As(Mo₃O₁₀)₄], (NH₄)₃[P(Mo₃O₁₀)₄]"],
                ["🟡 Greenish Yellow", "Cl₂ gas"],
                ["🟡 Yellow when hot", "ZnO"],
                ["⚫ Black", "FeS, CoS, NiS, CuS, Ag₂S, PbS, MnO₂"],
                ["⚪ White", "ZnS, CuSO₄(anh.), Cu⁺ salts, BaSO₃, BaSO₄, NH₄Cl, AgCl, CaC₂O₄, SrSO₄, PbSO₄, Mn(OH)₂, Mg(NH₄)PO₄"],
                ["🟢 Green", "Cr(OH)₃, Fe(OH)₂, Ni(OH)₂, Cr(OH)₄⁻, Cr₂(SO₄)₃, MnO₄²⁻"],
                ["🟤 Reddish Brown", "Fe(OH)₃"],
                ["🟤 Brown/Black", "PbS, MnO₂"],
                ["🍑 Peach/Flesh", "MnS"],
                ["🟣 Dark Purple", "KMnO₄"],
                ["🟠 Orange", "Cr₂O₇²⁻, K₂Cr₂O₇"]
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
    description: "Groups 1-2: Alkali and alkaline earth metals with valence electrons in s-orbital.",
    keyPoints: [
        "Most electropositive metals",
        "Form ionic compounds",
        "Characteristic flame colours",
        "React with water (except Be, Mg)",
        "Oxides are basic (except BeO - amphoteric)"
    ],
    tables: [
        {
            title: "Flame Colours of s-Block Elements",
            source: "NCERT",
            headers: ["Element", "Flame Colour", "Reason"],
            rows: [
                ["Li", "Red", "Electron excitation to higher energy level"],
                ["Na", "Yellow/Orange", "Strong emission at 589 nm"],
                ["K", "Lilac/Violet", ""],
                ["Rb", "Pink/Red", ""],
                ["Cs", "Light Blue", ""],
                ["Ca", "Brick Red", ""],
                ["Sr", "Red", "Used in fireworks"],
                ["Ba", "Green/Yellow", "Used in fireworks"]
            ],
            notes: [
                "Mg doesn't give flame colour (high ionization energy)",
                "Be doesn't give flame colour",
                "Used in qualitative analysis"
            ]
        },
        {
            title: "Hydrides of s-Block Elements",
            source: "NCERT",
            headers: ["Type", "Elements", "Nature", "Properties"],
            rows: [
                ["Ionic (Saline)", "LiH, NaH, KH, CaH₂", "Crystalline solids", "Conduct electricity when molten"],
                ["Ionic", "MgH₂", "Less ionic", "Prepared by high pressure"],
                ["Covalent", "BeH₂", "Polymeric", "Electron deficient, bridge bonding"]
            ],
            notes: [
                "Ionic character of hydrides increases down the group",
                "All are reducing agents",
                "React with water to give H₂"
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
