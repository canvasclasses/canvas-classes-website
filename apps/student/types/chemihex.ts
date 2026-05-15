export type FunctionalGroup =
    | 'primary_alcohol' | 'secondary_alcohol' | 'tertiary_alcohol'
    | 'aldehyde' | 'ketone' | 'carboxylic_acid' | 'ester' | 'amide'
    | 'alkene' | 'alkyne' | 'alkyl_benzene' | 'vicinal_diol'
    | 'acid_chloride' | 'cyanide' | 'epoxide' | 'alkyl_halide'
    | 'methyl_ketone' | 'methyl_carbinol' | 'benzene_ring'
    | 'internal_alkyne' | 'terminal_alkyne'
    // Outputs
    | 'cleavage_products' | 'benzoic_acid' | 'diketone'
    | 'enone' | 'benzaldehyde_derivative' | 'aldehyde_or_ketone'
    | 'primary_amine' | 'secondary_amine' | 'tertiary_amine'
    | 'cis_alkene' | 'trans_alkene' | 'alkane' | 'alcohol_extended_chain'
    | 'less_substituted_alkene' | 'alkyl_chloride' | 'alkyl_chloride_instant'
    | 'alkyl_chloride_slow' | 'allylic_bromide' | 'benzylic_bromide'
    | 'carboxylic_acid_salt_plus_chx3' | 'beta_hydroxy_aldehyde'
    | 'beta_hydroxy_ketone' | 'alcohol_plus_acid_salt'
    | '1_4_cyclohexadiene'
    | string; // Allow flexible string for now

export interface GameLogic {
    valid_inputs: FunctionalGroup[];
    output_mapping: Record<string, string>;
    forbidden_groups: string[];
    mechanism_note: string;
}

export interface Reagent {
    id: string;
    name: string;
    category: string;
    description: string;
    game_logic: GameLogic;
    hint: string;
    exception: string;
    failure_msg?: string;
}

export interface MoleculeNodeData {
    id: string;
    name: string;
    smiles: string;
    type: FunctionalGroup; // The functional group this molecule represents
    q: number; // Hex grid coordinates
    r: number;
}

export interface GameEdge {
    id: string;
    source: string;
    target: string;
    reagentId: string;
}

export interface GameState {
    nodes: MoleculeNodeData[];
    edges: GameEdge[];
}
