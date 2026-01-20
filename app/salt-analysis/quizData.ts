export type QuizCategory = 'Anion' | 'Cation';

export interface MasteryQuestion {
    id: number;
    title: string;
    question: string;
    answer: string;
    logic: string;
    category: QuizCategory;
}

export const MASTERY_QUESTIONS: MasteryQuestion[] = [
    // PART 1: ANION ANALYSIS
    {
        id: 1,
        title: "The Rotten Egg",
        category: "Anion",
        question: "A salt reacts with dilute H₂SO₄ to release a colourless gas with the smell of rotten eggs. Which anion is indicated?",
        answer: "Sulphide ion (S²⁻)",
        logic: "The gas evolved is H₂S, which has a characteristic rotten egg smell."
    },
    {
        id: 2,
        title: "The Black Paper",
        category: "Anion",
        question: "In the test for Sulphide ions, the evolved gas turns lead acetate paper into which colour?",
        answer: "Black",
        logic: "H₂S reacts with lead acetate to form lead sulphide (PbS), which is a black precipitate."
    },
    {
        id: 3,
        title: "Vinegar Vapours",
        category: "Anion",
        question: "Upon warming a salt with dilute H₂SO₄, colourless vapours with a vinegar smell are evolved. What is the anion?",
        answer: "Acetate ion (CH₃COO⁻)",
        logic: "The reaction produces acetic acid (CH₃COOH) vapours, which smell like vinegar and turn blue litmus red."
    },
    {
        id: 4,
        title: "The Milky Way",
        category: "Anion",
        question: "A colourless, odourless gas evolves with brisk effervescence from dilute acid and turns lime water milky. If passed for a long time, the milkiness disappears. Identify the gas.",
        answer: "CO₂ (indicating Carbonate CO₃²⁻)",
        logic: "The milkiness is CaCO₃; excess CO₂ forms soluble calcium hydrogen carbonate."
    },
    {
        id: 5,
        title: "Green Agent",
        category: "Anion",
        question: "Which gas, evolved from Sulphite salts (SO₃²⁻), turns acidified potassium dichromate paper green?",
        answer: "Sulphur dioxide (SO₂)",
        logic: "SO₂ reduces Cr₂O₇²⁻ (orange) to Chromium sulphate (Cr³⁺), which is green."
    },
    {
        id: 6,
        title: "The Purple Complex",
        category: "Anion",
        question: "To confirm Sulphide ions, sodium nitroprusside is added to the water extract. What is the colour of the complex formed?",
        answer: "Purple (or Violet)",
        logic: "The reaction forms sodium thionitroprusside, Na₄[Fe(CN)₅NOS], which is purple."
    },
    {
        id: 7,
        title: "Pungent Fumes",
        category: "Anion",
        question: "A salt heated with conc. H₂SO₄ releases a pungent colourless gas that gives dense white fumes with a rod dipped in NH₄OH. Identify the anion.",
        answer: "Chloride (Cl⁻)",
        logic: "The gas is HCl, which reacts with NH₃ to form dense white fumes of Ammonium Chloride (NH₄Cl)."
    },
    {
        id: 8,
        title: "Reddish Brown Vapours",
        category: "Anion",
        question: "Reaction with conc. H₂SO₄ produces reddish-brown fumes that turn starch paper yellow. Identify the anion.",
        answer: "Bromide (Br⁻)",
        logic: "The fumes are Bromine vapours (Br₂). Note: NO₂ is also brown but turns starch iodide paper blue, not just starch paper yellow."
    },
    {
        id: 9,
        title: "Violet Sublimate",
        category: "Anion",
        question: "When heating a salt with conc. H₂SO₄, violet vapours evolve and condense on the test tube sides. Which anion is present?",
        answer: "Iodide (I⁻)",
        logic: "Conc. sulphuric acid oxidises iodide to Iodine (I₂), which produces violet vapours."
    },
    {
        id: 10,
        title: "The Ring Test Formula",
        category: "Anion",
        question: "In the confirmatory ring test for Nitrates, a dark brown ring is formed. What is the chemical formula of this ring complex?",
        answer: "[Fe(NO)]SO₄ (Nitroso ferrous sulphate)",
        logic: "NO generated reacts with FeSO₄ to form this brown complex at the junction of the liquids."
    },
    {
        id: 11,
        title: "Chromyl Chloride Vapours",
        category: "Anion",
        question: "In the Chromyl Chloride test for Chloride ions, what is the colour and formula of the vapours evolved?",
        answer: "Orange-red/Red vapours of CrO₂Cl₂",
        logic: "Chloride reacts with K₂Cr₂O₇ and conc. H₂SO₄ to form Chromyl Chloride."
    },
    {
        id: 12,
        title: "Lead Chromate Precipitate",
        category: "Anion",
        question: "In the final step of the Chromyl Chloride test, lead acetate is added to the solution. What is the colour of the resulting precipitate?",
        answer: "Yellow",
        logic: "The yellow precipitate is Lead Chromate (PbCrO₄)."
    },
    {
        id: 13,
        title: "Blue Layer Test (Chromium)",
        category: "Anion",
        question: "When performing the Chromyl Chloride confirmatory test using amyl alcohol and H₂O₂, the organic layer turns blue. This is due to the formation of what compound?",
        answer: "Chromium pentoxide (CrO₅)",
        logic: "CrO₅ is formed which dissolves in amyl alcohol to give a blue colour."
    },
    {
        id: 14,
        title: "Layer Test (Bromine)",
        category: "Anion",
        question: "In the Layer Test (using CCl₄ and Chlorine water), what colour indicates the presence of Bromide ions?",
        answer: "Orange brown",
        logic: "Chlorine displaces Bromine, which dissolves in the organic layer (CCl₄) giving it an orange brown colour."
    },
    {
        id: 15,
        title: "Layer Test (Iodine)",
        category: "Anion",
        question: "In the Layer Test (using CS₂ and Chlorine water), what colour indicates the presence of Iodide ions?",
        answer: "Violet",
        logic: "Chlorine displaces Iodine, which dissolves in the organic layer giving it a violet colour."
    },
    {
        id: 16,
        title: "Silver Nitrate Solubility (Cl)",
        category: "Anion",
        question: "You add AgNO₃ to a salt solution and get a curdy white precipitate soluble in ammonium hydroxide. Which anion is it?",
        answer: "Chloride (Cl⁻)",
        logic: "The precipitate is AgCl, which dissolves in NH₄OH forming a complex."
    },
    {
        id: 17,
        title: "Silver Nitrate Solubility (I)",
        category: "Anion",
        question: "You add AgNO₃ to a salt solution and get a yellow precipitate insoluble in ammonium hydroxide. Which anion is it?",
        answer: "Iodide (I⁻)",
        logic: "The precipitate is AgI, which is insoluble in excess NH₄OH."
    },
    {
        id: 18,
        title: "Copper Turnings Test",
        category: "Anion",
        question: "Heating a salt with conc. H₂SO₄ and copper turnings intensifies brown fumes and turns the solution blue. Which anion is confirmed?",
        answer: "Nitrate (NO₃⁻)",
        logic: "The copper reacts with nitric acid formed to produce brown NO₂ gas and blue Copper Sulphate solution."
    },
    {
        id: 19,
        title: "Canary Yellow",
        category: "Anion",
        question: "Ammonium molybdate is added to an acidified salt solution and heated. A canary yellow precipitate forms. Which anion is present?",
        answer: "Phosphate (PO₄³⁻)",
        logic: "The yellow precipitate is ammonium phosphomolybdate."
    },
    {
        id: 20,
        title: "Phosphate Reagent",
        category: "Anion",
        question: "Which acid must be used to acidify the solution before adding ammonium molybdate to test for phosphates?",
        answer: "Conc. Nitric Acid (HNO₃)",
        logic: "The reaction requires strongly acidic conditions provided by nitric acid."
    },
    {
        id: 21,
        title: "Sulphate Insolubility",
        category: "Anion",
        question: "Barium chloride is added to a water extract, forming a white precipitate. This precipitate is insoluble in conc. HCl. What is the anion?",
        answer: "Sulphate (SO₄²⁻)",
        logic: "BaSO₄ is white and insoluble in mineral acids, unlike BaSO₃ or BaCO₃."
    },
    {
        id: 22,
        title: "Oxalate Gas",
        category: "Anion",
        question: "Which two gases are evolved when Oxalate salt is heated with Conc. H₂SO₄?",
        answer: "CO and CO₂",
        logic: "Oxalate decomposes to give Carbon Monoxide and Carbon Dioxide."
    },
    {
        id: 23,
        title: "Discharging Pink",
        category: "Anion",
        question: "A salt solution acidified with dil. H₂SO₄ decolorizes pink KMnO₄ solution on warming. It also gives CO₂. What is the anion?",
        answer: "Oxalate (C₂O₄²⁻)",
        logic: "Oxalates reduce permanganate to Mn²⁺ (colourless) while oxidizing to CO₂."
    },
    {
        id: 24,
        title: "Blood Red Anion",
        category: "Anion",
        question: "Neutral Ferric Chloride solution is added to a water extract. A deep red colour appears which disappears on boiling to give a brown-red precipitate. Identify the anion.",
        answer: "Acetate (CH₃COO⁻)",
        logic: "Acetate forms a deep red complex with Iron(III), which decomposes on boiling to Iron(III)dihydroxyacetate."
    },
    {
        id: 25,
        title: "Nitrate vs Nitrite",
        category: "Anion",
        question: "Both Nitrate and Nitrite give brown fumes. How does the acid used in the preliminary test distinguish them?",
        answer: "Nitrite reacts with dilute acid; Nitrate requires concentrated acid (and usually Cu turnings).",
        logic: "Nitrites are unstable in dilute acid (Group 1), Nitrates are Group 2 anions requiring conc. acid."
    },

    // PART 2: CATION ANALYSIS
    {
        id: 26,
        title: "Zero Group",
        category: "Cation",
        question: "When heating a salt with NaOH solution, a gas with a pungent ammoniacal smell evolves. Which cation is present?",
        answer: "Ammonium (NH₄⁺)",
        logic: "Ammonium salts react with strong bases to release Ammonia gas."
    },
    {
        id: 27,
        title: "Nessler's Result",
        category: "Cation",
        question: "Ammonia gas is passed through Nessler’s reagent. What is the colour of the precipitate formed?",
        answer: "Brown",
        logic: "A brown precipitate of basic mercury(II) amido-iodine is formed."
    },
    {
        id: 28,
        title: "Group I Reagent",
        category: "Cation",
        question: "What is the group reagent for Group I cation analysis?",
        answer: "Dilute Hydrochloric Acid (HCl)",
        logic: "It precipitates Group I cations (like Pb²⁺) as chlorides."
    },
    {
        id: 29,
        title: "Golden Rain",
        category: "Cation",
        question: "A Group I white precipitate dissolves in hot water. Adding Potassium Iodide (KI) creates a yellow precipitate. What is the cation?",
        answer: "Lead (Pb²⁺)",
        logic: "PbCl₂ is soluble in hot water. PbI₂ is a yellow precipitate."
    },
    {
        id: 30,
        title: "Group II Logic",
        category: "Cation",
        question: "Why is HCl added before passing H₂S gas for Group II analysis?",
        answer: "To suppress the ionization of Sulphide ions (Common Ion Effect).",
        logic: "High H⁺ concentration lowers S²⁻ concentration so only Group II cations (low Ksp) precipitate, preventing Group IV precipitation."
    },
    {
        id: 31,
        title: "Blue Complex",
        category: "Cation",
        question: "A Group II precipitate dissolves in excess Ammonium Hydroxide to form a deep blue solution. Which cation is this?",
        answer: "Copper (Cu²⁺)",
        logic: "Copper forms the soluble complex [Cu(NH₃)₄]²⁺ which is deep blue."
    },
    {
        id: 32,
        title: "Yellow Sulphide",
        category: "Cation",
        question: "Which Group II cation forms a yellow sulphide precipitate that is soluble in yellow ammonium sulphide?",
        answer: "Arsenic (As³⁺)",
        logic: "As₂S₃ is yellow and belongs to Group II-B, which dissolves in yellow ammonium sulphide."
    },
    {
        id: 33,
        title: "Group III State",
        category: "Cation",
        question: "Before adding Group III reagents, one adds conc. HNO₃ and heats. Why?",
        answer: "To oxidise ferrous ions (Fe²⁺) to ferric ions (Fe³⁺).",
        logic: "Fe(OH)₂ does not precipitate completely in Group III conditions; Fe(OH)₃ does."
    },
    {
        id: 34,
        title: "Prussian Blue",
        category: "Cation",
        question: "To confirm Fe³⁺, Potassium Ferrocyanide is added. What colour is the precipitate?",
        answer: "Prussian Blue",
        logic: "Ferric ions react with ferrocyanide to form Ferric ferrocyanide."
    },
    {
        id: 35,
        title: "Blood Red Cation",
        category: "Cation",
        question: "To confirm Fe³⁺, Potassium Thiocyanate (KSCN) is added. What is the appearance of the solution?",
        answer: "Blood red colouration",
        logic: "Formation of [Fe(SCN)]²⁺ complex."
    },
    {
        id: 36,
        title: "The Lake Test",
        category: "Cation",
        question: "Which cation is confirmed by the formation of a blue floating mass on a colourless solution (Lake Test)?",
        answer: "Aluminium (Al³⁺)",
        logic: "Al(OH)₃ adsorbs blue litmus colour."
    },
    {
        id: 37,
        title: "Group IV Reagent",
        category: "Cation",
        question: "What are the reagents used to precipitate Group IV cations?",
        answer: "H₂S gas in the presence of Ammonium Hydroxide (NH₄OH)",
        logic: "Basic medium increases S²⁻ concentration to precipitate Group IV sulphides (higher Ksp)."
    },
    {
        id: 38,
        title: "Flesh Coloured",
        category: "Cation",
        question: "Which Group IV cation forms a 'flesh coloured' (or buff) sulphide precipitate?",
        answer: "Manganese (Mn²⁺)",
        logic: "MnS is flesh coloured."
    },
    {
        id: 39,
        title: "Rosy Red",
        category: "Cation",
        question: "Dimethyl glyoxime (DMG) is added to a solution in the presence of NH₄OH. A brilliant red precipitate forms. Identify the cation.",
        answer: "Nickel (Ni²⁺)",
        logic: "Nickel forms a specific red complex with DMG."
    },
    {
        id: 40,
        title: "Cobalt Complex",
        category: "Cation",
        question: "A Group IV black precipitate dissolves in aqua regia. Adding KNO₂ and acetic acid yields a yellow precipitate. What is the cation?",
        answer: "Cobalt (Co²⁺)",
        logic: "Formation of Potassium hexanitritocobaltate(III), which is yellow."
    },
    {
        id: 41,
        title: "Zinc Confirmation",
        category: "Cation",
        question: "A white precipitate from Group IV dissolves in NaOH to form a soluble complex. What is the formula of the anion formed?",
        answer: "ZnO₂²⁻ (Zincate ion)",
        logic: "Zn(OH)₂ is amphoteric and dissolves in excess base to form Sodium Zincate (Na₂ZnO₂)."
    },
    {
        id: 42,
        title: "Group V Reagent",
        category: "Cation",
        question: "What is the group reagent for Group V (Ba²⁺, Sr²⁺, Ca²⁺)?",
        answer: "Ammonium Carbonate (NH₄)₂CO₃ in presence of NH₄OH",
        logic: "They precipitate as Carbonates."
    },
    {
        id: 43,
        title: "Crimson Flame",
        category: "Cation",
        question: "In the flame test, Strontium salts impart which characteristic colour to the flame?",
        answer: "Crimson red",
        logic: "Specific electronic transitions for Sr cause a crimson flame."
    },
    {
        id: 44,
        title: "Brick Red Flame",
        category: "Cation",
        question: "In the flame test, Calcium salts impart which colour that looks greenish-yellow through blue glass?",
        answer: "Brick red",
        logic: "Ca gives a brick red flame."
    },
    {
        id: 45,
        title: "Grassy Green",
        category: "Cation",
        question: "Which Group V cation gives a grassy green flame?",
        answer: "Barium (Ba²⁺)",
        logic: "Ba gives a characteristic grassy green flame."
    },
    {
        id: 46,
        title: "Barium Chromate",
        category: "Cation",
        question: "To distinguish Barium from other Group V ions, Potassium Chromate is added. What colour is the precipitate?",
        answer: "Yellow",
        logic: "BaCrO₄ is a yellow precipitate."
    },
    {
        id: 47,
        title: "Scratching the Side",
        category: "Cation",
        question: "To test for Magnesium (Group VI), Disodium Hydrogen Phosphate is added and the test tube walls are scratched. What forms?",
        answer: "White crystalline precipitate",
        logic: "Magnesium ammonium phosphate is formed; scratching aids crystallization."
    },
    {
        id: 48,
        title: "Borax Bead Blue",
        category: "Cation",
        question: "In the Borax Bead test, a bead that is blue in both oxidising and reducing flames (when cold) indicates which metal?",
        answer: "Cobalt (Co²⁺)",
        logic: "Cobalt metaborate is characteristically blue in all zones."
    },
    {
        id: 49,
        title: "Borax Bead Copper",
        category: "Cation",
        question: "In the Borax Bead test, which metal gives a red opaque bead in the reducing flame?",
        answer: "Copper (Cu²⁺)",
        logic: "Copper is reduced to metallic copper, which appears red opaque."
    },
    {
        id: 50,
        title: "Aqua Regia",
        category: "Cation",
        question: "Nickel and Cobalt sulphides are black and insoluble in dilute HCl. What solvent is used to dissolve them?",
        answer: "Aqua Regia",
        logic: "A 3:1 mixture of conc HCl and conc HNO₃ is required to dissolve Group IV sulphides like NiS and CoS."
    }
];
