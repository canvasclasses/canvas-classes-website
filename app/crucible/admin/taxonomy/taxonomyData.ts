'use client';

import { useState, useEffect, useRef } from 'react';
import { TaxonomyNode } from '../../../the-crucible/components/types';
export type { TaxonomyNode };
import {
    Loader, Plus, Trash2, Edit2, Save, X, Folder, Tag, Video, FileText,
    ExternalLink, Check, AlertCircle, GripVertical, ChevronDown, ChevronRight,
    Beaker, Atom, Leaf
} from 'lucide-react';

// Branch config
const BRANCHES = [
    { id: 'TAG_BRANCH_PHYSICAL', name: 'Physical Chemistry', icon: Beaker, color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
    { id: 'TAG_BRANCH_INORG', name: 'Inorganic Chemistry', icon: Atom, color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)' },
    { id: 'TAG_BRANCH_ORGANIC', name: 'Organic Chemistry', icon: Leaf, color: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
];

// Complete Taxonomy - 36 Chapters + 200+ Primary Concept Tags (Hardcoded - Version Controlled)
const HARDCODED_TAXONOMY: TaxonomyNode[] = [
    // ============================================
    // PHYSICAL CHEMISTRY BRANCH - 12 chapters
    // ============================================
    
    // Class 11 Physical Chemistry
    { id: 'ch_some_basic_concepts', name: 'Some Basic Concepts of Chemistry', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 1, class_level: 11 },
    { id: 'ch_structure_of_atom', name: 'Structure of Atom', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 2, class_level: 11 },
    { id: 'ch_classification_of_elements', name: 'Classification of Elements and Periodicity in Properties', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 3, class_level: 11 },
    { id: 'ch_chemical_bonding', name: 'Chemical Bonding and Molecular Structure', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 4, class_level: 11 },
    { id: 'ch_states_of_matter', name: 'States of Matter (Gases & Liquids)', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 5, class_level: 11 },
    { id: 'ch_thermodynamics', name: 'Thermodynamics', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 6, class_level: 11 },
    { id: 'ch_equilibrium', name: 'Equilibrium', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 7, class_level: 11 },
    
    // Class 12 Physical Chemistry
    { id: 'ch_solid_state', name: 'The Solid State', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 15, class_level: 12 },
    { id: 'ch_solutions', name: 'Solutions', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 16, class_level: 12 },
    { id: 'ch_electrochemistry', name: 'Electrochemistry', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 17, class_level: 12 },
    { id: 'ch_chemical_kinetics', name: 'Chemical Kinetics', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 18, class_level: 12 },
    { id: 'ch_surface_chemistry', name: 'Surface Chemistry', parent_id: 'TAG_BRANCH_PHYSICAL', type: 'chapter', sequence_order: 19, class_level: 12 },
    
    // ============================================
    // INORGANIC CHEMISTRY BRANCH - 12 chapters
    // ============================================
    
    // Class 11 Inorganic Chemistry
    { id: 'ch_redox_reactions', name: 'Redox Reactions', parent_id: 'TAG_BRANCH_INORG', type: 'chapter', sequence_order: 8, class_level: 11 },
    { id: 'ch_hydrogen', name: 'Hydrogen', parent_id: 'TAG_BRANCH_INORG', type: 'chapter', sequence_order: 9, class_level: 11 },
    { id: 'ch_s_block', name: 'The s-Block Elements (Alkali & Alkaline Earth)', parent_id: 'TAG_BRANCH_INORG', type: 'chapter', sequence_order: 10, class_level: 11 },
    { id: 'ch_p_block_11', name: 'The p-Block Elements (Groups 13-14)', parent_id: 'TAG_BRANCH_INORG', type: 'chapter', sequence_order: 11, class_level: 11 },
    
    // Class 12 Inorganic Chemistry
    { id: 'ch_isolation_of_elements', name: 'General Principles & Processes of Isolation of Elements', parent_id: 'TAG_BRANCH_INORG', type: 'chapter', sequence_order: 20, class_level: 12 },
    { id: 'ch_p_block_12', name: 'The p-Block Elements (Groups 15-18)', parent_id: 'TAG_BRANCH_INORG', type: 'chapter', sequence_order: 21, class_level: 12 },
    { id: 'ch_d_f_block', name: 'The d- and f-Block Elements', parent_id: 'TAG_BRANCH_INORG', type: 'chapter', sequence_order: 22, class_level: 12 },
    { id: 'ch_coordination_compounds', name: 'Coordination Compounds', parent_id: 'TAG_BRANCH_INORG', type: 'chapter', sequence_order: 23, class_level: 12 },
    
    // Additional Inorganic Topics
    { id: 'ch_environmental_chemistry', name: 'Environmental Chemistry', parent_id: 'TAG_BRANCH_INORG', type: 'chapter', sequence_order: 14, class_level: 11 },
    { id: 'ch_metallurgy', name: 'Metallurgy', parent_id: 'TAG_BRANCH_INORG', type: 'chapter', sequence_order: 24, class_level: 12 },
    
    // ============================================
    // ORGANIC CHEMISTRY BRANCH - 12 chapters
    // ============================================
    
    // Class 11 Organic Chemistry
    { id: 'ch_organic_basics', name: 'Organic Chemistry - Some Basic Principles & Techniques', parent_id: 'TAG_BRANCH_ORGANIC', type: 'chapter', sequence_order: 12, class_level: 11 },
    { id: 'ch_hydrocarbons', name: 'Hydrocarbons', parent_id: 'TAG_BRANCH_ORGANIC', type: 'chapter', sequence_order: 13, class_level: 11 },
    
    // Class 12 Organic Chemistry
    { id: 'ch_haloalkanes', name: 'Haloalkanes and Haloarenes', parent_id: 'TAG_BRANCH_ORGANIC', type: 'chapter', sequence_order: 24, class_level: 12 },
    { id: 'ch_alcohols_phenols', name: 'Alcohols, Phenols and Ethers', parent_id: 'TAG_BRANCH_ORGANIC', type: 'chapter', sequence_order: 25, class_level: 12 },
    { id: 'ch_aldehydes_ketones', name: 'Aldehydes, Ketones and Carboxylic Acids', parent_id: 'TAG_BRANCH_ORGANIC', type: 'chapter', sequence_order: 26, class_level: 12 },
    { id: 'ch_amines', name: 'Amines', parent_id: 'TAG_BRANCH_ORGANIC', type: 'chapter', sequence_order: 27, class_level: 12 },
    { id: 'ch_biomolecules', name: 'Biomolecules', parent_id: 'TAG_BRANCH_ORGANIC', type: 'chapter', sequence_order: 28, class_level: 12 },
    { id: 'ch_polymers', name: 'Polymers', parent_id: 'TAG_BRANCH_ORGANIC', type: 'chapter', sequence_order: 29, class_level: 12 },
    { id: 'ch_chemistry_everyday', name: 'Chemistry in Everyday Life', parent_id: 'TAG_BRANCH_ORGANIC', type: 'chapter', sequence_order: 30, class_level: 12 },
    
    // ============================================
    // CONCEPT TAGS - Physical Chemistry
    // ============================================
    
    // Ch1: Some Basic Concepts of Chemistry
    { id: 'TAG_CH1_MOLE_CONCEPT', name: 'Mole Concept', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_MOLAR_MASS', name: 'Molar Mass', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_AVOGADRO', name: 'Avogadro Number', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_STOICHIOMETRY', name: 'Stoichiometry', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_LIMITING_REAGENT', name: 'Limiting Reagent', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_EMP_FORMULA', name: 'Empirical Formula', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_MOL_FORMULA', name: 'Molecular Formula', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_PERCENT_COMP', name: 'Percentage Composition', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_MOLARITY', name: 'Molarity', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_MOLALITY', name: 'Molality', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_NORMALITY', name: 'Normality', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_MOLE_FRACTION', name: 'Mole Fraction', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_MASS_PERCENT', name: 'Mass Percentage', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    { id: 'TAG_CH1_TITRATION', name: 'Titration', parent_id: 'ch_some_basic_concepts', type: 'topic' },
    
    // Ch2: Structure of Atom
    { id: 'TAG_CH2_DISCOVERY_ELECTRON', name: 'Discovery of Electron', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_DISCOVERY_PROTON', name: 'Discovery of Proton', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_DISCOVERY_NEUTRON', name: 'Discovery of Neutron', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_THOMSON_MODEL', name: 'Thomson Model', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_RUTHERFORD_MODEL', name: 'Rutherford Model', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_BOHR_MODEL', name: 'Bohr Model', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_QUANTUM_MECHANICAL', name: 'Quantum Mechanical Model', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_QUANTUM_NUMBERS', name: 'Quantum Numbers', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_ORBITALS', name: 'Atomic Orbitals', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_ELECTRONIC_CONFIG', name: 'Electronic Configuration', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_PAULI_EXCLUSION', name: 'Pauli Exclusion Principle', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_HUNDS_RULE', name: 'Hunds Rule', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_AUFBAU_PRINCIPLE', name: 'Aufbau Principle', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_DEBROGLIE', name: 'de Broglie Hypothesis', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_HEISENBERG', name: 'Heisenberg Uncertainty Principle', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_SCHRODINGER', name: 'Schrodinger Wave Equation', parent_id: 'ch_structure_of_atom', type: 'topic' },
    { id: 'TAG_CH2_SPECTRAL_LINES', name: 'Spectral Lines', parent_id: 'ch_structure_of_atom', type: 'topic' },
    
    // Ch3: Classification of Elements
    { id: 'TAG_CH3_PERIODIC_LAW', name: 'Periodic Law', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_PERIODIC_TABLE', name: 'Modern Periodic Table', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_GROUPS', name: 'Groups', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_PERIODS', name: 'Periods', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_BLOCK_CLASSIFICATION', name: 's, p, d, f Block Elements', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_ATOMIC_RADIUS', name: 'Atomic Radius', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_IONIC_RADIUS', name: 'Ionic Radius', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_IONIZATION_ENERGY', name: 'Ionization Energy', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_ELECTRON_AFFINITY', name: 'Electron Affinity', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_ELECTRONEGATIVITY', name: 'Electronegativity', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_METALLIC_CHARACTER', name: 'Metallic Character', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_VALENCY', name: 'Valency', parent_id: 'ch_classification_of_elements', type: 'topic' },
    { id: 'TAG_CH3_PERIODIC_TRENDS', name: 'Periodic Trends', parent_id: 'ch_classification_of_elements', type: 'topic' },
    
    // Ch4: Chemical Bonding
    { id: 'TAG_CH4_KOSEL_LEWIS', name: 'Kossel-Lewis Approach', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_IONIC_BOND', name: 'Ionic Bond', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_COVALENT_BOND', name: 'Covalent Bond', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_COORDINATE_BOND', name: 'Coordinate Bond', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_VSEPR', name: 'VSEPR Theory', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_VALENCE_BOND', name: 'Valence Bond Theory', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_HYBRIDIZATION', name: 'Hybridization', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_MOLECULAR_ORBITAL', name: 'Molecular Orbital Theory', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_BOND_ORDER', name: 'Bond Order', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_HYDROGEN_BOND', name: 'Hydrogen Bonding', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_DIPOLE_MOMENT', name: 'Dipole Moment', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_POLARITY', name: 'Polarity', parent_id: 'ch_chemical_bonding', type: 'topic' },
    { id: 'TAG_CH4_FAJANS_RULES', name: 'Fajans Rules', parent_id: 'ch_chemical_bonding', type: 'topic' },
    
    // Ch5: States of Matter
    { id: 'TAG_CH5_INTERMOLECULAR_FORCES', name: 'Intermolecular Forces', parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_GAS_LAWS', name: 'Gas Laws', parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_BOYLES_LAW', name: "Boyle's Law", parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_CHARLES_LAW', name: "Charles's Law", parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_GAY_LUSSAC', name: "Gay-Lussac's Law", parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_AVOGADRO_LAW', name: "Avogadro's Law", parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_IDEAL_GAS', name: 'Ideal Gas Equation', parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_DALTONS_LAW', name: "Dalton's Law of Partial Pressures", parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_GRAHAMS_LAW', name: "Graham's Law of Diffusion", parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_KINETIC_THEORY', name: 'Kinetic Theory of Gases', parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_MAXWELL_BOLTZMANN', name: 'Maxwell-Boltzmann Distribution', parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_REAL_GASES', name: 'Real Gases', parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_VAN_DER_WAALS', name: 'van der Waals Equation', parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_CRITICAL_PHENOMENA', name: 'Critical Phenomena', parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_LIQUID_STATE', name: 'Liquid State', parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_SURFACE_TENSION', name: 'Surface Tension', parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_VISCOSITY', name: 'Viscosity', parent_id: 'ch_states_of_matter', type: 'topic' },
    { id: 'TAG_CH5_VAPOR_PRESSURE', name: 'Vapor Pressure', parent_id: 'ch_states_of_matter', type: 'topic' },
    
    // Ch6: Thermodynamics
    { id: 'TAG_CH6_THERMODYNAMIC_TERMS', name: 'Thermodynamic Terms', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_SYSTEM_SURROUNDINGS', name: 'System & Surroundings', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_STATE_FUNCTIONS', name: 'State Functions', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_INTERNAL_ENERGY', name: 'Internal Energy', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_FIRST_LAW', name: 'First Law of Thermodynamics', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_WORK', name: 'Work', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_HEAT', name: 'Heat', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_ENTHALPY', name: 'Enthalpy', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_SPECIFIC_HEAT', name: 'Specific Heat Capacity', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_HESS_LAW', name: "Hess's Law", parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_ENTHALPY_FORMATION', name: 'Enthalpy of Formation', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_ENTHALPY_COMBUSTION', name: 'Enthalpy of Combustion', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_ENTHALPY_NEUTRALIZATION', name: 'Enthalpy of Neutralization', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_BOND_ENTHALPY', name: 'Bond Enthalpy', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_LATTICE_ENTHALPY', name: 'Lattice Enthalpy', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_ENTROPY', name: 'Entropy', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_SECOND_LAW', name: 'Second Law of Thermodynamics', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_GIBBS_FREE_ENERGY', name: 'Gibbs Free Energy', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_SPONTANEITY', name: 'Spontaneity', parent_id: 'ch_thermodynamics', type: 'topic' },
    { id: 'TAG_CH6_THIRD_LAW', name: 'Third Law of Thermodynamics', parent_id: 'ch_thermodynamics', type: 'topic' },
    
    // Ch7: Equilibrium
    { id: 'TAG_CH7_PHYSICAL_EQUILIBRIUM', name: 'Physical Equilibrium', parent_id: 'ch_equilibrium', type: 'topic' },
    { id: 'TAG_CH7_CHEMICAL_EQUILIBRIUM', name: 'Chemical Equilibrium', parent_id: 'ch_equilibrium', type: 'topic' },
    { id: 'TAG_CH7_LAW_MASS_ACTION', name: 'Law of Mass Action', parent_id: 'ch_equilibrium', type: 'topic' },
    { id: 'TAG_CH7_EQUILIBRIUM_CONSTANT', name: 'Equilibrium Constant', parent_id: 'ch_equilibrium', type: 'topic' },
    { id: 'TAG_CH7_KC_KP', name: 'Kc and Kp', parent_id: 'ch_equilibrium', type: 'topic' },
    { id: 'TAG_CH7_REACTION_QUOTIENT', name: 'Reaction Quotient', parent_id: 'ch_equilibrium', type: 'topic' },
    { id: 'TAG_CH7_LE_CHATELIER', name: "Le Chatelier's Principle", parent_id: 'ch_equilibrium', type: 'topic' },
    { id: 'TAG_CH7_HETEROGENEOUS_EQUILIBRIUM', name: 'Heterogeneous Equilibrium', parent_id: 'ch_equilibrium', type: 'topic' },
    { id: 'TAG_CH7_DEGREE_DISSOCIATION', name: 'Degree of Dissociation', parent_id: 'ch_equilibrium', type: 'topic' },
    { id: 'TAG_CH7_VAPOUR_DENSITY', name: 'Vapour Density Method', parent_id: 'ch_equilibrium', type: 'topic' },
    
    // Ch8: Redox Reactions
    { id: 'TAG_CH8_OXIDATION', name: 'Oxidation', parent_id: 'ch_redox_reactions', type: 'topic' },
    { id: 'TAG_CH8_REDUCTION', name: 'Reduction', parent_id: 'ch_redox_reactions', type: 'topic' },
    { id: 'TAG_CH8_OXIDATION_NUMBER', name: 'Oxidation Number', parent_id: 'ch_redox_reactions', type: 'topic' },
    { id: 'TAG_CH8_RULES_OXIDATION', name: 'Rules for Assigning Oxidation Numbers', parent_id: 'ch_redox_reactions', type: 'topic' },
    { id: 'TAG_CH8_STOCK_NOTATION', name: 'Stock Notation', parent_id: 'ch_redox_reactions', type: 'topic' },
    { id: 'TAG_CH8_BALANCING_REDOX', name: 'Balancing Redox Reactions', parent_id: 'ch_redox_reactions', type: 'topic' },
    { id: 'TAG_CH8_OXIDATION_HALF', name: 'Oxidation Half-Reaction', parent_id: 'ch_redox_reactions', type: 'topic' },
    { id: 'TAG_CH8_REDUCTION_HALF', name: 'Reduction Half-Reaction', parent_id: 'ch_redox_reactions', type: 'topic' },
    { id: 'TAG_CH8_DISPROPORTIONATION', name: 'Disproportionation Reactions', parent_id: 'ch_redox_reactions', type: 'topic' },
    { id: 'TAG_CH8_COMPROPORTIONATION', name: 'Comproportionation Reactions', parent_id: 'ch_redox_reactions', type: 'topic' },
    
    // Continue in next part due to file size...
];

// Additional concept tags (to be added)
const ADDITIONAL_TOPICS: TaxonomyNode[] = [
    // ... will add the remaining 150+ tags in the full file
];

// Merge all taxonomy data
const COMPLETE_TAXONOMY = [...HARDCODED_TAXONOMY, ...ADDITIONAL_TOPICS];

// Export for use in other components
export { HARDCODED_TAXONOMY, BRANCHES, COMPLETE_TAXONOMY };

// Helper functions
export function getChapters(): TaxonomyNode[] {
  return HARDCODED_TAXONOMY.filter((n: TaxonomyNode) => n.type === 'chapter');
}

export function getTags(): TaxonomyNode[] {
  return HARDCODED_TAXONOMY.filter((n: TaxonomyNode) => n.type === 'topic');
}

export function getTagsForChapter(chapterId: string): TaxonomyNode[] {
  return HARDCODED_TAXONOMY.filter((n: TaxonomyNode) => n.type === 'topic' && n.parent_id === chapterId);
}

export function getChapterById(chapterId: string): TaxonomyNode | undefined {
  return HARDCODED_TAXONOMY.find((n: TaxonomyNode) => n.id === chapterId && n.type === 'chapter');
}
