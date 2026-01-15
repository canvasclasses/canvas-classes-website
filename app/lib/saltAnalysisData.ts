// Salt Analysis Data - Based on NCERT Chemistry Lab Manual
// Complete data for qualitative analysis of inorganic salts

// ============ TYPE DEFINITIONS ============

export interface Anion {
    id: string;
    symbol: string;
    name: string;
    group: 'A' | 'B' | 'independent'; // A = dil H2SO4, B = conc H2SO4, independent = SO4, PO4
    preliminaryTest: {
        reagent: string;
        observation: string;
        gasEvolved?: string;
    };
    confirmatoryTests: {
        testName: string;
        procedure: string;
        observation: string;
    }[];
}

export interface Cation {
    id: string;
    symbol: string;
    name: string;
    group: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    groupReagent: string;
    precipitateColor?: string;
    saltColors?: string[];
    flameTest?: {
        nakedEye: string;
        throughBlueGlass: string;
        hexColor: string;
    };
    boraxBead?: {
        oxidizingCold: string;
        oxidizingHot: string;
        reducingCold: string;
        reducingHot: string;
    };
    charcoalCavity?: string;
    confirmatoryTests: {
        testName: string;
        procedure: string;
        observation: string;
    }[];
}

export interface Salt {
    id: string;
    formula: string;
    name: string;
    cation: string; // references Cation.id
    anion: string; // references Anion.id
    color: string;
    colorHex: string;
    solubility: 'soluble' | 'sparingly' | 'insoluble';
    colorOnHeating?: string;
}

// ============ ANION DATA ============

export const ANIONS: Anion[] = [
    // GROUP A - Dilute H2SO4 Test
    {
        id: 'carbonate',
        symbol: 'CO₃²⁻',
        name: 'Carbonate',
        group: 'A',
        preliminaryTest: {
            reagent: 'Dilute H₂SO₄',
            observation: 'A colourless, odourless gas is evolved with brisk effervescence, which turns lime water milky.',
            gasEvolved: 'CO₂'
        },
        confirmatoryTests: [
            {
                testName: 'Lime Water Test',
                procedure: 'Take 0.1 g of salt in a test tube, add dilute sulphuric acid. Pass the gas through lime water.',
                observation: 'CO₂ gas is evolved with brisk effervescence which turns lime water milky. On passing the gas for some more time, milkiness disappears.'
            }
        ]
    },
    {
        id: 'sulphide',
        symbol: 'S²⁻',
        name: 'Sulphide',
        group: 'A',
        preliminaryTest: {
            reagent: 'Dilute H₂SO₄',
            observation: 'Colourless gas with the smell of rotten eggs is evolved which turns lead acetate paper black.',
            gasEvolved: 'H₂S'
        },
        confirmatoryTests: [
            {
                testName: 'Sodium Nitroprusside Test',
                procedure: 'Take 1 mL of water extract and make it alkaline by adding ammonium hydroxide or sodium carbonate extract. Add a drop of sodium nitroprusside solution.',
                observation: 'Purple or violet colouration appears.'
            }
        ]
    },
    {
        id: 'sulphite',
        symbol: 'SO₃²⁻',
        name: 'Sulphite',
        group: 'A',
        preliminaryTest: {
            reagent: 'Dilute H₂SO₄',
            observation: 'Colourless gas with a pungent smell, like burning sulphur which turns acidified potassium dichromate solution green.',
            gasEvolved: 'SO₂'
        },
        confirmatoryTests: [
            {
                testName: 'Barium Chloride Test',
                procedure: 'Take 1 mL of water extract or sodium carbonate extract in a test tube and add barium chloride solution.',
                observation: 'A white precipitate is formed which dissolves in dilute hydrochloric acid and sulphur dioxide gas is also evolved.'
            },
            {
                testName: 'KMnO₄ Test',
                procedure: 'Take the precipitate of step (a) in a test tube and add a few drops of potassium permanganate solution acidified with dil. H₂SO₄.',
                observation: 'Colour of potassium permanganate solution gets discharged.'
            }
        ]
    },
    {
        id: 'nitrite',
        symbol: 'NO₂⁻',
        name: 'Nitrite',
        group: 'A',
        preliminaryTest: {
            reagent: 'Dilute H₂SO₄',
            observation: 'Brown fumes which turn acidified potassium iodide solution containing starch solution blue.',
            gasEvolved: 'NO₂'
        },
        confirmatoryTests: [
            {
                testName: 'KI + Starch Test',
                procedure: 'Take 1 mL of water extract in a test tube. Add a few drops of potassium iodide solution and a few drops of starch solution, acidify with acetic acid.',
                observation: 'Blue colour appears.'
            },
            {
                testName: 'Griess Test',
                procedure: 'Acidify 1 mL of water extract with acetic acid. Add 2-3 drops of sulphanilic acid solution followed by 2-3 drops of 1-naphthylamine reagent.',
                observation: 'Appearance of red colour indicates the presence of nitrite ion.'
            }
        ]
    },
    {
        id: 'acetate',
        symbol: 'CH₃COO⁻',
        name: 'Acetate',
        group: 'A',
        preliminaryTest: {
            reagent: 'Dilute H₂SO₄',
            observation: 'Colourless vapours with smell of vinegar. Vapours turn blue litmus red.',
            gasEvolved: 'CH₃COOH vapours'
        },
        confirmatoryTests: [
            {
                testName: 'Ester Test',
                procedure: 'Take 0.1 g of salt in a china dish. Add 1 mL of ethanol and 0.2 mL conc. H₂SO₄ and heat.',
                observation: 'Fruity odour confirms the presence of acetate ion.'
            },
            {
                testName: 'Ferric Chloride Test',
                procedure: 'Take 0.1 g of salt, add 1-2 mL distilled water, shake well filter if necessary. Add 1 to 2 mL neutral ferric chloride solution to the filtrate.',
                observation: 'Deep red colour appears which disappears on boiling and a brown-red precipitate is formed.'
            }
        ]
    },

    // GROUP B - Concentrated H2SO4 Test
    {
        id: 'chloride',
        symbol: 'Cl⁻',
        name: 'Chloride',
        group: 'B',
        preliminaryTest: {
            reagent: 'Concentrated H₂SO₄',
            observation: 'A colourless gas with pungent smell, which gives dense white fumes when a rod dipped in ammonium hydroxide is brought near the mouth of the test tube.',
            gasEvolved: 'HCl'
        },
        confirmatoryTests: [
            {
                testName: 'Chlorine Gas Test',
                procedure: 'Take 0.1 g of salt in a test tube, add a pinch of manganese dioxide and 3-4 drops of conc. sulphuric acid. Heat the reaction mixture.',
                observation: 'Greenish yellow chlorine gas is evolved which is detected by its pungent odour and bleaching action.'
            },
            {
                testName: 'Silver Nitrate Test',
                procedure: 'Take 1 mL of sodium carbonate extract in a test tube, acidify it with dil. HNO₃ or take water extract and add silver nitrate solution.',
                observation: 'A curdy white precipitate is obtained which is soluble in ammonium hydroxide solution.'
            },
            {
                testName: 'Chromyl Chloride Test',
                procedure: 'Take 0.1 g salt and a pinch of solid potassium dichromate in a test tube, add conc. H₂SO₄, heat and pass the gas evolved through sodium hydroxide solution. It becomes yellow. Divide the solution into two parts. Acidify one part with acetic acid and add lead acetate solution.',
                observation: 'A yellow precipitate is formed. Acidify the second part with dilute sulphuric acid and add 1 mL of amyl alcohol followed by 1 mL of 10% hydrogen peroxide. After gentle shaking the organic layer turns blue.'
            }
        ]
    },
    {
        id: 'bromide',
        symbol: 'Br⁻',
        name: 'Bromide',
        group: 'B',
        preliminaryTest: {
            reagent: 'Concentrated H₂SO₄',
            observation: 'Reddish brown gas with a pungent odour is evolved. Intensity of reddish gas increases on heating the reaction mixture after addition of solid MnO₂ to the reaction mixture. Solution also acquires red colour.',
            gasEvolved: 'Br₂ vapours'
        },
        confirmatoryTests: [
            {
                testName: 'MnO₂ Test',
                procedure: 'Take 0.1 g of salt and a pinch of MnO₂ in a test tube. Add 3-4 drops conc. sulphuric acid and heat.',
                observation: 'Intense brown fumes are evolved.'
            },
            {
                testName: 'Layer Test',
                procedure: 'Neutralise 1 mL of sodium carbonate extract with hydrochloric acid (or take the water extract). Add 1 mL carbon tetrachloride (CCl₄)/chloroform (CHCl₃)/carbon disulphide. Now add an excess of chlorine water dropwise and shake the test tube.',
                observation: 'A brown colouration in the organic layer confirms the presence of bromide ion.'
            },
            {
                testName: 'Silver Nitrate Test',
                procedure: 'Acidify 1 mL of sodium carbonate extract with dil. HNO₃ (or take 1 mL water extract) and add silver nitrate solution.',
                observation: 'A pale yellow precipitate soluble with difficulty in ammonium hydroxide solution is obtained.'
            }
        ]
    },
    {
        id: 'iodide',
        symbol: 'I⁻',
        name: 'Iodide',
        group: 'B',
        preliminaryTest: {
            reagent: 'Concentrated H₂SO₄',
            observation: 'Violet vapours, which turn starch paper blue and a layer of violet sublimate is formed on the sides of the tube. Fumes become dense on adding MnO₂ to the reaction mixture.',
            gasEvolved: 'I₂ vapours'
        },
        confirmatoryTests: [
            {
                testName: 'Layer Test',
                procedure: 'Take 1 mL of salt solution neutralised with HCl and add 1 mL chloroform/carbon tetrachloride/carbon disulphide. Now add an excess of chlorine water drop wise and shake the test tube.',
                observation: 'A violet colour appears in the organic layer.'
            },
            {
                testName: 'Silver Nitrate Test',
                procedure: 'Take 1 mL of sodium carbonate extract acidify it with dil. HNO₃ (or take water extract). Add, silver nitrate solution.',
                observation: 'A yellow precipitate insoluble in NH₄OH solution is obtained.'
            }
        ]
    },
    {
        id: 'nitrate',
        symbol: 'NO₃⁻',
        name: 'Nitrate',
        group: 'B',
        preliminaryTest: {
            reagent: 'Concentrated H₂SO₄',
            observation: 'Brown fumes evolve which become dense upon heating the reaction mixture after addition of copper turnings and the solution acquires blue colour.',
            gasEvolved: 'NO₂'
        },
        confirmatoryTests: [
            {
                testName: 'Brown Ring Test',
                procedure: 'Take 1 mL of salt solution in water in a test tube. Add 2 mL conc. of H₂SO₄ and mix thoroughly. Cool the mixture under the tap. Add freshly prepared ferrous sulphate along the sides of the test tube without shaking.',
                observation: 'A dark brown ring is formed at the junction of the two solutions.'
            }
        ]
    },
    {
        id: 'oxalate',
        symbol: 'C₂O₄²⁻',
        name: 'Oxalate',
        group: 'B',
        preliminaryTest: {
            reagent: 'Concentrated H₂SO₄',
            observation: 'Colourless, odourless gas is evolved which turns lime water milky and the gas coming out of lime water burns with a blue flame, if ignited.',
            gasEvolved: 'CO and CO₂'
        },
        confirmatoryTests: [
            {
                testName: 'Calcium Chloride Test',
                procedure: 'Take 1 mL of water extract or sodium carbonate extract acidified with acetic acid and add calcium chloride solution.',
                observation: 'A white precipitate insoluble in ammonium oxalate and oxalic acid solution but soluble in dilute hydrochloric acid and dilute nitric acid is formed.'
            },
            {
                testName: 'KMnO₄ Test',
                procedure: 'Take the precipitate from test (a) and dissolve it in dilute H₂SO₄. Add very dilute solution of KMnO₄ and warm.',
                observation: 'Colour of KMnO₄ solution is discharged. Pass the gas coming out through lime water. The lime water turns milky.'
            }
        ]
    },

    // INDEPENDENT ANIONS
    {
        id: 'sulphate',
        symbol: 'SO₄²⁻',
        name: 'Sulphate',
        group: 'independent',
        preliminaryTest: {
            reagent: 'None (tested directly)',
            observation: 'No gas evolved with dilute or concentrated H₂SO₄'
        },
        confirmatoryTests: [
            {
                testName: 'Barium Chloride Test',
                procedure: 'Take 1 mL water extract of the salt in water or sodium carbonate and after acidifying with dilute hydrochloric acid add BaCl₂ solution.',
                observation: 'White precipitate insoluble in conc. HCl or conc. HNO₃ is obtained.'
            },
            {
                testName: 'Lead Acetate Test',
                procedure: 'Acidify the aqueous solution or sodium carbonate extract with acetic acid and add lead acetate solution.',
                observation: 'Appearance of white precipitate confirms the presence of SO₄²⁻ ion.'
            }
        ]
    },
    {
        id: 'phosphate',
        symbol: 'PO₄³⁻',
        name: 'Phosphate',
        group: 'independent',
        preliminaryTest: {
            reagent: 'None (tested directly)',
            observation: 'No gas evolved with dilute or concentrated H₂SO₄'
        },
        confirmatoryTests: [
            {
                testName: 'Ammonium Molybdate Test',
                procedure: 'Acidify sodium carbonate extract or the solution of the salt in water with conc. HNO₃ and add ammonium molybdate solution and heat to boiling.',
                observation: 'A canary yellow precipitate is formed.'
            }
        ]
    }
];

// ============ CATION DATA ============

export const CATIONS: Cation[] = [
    // Group 0
    {
        id: 'ammonium',
        symbol: 'NH₄⁺',
        name: 'Ammonium',
        group: 0,
        groupReagent: 'None (tested separately with NaOH)',
        confirmatoryTests: [
            {
                testName: 'NaOH Test',
                procedure: 'Heat 0.1 g of salt with 2 mL NaOH solution.',
                observation: 'Ammonia gas with characteristic pungent smell is evolved. It turns moist red litmus blue.'
            }
        ]
    },

    // Group I
    {
        id: 'lead',
        symbol: 'Pb²⁺',
        name: 'Lead',
        group: 1,
        groupReagent: 'Dilute HCl',
        precipitateColor: 'White',
        saltColors: ['White', 'Colourless'],
        charcoalCavity: 'Yellow residue when hot and grey metal when cold',
        confirmatoryTests: [
            {
                testName: 'Potassium Iodide Test',
                procedure: 'Dissolve the precipitate in hot water and divide the hot solution into three parts. Add potassium iodide solution to the first part.',
                observation: 'A yellow precipitate is obtained.'
            },
            {
                testName: 'Potassium Chromate Test',
                procedure: 'To the second part add potassium chromate solution.',
                observation: 'A yellow precipitate is obtained which is soluble in NaOH and insoluble in ammonium acetate solution.'
            },
            {
                testName: 'Sulphuric Acid Test',
                procedure: 'To the third part of the hot solution add few drops of alcohol and dilute sulphuric acid.',
                observation: 'A white precipitate is obtained which is soluble in ammonium acetate solution.'
            }
        ]
    },

    // Group II
    {
        id: 'copper',
        symbol: 'Cu²⁺',
        name: 'Copper',
        group: 2,
        groupReagent: 'H₂S gas in presence of dil. HCl',
        precipitateColor: 'Black',
        saltColors: ['Blue'],
        flameTest: {
            nakedEye: 'Green flame with blue centre',
            throughBlueGlass: 'Same colour as observed without glass',
            hexColor: '#00FF00'
        },
        boraxBead: {
            oxidizingCold: 'Blue',
            oxidizingHot: 'Green',
            reducingCold: 'Red opaque',
            reducingHot: 'Colourless'
        },
        confirmatoryTests: [
            {
                testName: 'Excess NH₄OH Test',
                procedure: 'Dissolve the precipitate in ammonium acetate solution. If no precipitate is formed, add excess of ammonium hydroxide solution.',
                observation: 'A blue solution is obtained.'
            },
            {
                testName: 'Potassium Ferrocyanide Test',
                procedure: 'Acidify the blue solution with acetic acid and add potassium ferrocyanide solution.',
                observation: 'A chocolate brown precipitate is formed.'
            }
        ]
    },
    {
        id: 'arsenic',
        symbol: 'As³⁺',
        name: 'Arsenic',
        group: 2,
        groupReagent: 'H₂S gas in presence of dil. HCl',
        precipitateColor: 'Yellow (soluble in yellow ammonium sulphide)',
        charcoalCavity: 'White residue with the odour of garlic',
        confirmatoryTests: [
            {
                testName: 'Ammonium Molybdate Test',
                procedure: 'Acidify the yellow precipitate solution with dilute HCl. A yellow precipitate is formed. Heat the precipitate with concentrated nitric acid and add ammonium molybdate solution.',
                observation: 'A canary yellow precipitate is formed.'
            }
        ]
    },

    // Group III
    {
        id: 'iron',
        symbol: 'Fe³⁺',
        name: 'Iron (III)',
        group: 3,
        groupReagent: 'NH₄OH in presence of NH₄Cl',
        precipitateColor: 'Brown (reddish brown hydroxide)',
        saltColors: ['Light green', 'Yellow', 'Brown'],
        boraxBead: {
            oxidizingCold: 'Yellow',
            oxidizingHot: 'Yellowish brown',
            reducingCold: 'Green',
            reducingHot: 'Green'
        },
        confirmatoryTests: [
            {
                testName: 'Potassium Ferrocyanide Test',
                procedure: 'Dissolve the precipitate in dilute HCl and divide the solution into two parts. To the first part add potassium ferrocyanide solution [Potassium hexacyanoferrate (II)].',
                observation: 'A blue precipitate/colouration appears (Prussian Blue).'
            },
            {
                testName: 'Potassium Thiocyanate Test',
                procedure: 'To the second part add potassium thiocyanate solution.',
                observation: 'A blood red colouration appears.'
            }
        ]
    },
    {
        id: 'aluminium',
        symbol: 'Al³⁺',
        name: 'Aluminium',
        group: 3,
        groupReagent: 'NH₄OH in presence of NH₄Cl',
        precipitateColor: 'White (gelatinous hydroxide)',
        saltColors: ['White', 'Colourless'],
        confirmatoryTests: [
            {
                testName: 'Sodium Hydroxide Test',
                procedure: 'Dissolve the white precipitate in dilute HCl and divide into two parts. To the first part add sodium hydroxide solution and warm.',
                observation: 'A white gelatinous precipitate soluble in excess of sodium hydroxide solution.'
            },
            {
                testName: 'Lake Test',
                procedure: 'To the second part first add blue litmus solution and then ammonium hydroxide solution drop by drop along the sides of the test tube.',
                observation: 'A blue floating mass in the colourless solution is obtained.'
            }
        ]
    },

    // Group IV
    {
        id: 'cobalt',
        symbol: 'Co²⁺',
        name: 'Cobalt',
        group: 4,
        groupReagent: 'H₂S in presence of NH₄OH',
        precipitateColor: 'Black',
        saltColors: ['Blue', 'Red', 'Violet', 'Pink'],
        confirmatoryTests: [
            {
                testName: 'Potassium Nitrite Test',
                procedure: 'Dissolve the precipitate in aqua regia. Heat the solution to dryness and cool. Dissolve the residue in water and divide the solution into two parts. Neutralise the second part with ammonium hydroxide solution. Acidify it with dilute acetic acid and add solid potassium nitrite.',
                observation: 'A yellow precipitate confirms the presence of Co²⁺ ions.'
            }
        ]
    },
    {
        id: 'nickel',
        symbol: 'Ni²⁺',
        name: 'Nickel',
        group: 4,
        groupReagent: 'H₂S in presence of NH₄OH',
        precipitateColor: 'Black',
        saltColors: ['Bright green'],
        boraxBead: {
            oxidizingCold: 'Reddish brown',
            oxidizingHot: 'Violet',
            reducingCold: 'Grey',
            reducingHot: 'Grey'
        },
        confirmatoryTests: [
            {
                testName: 'Dimethyl Glyoxime Test',
                procedure: 'Dissolve the precipitate in aqua regia. Heat the solution to dryness and cool. Dissolve the residue in water. To the first part of the solution add ammonium hydroxide solution till it becomes alkaline. Add a few drops of dimethyl glyoxime and shake the test tube.',
                observation: 'Formation of a bright red precipitate confirms the presence of Ni²⁺ ions.'
            }
        ]
    },
    {
        id: 'manganese',
        symbol: 'Mn²⁺',
        name: 'Manganese',
        group: 4,
        groupReagent: 'H₂S in presence of NH₄OH',
        precipitateColor: 'Flesh coloured (buff/pink)',
        saltColors: ['Light pink'],
        boraxBead: {
            oxidizingCold: 'Light violet',
            oxidizingHot: 'Light violet',
            reducingCold: 'Colourless',
            reducingHot: 'Colourless'
        },
        confirmatoryTests: [
            {
                testName: 'Sodium Hydroxide Test',
                procedure: 'Dissolve the precipitate in dilute HCl by boiling, then add sodium hydroxide solution in excess.',
                observation: 'A white precipitate is formed which turns brown on keeping.'
            }
        ]
    },
    {
        id: 'zinc',
        symbol: 'Zn²⁺',
        name: 'Zinc',
        group: 4,
        groupReagent: 'H₂S in presence of NH₄OH',
        precipitateColor: 'White',
        saltColors: ['White', 'Colourless'],
        charcoalCavity: 'Yellow residue when hot and white when cold',
        confirmatoryTests: [
            {
                testName: 'Sodium Hydroxide Test',
                procedure: 'Dissolve the precipitate in dilute HCl by boiling. Divide the solution into two parts. To the first part add sodium hydroxide solution.',
                observation: 'A white precipitate soluble in excess of sodium hydroxide solution confirms the presence of Zn²⁺ ions.'
            },
            {
                testName: 'Potassium Ferrocyanide Test',
                procedure: 'Neutralise the second part with ammonium hydroxide solution and add potassium ferrocyanide solution.',
                observation: 'A bluish white precipitate appears.'
            }
        ]
    },

    // Group V
    {
        id: 'barium',
        symbol: 'Ba²⁺',
        name: 'Barium',
        group: 5,
        groupReagent: '(NH₄)₂CO₃ in presence of NH₄OH',
        precipitateColor: 'White (carbonate)',
        saltColors: ['White', 'Colourless'],
        flameTest: {
            nakedEye: 'Apple green',
            throughBlueGlass: 'Bluish green',
            hexColor: '#7CFC00'
        },
        confirmatoryTests: [
            {
                testName: 'Potassium Chromate Test',
                procedure: 'Dissolve the precipitate by boiling with dilute acetic acid and divide the solution into three parts. To the first part add potassium chromate solution.',
                observation: 'A yellow precipitate appears.'
            },
            {
                testName: 'Flame Test',
                procedure: 'Perform the flame test with the preserved precipitate.',
                observation: 'A grassy green flame is obtained.'
            }
        ]
    },
    {
        id: 'strontium',
        symbol: 'Sr²⁺',
        name: 'Strontium',
        group: 5,
        groupReagent: '(NH₄)₂CO₃ in presence of NH₄OH',
        precipitateColor: 'White (carbonate)',
        saltColors: ['White', 'Colourless'],
        flameTest: {
            nakedEye: 'Crimson red',
            throughBlueGlass: 'Purple',
            hexColor: '#DC143C'
        },
        confirmatoryTests: [
            {
                testName: 'Ammonium Sulphate Test',
                procedure: 'If barium is absent, take second part of the solution and add ammonium sulphate solution. Heat and scratch the sides of the test tube with a glass rod and cool.',
                observation: 'A white precipitate is formed.'
            },
            {
                testName: 'Flame Test',
                procedure: 'Perform the flame test with the preserved precipitate.',
                observation: 'A crimson-red flame confirms the presence of Sr²⁺ ions.'
            }
        ]
    },
    {
        id: 'calcium',
        symbol: 'Ca²⁺',
        name: 'Calcium',
        group: 5,
        groupReagent: '(NH₄)₂CO₃ in presence of NH₄OH',
        precipitateColor: 'White (carbonate)',
        saltColors: ['White', 'Colourless'],
        flameTest: {
            nakedEye: 'Brick red',
            throughBlueGlass: 'Green',
            hexColor: '#CB4154'
        },
        confirmatoryTests: [
            {
                testName: 'Ammonium Oxalate Test',
                procedure: 'If both barium and strontium are absent, take the third part of the solution. Add ammonium oxalate solution and shake well.',
                observation: 'A white precipitate of calcium oxalate is obtained.'
            },
            {
                testName: 'Flame Test',
                procedure: 'Perform the flame test with the preserved precipitate.',
                observation: 'A brick red flame, which looks greenish-yellow through blue glass, confirms the presence of Ca²⁺ ions.'
            }
        ]
    },

    // Group VI
    {
        id: 'magnesium',
        symbol: 'Mg²⁺',
        name: 'Magnesium',
        group: 6,
        groupReagent: 'None (remaining filtrate)',
        precipitateColor: 'White',
        saltColors: ['White', 'Colourless'],
        confirmatoryTests: [
            {
                testName: 'Disodium Hydrogen Phosphate Test',
                procedure: 'To the original solution of salt added ammonium hydroxide solution, followed by disodium hydrogen phosphate solution. Heat and scratch the sides of the test tube.',
                observation: 'White precipitate confirms Mg²⁺.'
            }
        ]
    }
];

// ============ SALT DATA ============

export const SALTS: Salt[] = [
    // Common CBSE Practical Salts
    { id: 'CuSO4', formula: 'CuSO₄', name: 'Copper Sulphate', cation: 'copper', anion: 'sulphate', color: 'Blue', colorHex: '#1E90FF', solubility: 'soluble', colorOnHeating: 'White' },
    { id: 'FeSO4', formula: 'FeSO₄', name: 'Ferrous Sulphate', cation: 'iron', anion: 'sulphate', color: 'Green', colorHex: '#90EE90', solubility: 'soluble', colorOnHeating: 'Dirty white or yellow' },
    { id: 'ZnSO4', formula: 'ZnSO₄', name: 'Zinc Sulphate', cation: 'zinc', anion: 'sulphate', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble', colorOnHeating: 'Yellow' },
    { id: 'MgSO4', formula: 'MgSO₄', name: 'Magnesium Sulphate', cation: 'magnesium', anion: 'sulphate', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
    { id: 'BaSO4', formula: 'BaSO₄', name: 'Barium Sulphate', cation: 'barium', anion: 'sulphate', color: 'White', colorHex: '#FFFFFF', solubility: 'insoluble' },

    { id: 'NaCl', formula: 'NaCl', name: 'Sodium Chloride', cation: 'ammonium', anion: 'chloride', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
    { id: 'NH4Cl', formula: 'NH₄Cl', name: 'Ammonium Chloride', cation: 'ammonium', anion: 'chloride', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
    { id: 'PbCl2', formula: 'PbCl₂', name: 'Lead Chloride', cation: 'lead', anion: 'chloride', color: 'White', colorHex: '#FFFFFF', solubility: 'sparingly' },
    { id: 'BaCl2', formula: 'BaCl₂', name: 'Barium Chloride', cation: 'barium', anion: 'chloride', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
    { id: 'CaCl2', formula: 'CaCl₂', name: 'Calcium Chloride', cation: 'calcium', anion: 'chloride', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
    { id: 'ZnCl2', formula: 'ZnCl₂', name: 'Zinc Chloride', cation: 'zinc', anion: 'chloride', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },

    { id: 'Na2CO3', formula: 'Na₂CO₃', name: 'Sodium Carbonate', cation: 'ammonium', anion: 'carbonate', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
    { id: 'CaCO3', formula: 'CaCO₃', name: 'Calcium Carbonate', cation: 'calcium', anion: 'carbonate', color: 'White', colorHex: '#FFFFFF', solubility: 'insoluble' },
    { id: 'BaCO3', formula: 'BaCO₃', name: 'Barium Carbonate', cation: 'barium', anion: 'carbonate', color: 'White', colorHex: '#FFFFFF', solubility: 'insoluble' },

    { id: 'Pb(NO3)2', formula: 'Pb(NO₃)₂', name: 'Lead Nitrate', cation: 'lead', anion: 'nitrate', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
    { id: 'Cu(NO3)2', formula: 'Cu(NO₃)₂', name: 'Copper Nitrate', cation: 'copper', anion: 'nitrate', color: 'Blue', colorHex: '#1E90FF', solubility: 'soluble' },
    { id: 'Zn(NO3)2', formula: 'Zn(NO₃)₂', name: 'Zinc Nitrate', cation: 'zinc', anion: 'nitrate', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },

    { id: 'FeCl3', formula: 'FeCl₃', name: 'Ferric Chloride', cation: 'iron', anion: 'chloride', color: 'Yellow-brown', colorHex: '#DAA520', solubility: 'soluble' },
    { id: 'AlCl3', formula: 'AlCl₃', name: 'Aluminium Chloride', cation: 'aluminium', anion: 'chloride', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },

    { id: 'MnSO4', formula: 'MnSO₄', name: 'Manganese Sulphate', cation: 'manganese', anion: 'sulphate', color: 'Light pink', colorHex: '#FFB6C1', solubility: 'soluble' },
    { id: 'NiSO4', formula: 'NiSO₄', name: 'Nickel Sulphate', cation: 'nickel', anion: 'sulphate', color: 'Green', colorHex: '#00FF7F', solubility: 'soluble' },
    { id: 'CoSO4', formula: 'CoSO₄', name: 'Cobalt Sulphate', cation: 'cobalt', anion: 'sulphate', color: 'Pink', colorHex: '#FF69B4', solubility: 'soluble', colorOnHeating: 'Blue' },

    { id: 'Na2S', formula: 'Na₂S', name: 'Sodium Sulphide', cation: 'ammonium', anion: 'sulphide', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
    { id: 'Na2SO3', formula: 'Na₂SO₃', name: 'Sodium Sulphite', cation: 'ammonium', anion: 'sulphite', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },

    { id: 'CH3COONa', formula: 'CH₃COONa', name: 'Sodium Acetate', cation: 'ammonium', anion: 'acetate', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
    { id: 'CH3COONH4', formula: 'CH₃COONH₄', name: 'Ammonium Acetate', cation: 'ammonium', anion: 'acetate', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },

    { id: 'KBr', formula: 'KBr', name: 'Potassium Bromide', cation: 'ammonium', anion: 'bromide', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
    { id: 'KI', formula: 'KI', name: 'Potassium Iodide', cation: 'ammonium', anion: 'iodide', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },

    { id: 'Na3PO4', formula: 'Na₃PO₄', name: 'Sodium Phosphate', cation: 'ammonium', anion: 'phosphate', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
    { id: 'Na2C2O4', formula: 'Na₂C₂O₄', name: 'Sodium Oxalate', cation: 'ammonium', anion: 'oxalate', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },

    { id: 'SrCl2', formula: 'SrCl₂', name: 'Strontium Chloride', cation: 'strontium', anion: 'chloride', color: 'White', colorHex: '#FFFFFF', solubility: 'soluble' },
];

// ============ HELPER FUNCTIONS ============

export const getAnionById = (id: string): Anion | undefined => ANIONS.find(a => a.id === id);
export const getCationById = (id: string): Cation | undefined => CATIONS.find(c => c.id === id);
export const getSaltById = (id: string): Salt | undefined => SALTS.find(s => s.id === id);

export const getRandomSalt = (): Salt => SALTS[Math.floor(Math.random() * SALTS.length)];

export const getSaltDetails = (salt: Salt) => {
    const cation = getCationById(salt.cation);
    const anion = getAnionById(salt.anion);
    return { salt, cation, anion };
};

// Group information for systematic analysis
export const CATION_GROUPS = [
    { group: 0, name: 'Group Zero', reagent: 'None', cations: ['NH₄⁺'], precipitate: 'Test separately with NaOH' },
    { group: 1, name: 'Group I', reagent: 'Dilute HCl', cations: ['Pb²⁺'], precipitate: 'White chloride' },
    { group: 2, name: 'Group II', reagent: 'H₂S in dil. HCl', cations: ['Pb²⁺', 'Cu²⁺', 'As³⁺'], precipitate: 'Sulphides' },
    { group: 3, name: 'Group III', reagent: 'NH₄OH + NH₄Cl', cations: ['Fe³⁺', 'Al³⁺'], precipitate: 'Hydroxides' },
    { group: 4, name: 'Group IV', reagent: 'H₂S + NH₄OH', cations: ['Co²⁺', 'Ni²⁺', 'Mn²⁺', 'Zn²⁺'], precipitate: 'Sulphides' },
    { group: 5, name: 'Group V', reagent: '(NH₄)₂CO₃ + NH₄OH', cations: ['Ba²⁺', 'Sr²⁺', 'Ca²⁺'], precipitate: 'Carbonates' },
    { group: 6, name: 'Group VI', reagent: 'None', cations: ['Mg²⁺'], precipitate: 'Remaining filtrate' },
];

export const ANION_GROUPS = [
    { group: 'A', name: 'Group A (Dilute H₂SO₄)', anions: ['CO₃²⁻', 'S²⁻', 'SO₃²⁻', 'NO₂⁻', 'CH₃COO⁻'] },
    { group: 'B', name: 'Group B (Conc. H₂SO₄)', anions: ['Cl⁻', 'Br⁻', 'I⁻', 'NO₃⁻', 'C₂O₄²⁻'] },
    { group: 'independent', name: 'Independent Anions', anions: ['SO₄²⁻', 'PO₄³⁻'] },
];
