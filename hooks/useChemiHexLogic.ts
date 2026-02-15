import { useState, useCallback } from 'react';
import { MoleculeNodeData, Reagent, GameEdge } from '../types/chemihex';
import reagentsRaw from '../data/reagents_data.json';

const reagents = reagentsRaw as unknown as Reagent[];

export interface GameState {
    nodes: MoleculeNodeData[];
    edges: GameEdge[];
}

export type ChemistryResult = {
    success: boolean;
    outputName?: string;
    outputType?: string;
    outputSmiles?: string;
    message: string;
    mechanismNote?: string;
};

// Simple SMILES mapping for prototype visualization
const PRODUCT_MAP: Record<string, string> = {
    'aldehyde': 'CC=O',
    'ketone': 'CC(=O)C',
    'carboxylic_acid': 'CC(=O)O',
    'primary_alcohol': 'CCO',
    'secondary_alcohol': 'CC(O)C',
    'tertiary_alcohol': 'CC(O)(C)C',
    'alkene': 'C=C',
    'alkyne': 'C#C',
    'alkyl_chloride': 'CCCl',
    'acid_chloride': 'CC(=O)Cl',
    'ester': 'CC(=O)OC',
    'amide': 'CC(=O)N',
    'amine': 'CCN',
    'alkane': 'CC',
};

export const useChemiHexLogic = () => {
    const [gameState, setGameState] = useState<GameState>({
        nodes: [
            { id: 'node_start', name: 'Ethanol', smiles: 'CCO', type: 'primary_alcohol', q: 0, r: 0 },
            { id: 'node_target', name: 'Ethanoic Acid', smiles: 'CC(=O)O', type: 'carboxylic_acid', q: 0, r: 4 }, // Target example
        ],
        edges: [],
    });

    const [feedback, setFeedback] = useState<ChemistryResult | null>(null);

    const validateMove = useCallback((sourceNode: MoleculeNodeData, reagentId: string): ChemistryResult => {
        const reagent = reagents.find((r) => r.id === reagentId);
        if (!reagent) return { success: false, message: 'Unknown Reagent' };

        const { valid_inputs, output_mapping, forbidden_groups, mechanism_note } = reagent.game_logic;

        // 1. Check Forbidden Groups (Simplification: checks if the source IS a forbidden group)
        // In a real app, this would check substructures.
        if (forbidden_groups.includes(sourceNode.type)) {
            return {
                success: false,
                message: reagent.exception || 'Reaction fails due to forbidden group.',
                mechanismNote: `Forbidden: ${sourceNode.type}`
            };
        }

        // 2. Check Valid Inputs
        if (valid_inputs.includes(sourceNode.type)) {
            const outputType = output_mapping[sourceNode.type];

            return {
                success: true,
                outputName: `Product (${outputType})`, // Placeholder naming
                outputType: outputType,
                outputSmiles: PRODUCT_MAP[outputType] || 'C',
                message: 'Reaction Successful!',
                mechanismNote: mechanism_note,
            };
        }

        return {
            success: false,
            message: reagent.failure_msg || reagent.exception || 'No reaction occurred.',
            mechanismNote: `Reagent ${reagent.name} does not react with ${sourceNode.type}.`
        };

    }, []);

    const handleDrop = useCallback((sourceNodeId: string, reagentId: string) => {
        const sourceNode = gameState.nodes.find((n) => n.id === sourceNodeId);
        if (!sourceNode) return;

        const result = validateMove(sourceNode, reagentId);
        setFeedback(result);

        if (result.success && result.outputType) {
            // Calculate new position (simple logic for now: next hex)
            // In a real hex grid, we'd calculate neighbor coordinates
            const newQ = sourceNode.q + 1; // Move right for now
            const newR = sourceNode.r;

            const newNode: MoleculeNodeData = {
                id: `node_${Date.now()}`,
                name: result.outputName || 'Product',
                smiles: result.outputSmiles || 'C',
                type: result.outputType as any,
                q: newQ,
                r: newR
            };

            const newEdge: GameEdge = {
                id: `edge_${Date.now()}`,
                source: sourceNode.id,
                target: newNode.id,
                reagentId: reagentId
            };

            setGameState((prev) => ({
                nodes: [...prev.nodes, newNode],
                edges: [...prev.edges, newEdge]
            }));
        } else {
            // Handle failure (animations handled in UI via feedback state)
            setTimeout(() => setFeedback(null), 2000); // Clear error after 2s
        }
    }, [gameState.nodes, validateMove]);

    return {
        gameState,
        feedback,
        handleDrop,
        reagents
    };
};
