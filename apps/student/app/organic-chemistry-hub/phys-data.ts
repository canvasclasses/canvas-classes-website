export interface PhysProperty {
    id: string;
    name: string;
    type: string;
    formula: string;
    mw: number;
    bp: number; // in Celsius
    mp: number; // in Celsius
    solubilityScore: number; // 0-100 for bar chart visualization
    solubility: 'High' | 'Moderate' | 'Low' | 'Insoluble';
    solubilityValue: string;
    explanation: string;
    color: string;
    label: string;
    forces: string;
    waterInt: string;
}

// Peer Group ~58-60 u (NCERT standard comparisons)
const C_ALKANE_58: PhysProperty = { id: 'butane', name: 'n-Butane', type: 'Alkane', formula: 'CH3CH2CH2CH3', mw: 58, bp: 0, mp: -138, solubilityScore: 0, solubility: 'Insoluble', solubilityValue: 'Immiscible', explanation: 'Non-polar molecule. Only weak van der Waals forces exist.', forces: 'Weak Van der Waals', waterInt: 'Incapable of H-bonding', color: '#94a3b8', label: 'Alkane' };
const C_ETHER_60: PhysProperty = { id: 'methoxyethane', name: 'Methoxyethane', type: 'Ether', formula: 'CH3OCH2CH3', mw: 60, bp: 11, mp: -113, solubilityScore: 40, solubility: 'Moderate', solubilityValue: 'Soluble', explanation: 'Slightly polar. Has dipole-dipole interactions but no intermolecular H-bonding.', forces: 'VDW, Dipole-Dipole', waterInt: 'Forms weak H-bonds', color: '#fbbf24', label: 'Ether' };
const C_ALDEHYDE_58: PhysProperty = { id: 'propanal', name: 'Propanal', type: 'Aldehyde', formula: 'CH3CH2CHO', mw: 58, bp: 48, mp: -81, solubilityScore: 60, solubility: 'Moderate', solubilityValue: '16g/100ml', explanation: 'Polar carbonyl group gives stronger dipole-dipole interactions than ethers, but no intermolecular H-bonding.', forces: 'VDW, Dipole-Dipole', waterInt: 'Accepts H-bonds', color: '#8b5cf6', label: 'Aldehyde' };
const C_KETONE_58: PhysProperty = { id: 'acetone', name: 'Propanone (Acetone)', type: 'Ketone', formula: 'CH3COCH3', mw: 58, bp: 56, mp: -95, solubilityScore: 100, solubility: 'High', solubilityValue: 'Miscible', explanation: 'Highly polar carbonyl group with strong dipole-dipole interactions. Slightly higher than Propanal due to stronger dipole moment.', forces: 'VDW, Strong Dipole-Dipole', waterInt: 'Miscible, accepts H-bonds', color: '#ec4899', label: 'Ketone' };
const C_ALCOHOL_60: PhysProperty = { id: 'propan-1-ol', name: 'Propan-1-ol', type: 'Alcohol', formula: 'CH3CH2CH2OH', mw: 60, bp: 97, mp: -126, solubilityScore: 100, solubility: 'High', solubilityValue: 'Miscible', explanation: 'Strong intermolecular H-bonding due to polar O-H bond.', forces: 'VDW, DD, H-Bonding', waterInt: 'Strong H-bonding', color: '#10b981', label: '1° Alcohol' };
const C_ACID_60: PhysProperty = { id: 'ethanoic-acid', name: 'Ethanoic Acid', type: 'Carboxylic Acid', formula: 'CH3COOH', mw: 60, bp: 118, mp: 17, solubilityScore: 100, solubility: 'High', solubilityValue: 'Miscible', explanation: 'Extensive H-bonding through cyclic dimer formation. Highest boiling point among comparable masses.', forces: 'Strong Dimer H-Bonding', waterInt: 'Strong H-bonding', color: '#ef4444', label: 'Acid' };

// Peer Group ~72-74 u
const C_ALKANE_72: PhysProperty = { id: 'pentane', name: 'n-Pentane', type: 'Alkane', formula: 'CH3(CH2)3CH3', mw: 72, bp: 36, mp: -130, solubilityScore: 0, solubility: 'Insoluble', solubilityValue: 'Immiscible', explanation: 'Non-polar linear alkane with weak London dispersion forces.', forces: 'Weak Van der Waals', waterInt: 'Incapable of H-bonding', color: '#94a3b8', label: 'Alkane' };
const C_ETHER_74: PhysProperty = { id: 'diethyl-ether', name: 'Diethyl Ether', type: 'Ether', formula: 'CH3CH2OCH2CH3', mw: 74, bp: 38, mp: -116, solubilityScore: 30, solubility: 'Moderate', solubilityValue: '6g/100ml', explanation: 'Polar molecule with only dipole-dipole interactions. Boiling point very close to similar alkanes.', forces: 'VDW, DD', waterInt: 'Accepts H-bonds', color: '#fbbf24', label: 'Ether' };
const C_ESTER_74: PhysProperty = { id: 'methylacetate', name: 'Methyl Ethanoate', type: 'Ester', formula: 'CH3COOCH3', mw: 74, bp: 58, mp: -98, solubilityScore: 60, solubility: 'Moderate', solubilityValue: '25g/100ml', explanation: 'Polar molecule, dipole-dipole interactions, no intermolecular H-bonding.', forces: 'VDW, DD', waterInt: 'Accepts H-bonds', color: '#f59e0b', label: 'Ester' };
const C_ALDEHYDE_72: PhysProperty = { id: 'butanal', name: 'Butanal', type: 'Aldehyde', formula: 'CH3CH2CH2CHO', mw: 72, bp: 75, mp: -99, solubilityScore: 35, solubility: 'Moderate', solubilityValue: '7g/100ml', explanation: 'Stronger dipole interaction than ethers, but no internal H-bonding.', forces: 'VDW, Dipole-Dipole', waterInt: 'Accepts H-bonds', color: '#8b5cf6', label: 'Aldehyde' };
const C_KETONE_72: PhysProperty = { id: 'butanone', name: 'Butanone', type: 'Ketone', formula: 'CH3COCH2CH3', mw: 72, bp: 80, mp: -86, solubilityScore: 70, solubility: 'High', solubilityValue: '27g/100ml', explanation: 'Strong dipole moment of C=O group. Comparable MW to Butanal but slightly more polar.', forces: 'VDW, Strong DD', waterInt: 'Accepts H-bonds', color: '#ec4899', label: 'Ketone' };
const C_ALCOHOL_74: PhysProperty = { id: 'n-butanol', name: 'Butan-1-ol', type: 'Alcohol', formula: 'CH3CH2CH2CH2OH', mw: 74, bp: 118, mp: -90, solubilityScore: 40, solubility: 'Moderate', solubilityValue: '7.3g/100ml', explanation: 'Intermolecular hydrogen bonding. BP is significantly higher than aldehydes/ketones.', forces: 'VDW, DD, H-Bonding', waterInt: 'Semi-soluble', color: '#10b981', label: '1° Alcohol' };
const C_AMINE_73: PhysProperty = { id: 'butylamine', name: 'Butan-1-amine', type: 'Amine', formula: 'CH3CH2CH2CH2NH2', mw: 73, bp: 78, mp: -49, solubilityScore: 100, solubility: 'High', solubilityValue: 'Miscible', explanation: 'Forms H-bonds but weaker than Oxygen-based ones because N is less electronegative.', forces: 'VDW, DD, HB', waterInt: 'Forms H-bonds', color: '#6366f1', label: '1° Amine' };
const C_ACID_74: PhysProperty = { id: 'propanoic-acid', name: 'Propanoic Acid', type: 'Carboxylic Acid', formula: 'CH3CH2COOH', mw: 74, bp: 141, mp: -21, solubilityScore: 100, solubility: 'High', solubilityValue: 'Miscible', explanation: 'Extensive intermolecular H-bonding via dimer formation.', forces: 'Strong Dimer H-Bonding', waterInt: 'Strong H-bonding', color: '#ef4444', label: 'Acid' };
const C_AMIDE_73: PhysProperty = { id: 'propanamide', name: 'Propanamide', type: 'Amide', formula: 'CH3CH2CONH2', mw: 73, bp: 213, mp: 79, solubilityScore: 100, solubility: 'High', solubilityValue: 'miscible', explanation: 'Highest bp due to resonance-stabilized polar group and multiple possible H-bonds.', forces: 'Extensive H-bonding', waterInt: 'Strong H-bonding', color: '#6366f1', label: '1° Amide' };
const C_ACID_CHLORIDE_78: PhysProperty = { id: 'ethanoyl-chloride', name: 'Ethanoyl Chloride', type: 'Acid Chloride', formula: 'CH3COCl', mw: 78.5, bp: 52, mp: -112, solubilityScore: 20, solubility: 'Insoluble', solubilityValue: 'Reacts with water', explanation: 'Polar molecule with dipole-dipole interactions. Lower bp than parent acid as it cannot form H-bonds.', forces: 'VDW, Strong DD', waterInt: 'Reacts violently', color: '#f97316', label: 'Acid Chloride' };

// Isomers (NCERT Standard Case)
const C_ALC_3_83: PhysProperty = { id: 'tert-butanol', name: '2-Methylpropan-2-ol', type: 'Alcohol (3°)', formula: '(CH3)3COH', mw: 74, bp: 83, mp: 25, solubilityScore: 100, solubility: 'High', solubilityValue: 'Miscible', explanation: 'Increased branching reduces surface area, decreasing VDW forces.', forces: 'Weakened VDW & HB', waterInt: 'Miscible', color: '#f43f5e', label: '3° Alcohol' };

export const ALL_COMPOUNDS: PhysProperty[] = [
    // Peer Group 1
    C_ALKANE_58, C_ETHER_60, C_ALDEHYDE_58, C_KETONE_58, C_ALCOHOL_60, C_ACID_60,
    // Peer Group 2
    C_ALKANE_72, C_ETHER_74, C_ESTER_74, C_ALDEHYDE_72, C_KETONE_72, C_AMINE_73, C_ALCOHOL_74, C_ACID_74, C_AMIDE_73, C_ACID_CHLORIDE_78,
    // Specific Isomers
    C_ALC_3_83
];
